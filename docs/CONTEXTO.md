# Contexto del proyecto · Punky Intranet

> Documento de contexto integral: qué es, qué decisiones se tomaron, qué está
> construido, cómo está desplegado y qué falta. Última actualización: julio 2026.

---

## 1. Qué es

Intranet logística B2B para **Punky Partners** (tienda de productos para mascotas,
Venezuela). Reemplaza el proceso que vivía en un Excel que pasaba de área en área:

```
Vendedor cotiza  →  Cuentas por Cobrar aprueba/rechaza  →  Despacho entrega
```

La intranet centraliza ese flujo, dispara **emails y WhatsApp automáticos** en cada
paso, y está preparada para **inyectar cotizaciones en Profit Plus 2K12** (el ERP
del cliente, SQL Server) cuando se reciba acceso.

## 2. Decisiones clave (y su porqué)

| Decisión | Elección | Motivo |
|---|---|---|
| Stack | React+Vite / Express+TS / PostgreSQL | Separación clara, fácil de desplegar en VPS |
| Profit Plus 2K12 | Conector desacoplado, **modo simulado** activo | No hay acceso aún al SQL Server; el cliente entregará un `.md` con esquema y credenciales |
| WhatsApp | **Twilio** hoy, interfaz intercambiable | El cliente prevé migrar a WhatsApp Business Cloud API: es cambiar `WHATSAPP_PROVIDER` |
| Roles | Por área desde el día 1 | vendedor / cxc / despacho / admin — es el flujo real de la empresa |
| Deploy | Docker Compose en VPS + comando `punky-deploy` | Un comando levanta todo; el usuario prefirió deploy manual a CI (el workflow de GitHub Actions existe pero **no está activado**) |
| Acceso VPS | Se trabaja como **root** (decisión del usuario) | Se le explicó el trade-off de seguridad |
| Repo en el VPS | Clonado por **HTTPS con token personal** (fine-grained, solo lectura de `punkys`) | Las Deploy Keys no eran accesibles con sus permisos de GitHub |

## 3. Arquitectura

Monorepo npm workspaces:

```
├── client/    React 18 + TS + Vite · SPA con CSS global (tokens del handoff)
├── server/    Express + TS (ESM) · Knex + PostgreSQL · JWT en cookie httpOnly
├── docs/      este documento + guías específicas
├── docker-compose.yml   db (Postgres 16) + server (API) + web (Nginx)
└── .github/workflows/deploy.yml   CI de deploy por SSH (INACTIVO: faltan secrets)
```

**En producción**: Nginx (contenedor `web`) sirve el build estático y proxya
`/api` → `server:4000`. Mismo origen ⇒ sin CORS y cookies directas. Postgres y la
API **no** están expuestos a internet; solo el puerto 80.

### Piezas del servidor

- `services/pricing.ts` — motor de precios, **fuente de verdad** (el cliente muestra
  desglose en vivo pero el servidor siempre recalcula). Servicios: Terrestre
  (Bs. 850 + 12/kg), Express 24h (2.400 + 28/kg), Cadena de Frío (1.900 + 22/kg),
  Manejo Especial (1.400 + 18/kg). Seguro 2% del valor declarado, IVA 16%.
  ⚠️ Tarifas de demo: **pendiente confirmar las reales con el cliente**.
- `services/workflow.ts` — el corazón: crear cotización (upsert de cliente por RIF,
  numeración `COT-XXXX` atómica vía tabla `counters`), enviar a aprobación (push a
  Profit Plus + email a CxC), aprobar (crea envío `ENV-XXXX` con milestones y docs +
  notifica cliente por WhatsApp/email, a despacho y al vendedor), rechazar,
  devolver a pendiente (borra el envío solo si no avanzó), avanzar envío
  (milestone + estado derivado de `done` 0–5 + WhatsApp al cliente), incidencias.
- `notifications/` — fachada `notifier` con proveedores intercambiables por env:
  email `console|smtp` (nodemailer), whatsapp `console|twilio|cloudapi` (fetch
  directo, sin SDKs). **Todo envío queda en `notification_log`**; un fallo de
  proveedor jamás rompe el workflow. Copys en `templates.ts`. Teléfonos venezolanos
  se normalizan a E.164 (`0412-…` → `+58412…`).
- `integrations/profitplus/` — interfaz `ProfitPlusConnector` con `SimulatedConnector`
  (activo, devuelve refs `PP-SIM-*`) y `SqlServerConnector` (esqueleto). Ver
  `docs/integracion-profit-plus.md` para los requisitos pendientes del cliente.
