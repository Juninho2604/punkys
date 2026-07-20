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
API **no** están expuestos a internet; solo el puerto web del host (`WEB_PORT`,
por defecto **8080** — el 80 lo usa otro servicio del VPS, "Hermes").

### Piezas del servidor

- **Precios**: la cotización se compone de **renglones de productos** cuyos precios
  vienen SIEMPRE del inventario (conector Profit Plus) — el servidor busca cada
  producto por código, valida stock en la sede de origen y calcula subtotal + IVA
  16%. El cliente jamás manda precios. (`services/workflow.ts::crearCotizacion`).
  El modelo viejo de transporte (peso × tarifa, `services/pricing.ts::SERVICIOS`)
  quedó solo para mostrar cotizaciones históricas.
- `services/workflow.ts` — el corazón: crear cotización (valida stock por sede y
  precios contra el inventario, upsert de cliente por RIF, numeración `COT-XXXX`
  atómica vía `counters`, inserta `quote_items`), enviar a aprobación (push a
  Profit Plus con renglones + email a CxC), aprobar (crea envío `ENV-XXXX` con
  milestones y docs + notifica cliente por WhatsApp/email, a despacho y al
  vendedor), rechazar, devolver a pendiente (borra el envío solo si no avanzó),
  avanzar envío (milestone + estado derivado de `done` 0–5 + WhatsApp), incidencias.
- `notifications/` — fachada `notifier` con proveedores intercambiables por env:
  email `console|smtp` (nodemailer), whatsapp `console|twilio|cloudapi` (fetch
  directo, sin SDKs). **Todo envío queda en `notification_log`**; un fallo de
  proveedor jamás rompe el workflow. Copys en `templates.ts`. Teléfonos venezolanos
  se normalizan a E.164 (`0412-…` → `+58412…`).
- `integrations/profitplus/` — interfaz `ProfitPlusConnector`: `pushQuote` (inyección),
  `searchProducts`/`getProducts` (**inventario con stock por sede** — la fuente de
  los renglones y precios de la cotización). `SimulatedConnector` activo sirve un
  **catálogo DEMO** de 12 productos de mascotas para validar el flujo completo;
  `SqlServerConnector` esqueleto. ⚠️ En producción los vendedores ven ese catálogo
  demo hasta que se conecte el ERP. Ver `docs/integracion-profit-plus.md`.
- `routes/tv.ts` — endpoint agregado del modo TV, protegido por `TV_ACCESS_KEY`.
- `db/seed.ts` — datos demo (⚠️ **borra todo**; solo primera vez / desarrollo).
  `db/clean.ts` — borra datos de negocio, **conserva usuarios**, numeración a cero.

### Modelo de datos (Postgres, migraciones Knex)

`users` (rol: vendedor|cxc|despacho|admin) · `clients` (upsert por RIF) ·
`quotes` (snapshot del cliente + totales + estado generada|pendiente|aprobada|rechazada
+ `pp_sync_status`; los campos del modelo viejo de transporte son nullable) ·
`quote_items` (**renglones**: código, nombre, precio_unit, cantidad, total) ·
`shipments` (estado derivado de `done` 0–5 + flag incidencia) ·
`shipment_milestones` (5 hitos) · `shipment_docs` · `notification_log` · `counters`.

### Roles y permisos

| Rol | Ve / puede |
|---|---|
| vendedor | Dashboard, Cotización (wizard), Despacho (lectura) |
| cxc | Dashboard, Aprobaciones (kanban + acciones) |
| facturacion | Dashboard, Facturación (registrar nº de factura → crea el despacho) |
| despacho | Dashboard, Despacho (avanzar etapas, incidencias, transportista) |
| admin (Owner) | Todo + Usuarios + Sistema de Diseño + estado de integraciones |

El middleware `requireRole` lo exige en el servidor (no es solo UI). Admin siempre pasa.

**Gestión de usuarios (Fase 2)**: pantalla **Usuarios** (solo admin) para crear,
cambiar rol, activar/desactivar y restablecer contraseñas; todos los roles pueden
cambiar su propia clave (icono 🔑 del header). Guardas del servidor: no puedes
desactivarte a ti mismo ni dejar la intranet sin un admin activo; usuarios
inactivos no pueden loguearse. Reemplaza el rol que cumplía Supabase en el
sistema previo del cliente (aquí el login y los permisos viven en nuestra BD,
sin servicios externos). Permisos granulares por módulo (modelo de los 14 del
sistema previo): pendiente, llegará con los módulos de BI.

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
  destino **Caracas por defecto** con casilla "¿Va a otra ciudad?". Paso 3 =
  **Productos**: buscador del inventario con stock por sede (verde/ámbar/rojo),
  renglones con stepper de cantidad topado al stock, subtotal en vivo. Si cambia la
  sede de origen se vacía la lista (el stock es por sede). Mobile-first, verificado
  completo en 390×844.

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
- **Puerto**: el 80 lo ocupa otro servicio del VPS ("Hermes", agente de IA del
  cliente — **no se toca**). Punky publica en `WEB_PORT` (por defecto **8080**):
  el sitio es `http://80.241.212.7:8080`. Configurable en el `.env` del VPS.