- `routes/tv.ts` — endpoint agregado del modo TV, protegido por `TV_ACCESS_KEY`.
- `db/seed.ts` — datos demo (⚠️ **borra todo**; solo primera vez / desarrollo).
  `db/clean.ts` — borra datos de negocio, **conserva usuarios**, numeración a cero.

### Modelo de datos (Postgres, migraciones Knex)

`users` (rol: vendedor|cxc|despacho|admin) · `clients` (upsert por RIF) ·
`quotes` (snapshot del cliente + desglose + estado generada|pendiente|aprobada|rechazada
+ `pp_sync_status`) · `shipments` (estado derivado de `done` 0–5 + flag incidencia) ·
`shipment_milestones` (5 hitos) · `shipment_docs` · `notification_log` · `counters`.

### Roles y permisos

| Rol | Ve / puede |
|---|---|
| vendedor | Dashboard, Cotización (wizard), Despacho (lectura) |
| cxc | Dashboard, Aprobaciones (kanban + acciones) |
| despacho | Dashboard, Despacho (avanzar etapas, incidencias, transportista) |
| admin (Owner) | Todo + Sistema de Diseño + estado de integraciones |

El middleware `requireRole` lo exige en el servidor (no es solo UI). Admin siempre pasa.

## 4. Frontend

Recreación **hi-fi** del handoff de diseño (`Diseño Intranet Logística Corporativa`,
carpeta `design_handoff_punky_intranet` — no está en el repo). Tokens exactos en
`client/src/styles.css` (:root): paleta brand/sky/ink, Baloo 2 + Nunito Sans
(Google Fonts), radios, sombras. Pantallas:

- **Login** con la mascota frenchie animada que **se tapa los ojos** al enfocar la
  contraseña (`MascotaFrenchie.tsx`, prop `hideEyes`).
- **Dashboard** (KPIs + envíos recientes + panel por aprobar con acciones inline
  para cxc/admin), **Cotización** (wizard 4 pasos, desglose en vivo),
  **Aprobaciones** (kanban 3 columnas), **Despacho** (listado + detalle con
  timeline vertical), **Sistema de Diseño** (QA visual, solo admin).
- **Responsive**: <900px el sidebar es un drawer con hamburguesa; grillas colapsan;
  tablas con scroll horizontal. Verificado sin overflow en 390×844.
- **Wizard**: origen = 2 sedes reales (**Almacén Boleíta**, **Almacén Principal**);
  destino **Caracas por defecto** con casilla "¿Va a otra ciudad?" que despliega el
  campo de ciudad.

## 5. Centro de Operaciones (modo TV)

Pantalla `/tv/<clave>` para un TV de oficina: **solo lectura, sin login** (clave
estática `TV_ACCESS_KEY` en el `.env`; vacía = deshabilitado). Tema oscuro azul
marino, tipografía a distancia, cursor oculto.

- **5 escenas** rotando cada 12 s: Pulso del negocio → Embudo operacional →
  Esperando aprobación (aging en colores) → Despachos en curso (incidencias
  primero) → Actividad reciente.
- **Fijos**: barra superior (logo, reloj, "actualizado hace Xs" que se pone rojo si
  pierde conexión) y ticker inferior con eventos desfilando.
- **Banner rojo pulsante** persistente mientras haya incidencias activas.
- **Celebración** 🎉: al detectar entre polls (cada 20 s) una aprobación o entrega
  nueva → overlay 7 s con confeti CSS y el texto del evento.
- La tasa de aprobación del embudo se calcula sobre las **decididas** del mes
  (aprobadas+rechazadas), no sobre las creadas (evita >100% por mezclar cohortes).

## 6. Producción (estado actual)

- **VPS Contabo Ubuntu · IP `80.241.212.7`** · se opera como **root** por SSH.
- Repo en `/root/punky-intranet`, rama desplegada: `claude/pet-store-intranet-dd9wqs`
  (⚠️ no `main`; pendiente merge).
- **Deploy**: comando **`punky-deploy`** (script en `/usr/local/bin/`, definido a
  mano en el VPS): `git pull` + `docker compose up -d --build` + `docker image
  prune -f` + `docker builder prune -f --keep-storage=2gb` + muestra `docker system df`.
- **Higiene de disco**: logs de contenedores rotados (3×10 MB c/u, en el compose);
  imágenes huérfanas y caché de build se limpian en cada deploy. Los datos viven en
  el volumen `pgdata` y **nunca** los toca la limpieza.
- `.env` de producción (en el VPS, no en git): `POSTGRES_PASSWORD`, `JWT_SECRET`,
  `CLIENT_ORIGIN=http://80.241.212.7`, `COOKIE_SECURE=false` (¡HTTP! — pasar a
  `true` al activar HTTPS), `TV_ACCESS_KEY`.