- `.env` de producción (en el VPS, no en git): `POSTGRES_PASSWORD`, `JWT_SECRET`,
  `CLIENT_ORIGIN=http://80.241.212.7:8080`, `WEB_PORT=8080`, `COOKIE_SECURE=false`
  (¡HTTP! — pasar a `true` al activar HTTPS), `TV_ACCESS_KEY`.
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
   arriba en `http://80.241.212.7:8080`, comando `punky-deploy`.
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
10. **Cotización por productos**: renglones desde el inventario (conector Profit
    Plus) con validación de stock por sede, migración `quote_items`, wizard con
    buscador mobile-first, hoja imprimible por renglones, kanban/dashboard/TV y
    plantillas de notificación adaptados. La hoja imprimible ahora es por renglones
    (con fallback al modelo viejo para históricas).
13. **BI de ventas + CxC (Fase 4)**: por el mismo puente entran `cxc` (saldos por
    documento) y `ventas` (agregado mes×vendedor×categoría con margen). **CxC visible
    al aprobar**: cada cotización pendiente muestra el saldo del cliente (cruce por
    nombre normalizado, exacto o nada — lección heredada) con alerta ámbar/roja si hay
    vencido. Página **Cuentas por Cobrar** (cxc/admin) y **Ventas Analítica** (solo
    admin, con margen; el margen se filtra en el servidor para no-admin). Endpoints
    `/api/sync/cxc`, `/api/sync/ventas`, `/api/cxc`, `/api/ventas/resumen`; scripts
    `sync_cxc.py` y `sync_ventas.py`.
12. **Etapa de Facturación (Fase 3)**: flujo real CxC → Facturación → Despacho.
    Aprobar YA NO crea el envío: notifica al equipo de facturación; la página
    Facturación registra el nº de factura de Profit (único, validado) y AHÍ nace
    la orden de despacho con sus notificaciones. Estado nuevo 'facturada'
    (columna Aprobado del kanban la incluye, sin devolver); embudo del TV con 5
    etapas y evento 🧾 en el ticker; nº de factura en la hoja imprimible.
11. **Puente de datos (Fase 1 del plan maestro)**: tablas `pp_products`/`sync_log`,
    endpoint `POST /api/sync/productos` (token `SYNC_TOKEN`, sync completa con
    desactivación de descontinuados), conector `PROFIT_PLUS_MODE=pipeline` que
    cotiza contra el inventario sincronizado, y `pipeline/sync_inventario.py`
    para la PC del cliente (lee catalogo-activo.json + lista-precios-data.json
    de los extractores existentes). Ver `docs/puente-datos.md`.
14. **Comisiones (Fase 5)**: comisión de vendedores **sobre lo cobrado** en
    Profit, corte **quincenal** (1–15 y 16–fin de mes). Dataset nuevo
    `cobranzas` por documento (`POST /api/sync/cobranzas` + `pp_cobranzas`,
    script `sync_cobranzas.py`; ⚠️ requiere export de cobranzas en la PC —
    confirmar fuente con el cliente). El **% es por vendedor** y TODO el módulo
    es **solo admin** (`/api/comisiones`, página Comisiones): configurar %,
    marcar quincena pagada (snapshot inmutable de base/%/monto + referencia de
    transferencia + quién/cuándo) y deshacer. Si luego cambia el %, los pagos
    registrados no se alteran. Cruce por nombre de vendedor normalizado.
15. **Compras & CxP (Fase 6 · consultas Profit, lado del gasto)**: datasets
    `compras` (facturas de compra por documento → `pp_compras`) y `cxp` (deuda a
    proveedores → `pp_cxp`, espejo de la CxC). Página **Compras & Por Pagar**
    (solo admin): compras por mes, top proveedores, últimas compras y CxP por
    proveedor con vencido. `GET /api/compras/resumen`; scripts `sync_compras.py`
    y `sync_cxp.py` (⚠️ extractores de compras/CxP por confirmar en la PC).
    Con esto el dueño ve ambas caras: ingreso (ventas/cobranzas/CxC) y gasto
    (compras/CxP). El "todo Profit en vivo" llegará con el conector sqlserver.

## 8. Pendientes / roadmap

| Prioridad | Tema |
|---|---|
| 🔴 Alta | **Cambiar las contraseñas de demo** (`punky123`) usando la nueva pantalla Usuarios, y crear los usuarios reales del equipo |
| 🔴 Alta | **Activar el puente de datos** (código listo, ver `docs/puente-datos.md`): SYNC_TOKEN + PROFIT_PLUS_MODE=pipeline en el VPS + script en la PC del cliente. Decisiones pendientes: mapeo de sedes 002/035, lista de precios, moneda USD/Bs |
| 🟡 Media | Credenciales **Twilio** (y luego migración a Cloud API con plantillas aprobadas de Meta) y **SMTP** — hoy todo en modo `console` |
| 🟡 Media | **Profit Plus**: implementar `SqlServerConnector` — el usuario gestiona con otra IA la investigación del esquema/acceso al SQL Server (lectura + inyección) |
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

- **`docs/PLAN-MAESTRO.md`** — hoja de ruta oficial de la fusión con el sistema
  previo del cliente (GAS/Sheets/Netlify, analizado en julio 2026): qué se absorbe
  de cada uno y en qué orden. **Leer junto con este documento.**

- `README.md` — setup local y visión general
- `docs/deploy-vps.md` — guía completa del VPS (incl. HTTPS futuro)
- `docs/integracion-profit-plus.md` — qué falta del cliente y cómo activar
- `docs/notificaciones.md` — proveedores de email/WhatsApp y migración a Cloud API