- **Datos**: la base fue limpiada de demos (`clean.js`); el cliente está validando
  con datos reales. Numeración arrancó en `COT-0001`/`ENV-0001`.
- **Usuarios** (⚠️ contraseña `punky123` en TODOS — cambio pendiente):
  `admin@` (Owner) · `ventas@` · `cxc@` · `despacho@punkypartners.com`.
- HTTPS: pendiente de que el cliente tenga dominio (guía en `docs/deploy-vps.md` §7).

### Operación diaria (VPS)

```bash
punky-deploy                                   # desplegar cambios de GitHub
docker compose logs -f server                  # ver API + notificaciones simuladas
docker compose exec server node dist/db/clean.js   # ⚠️ borra datos de negocio
docker compose exec -T db pg_dump -U punky punky_intranet > backup.sql  # respaldo
```

Las migraciones se aplican **solas** al arrancar el contenedor `server`.
**Nunca** correr `seed.js` en producción (borra todo y repuebla con demos).

## 7. Cronología de lo entregado

1. **Base completa**: backend (auth, roles, workflow, pricing), notificaciones,
   conector Profit Plus, frontend hi-fi (7 pantallas), seed demo.
2. **Deploy**: Docker Compose, Nginx, guía Contabo, ajustes cookie/proxy.
3. **Puesta en marcha real**: VPS configurado, firewall, token GitHub, stack
   arriba en `http://80.241.212.7`, comando `punky-deploy`.
4. **Vista móvil**: drawer, grillas responsive, tablas con scroll.
5. **Limpieza de demos** (`clean.ts`) + estados vacíos con mensaje guía.
6. **Sedes reales** en el wizard + destino Caracas por defecto.
7. **Higiene de disco**: rotación de logs + prune de build cache en cada deploy.
8. **Centro de Operaciones TV** (fases 1 y 2 completas).
9. **Cotización imprimible**: hoja formal carta en blanco y negro
   (`/cotizaciones/:id/imprimir`, fuera del Shell) con membrete, datos completos,
   desglose y firmas de **Director** y **Gerente de Cuentas por Cobrar**; cabe en
   una sola página. Botones: pantalla de éxito del wizard y tarjetas del kanban
   (🖨). Endpoint `GET /api/quotes/:id`.

## 8. Pendientes / roadmap

| Prioridad | Tema |
|---|---|
| 🔴 Alta | **Gestión de usuarios**: cambiar contraseñas (todas siguen en `punky123`), crear usuarios reales del equipo, desactivar |
| 🔴 Alta | **Tarifas reales** de los 4 servicios (hoy son de demo) en `pricing.ts` |
| 🟡 Media | Credenciales **Twilio** (y luego migración a Cloud API con plantillas aprobadas de Meta) y **SMTP** — hoy todo en modo `console` |
| 🟡 Media | **Profit Plus**: implementar `SqlServerConnector` cuando llegue el `.md` del cliente (requisitos en `docs/integracion-profit-plus.md`) |
| 🟡 Media | Dominio + **HTTPS** (certbot; pasar `COOKIE_SECURE=true`) — guía lista en `docs/deploy-vps.md` |
| 🟢 Baja | Merge a `main` + activar GitHub Actions (secrets `VPS_HOST/USER/SSH_KEY`) |
| 🟢 Baja | Mapa de ruta real en el detalle de despacho (hoy placeholder del diseño) |
| 🟢 Baja | Orden de despacho imprimible (la cotización ya lo es) |

## 9. Convenciones y gotchas

- Server ESM: los imports internos llevan **extensión `.js`** aun siendo `.ts`.
- Dinero: `numeric` en BD (llega como **string** al cliente; `fmtBs()` formatea
  es-VE `Bs. 1.234,56`). El wizard acepta coma o punto decimal.
- Estados de envío se **derivan** de `done` (0–5): ≤1 Preparando · 2–3 En tránsito ·
  4 En reparto · 5 Entregado · flag `incidencia` los pisa con "Incidencia".
- El RIF valida `[VEJPG]-XXXXXXXX-X`; los clientes se upsertean por RIF al cotizar.
- Playwright del sandbox de desarrollo: ejecutable en
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; Google Fonts está bloqueado
  ahí (las capturas salen con fuente fallback — en producción cargan bien).

## 10. Documentos relacionados

- `README.md` — setup local y visión general
- `docs/deploy-vps.md` — guía completa del VPS (incl. HTTPS futuro)
- `docs/integracion-profit-plus.md` — qué falta del cliente y cómo activar
- `docs/notificaciones.md` — proveedores de email/WhatsApp y migración a Cloud API
