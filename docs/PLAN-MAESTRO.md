# Plan Maestro — La mejor intranet posible (fusión de ambos sistemas)

> Objetivo declarado por el cliente: intranet **segura**, **centralizada**, con
> **notificaciones automáticas** (correo + WhatsApp) de pedidos, cotizaciones,
> facturas e inventario, que funcione **por roles** y que en el futuro incorpore
> **agentes de IA**.

---

## 1. Punto de partida: dos sistemas, dos fortalezas

### Sistema A — el del cliente (Andreas) · `punkyintranet.netlify.app`
HTML estático (Netlify) + 6 backends Google Apps Script + Google Sheets como BD +
Supabase (auth) + PC de oficina que exporta Excel de Profit 6×/día.

**Lo mejor (se conserva/absorbe):**
- **Pipeline de datos Profit probado**: Excel → extractores Python → JSON.
  Ventas, inventario por almacén, CxC y clientes REALES actualizados 6×/día.
- **Reglas de negocio destiladas** (meses de iteración real): flujo de pedidos con
  etapa **Facturación** (Recibido→CxC→Facturación→Logística→En Ruta→Entregado);
  vendedor **nunca ve USD salvo en CxC**; **margen solo admin/CFO**; almacenes
  vendibles **002 y 035**; configuración por hojas (almacenes/productos/correos
  encendibles sin tocar código); correos automáticos por evento.
- **Módulos que hoy dan valor**: BI de ventas con margen por categoría/mes,
  inventario real, CxC real, app de campo PWA offline (mercaderistas/asesores),
  dashboard supervisor, permisos granulares (14).

**Los males que lo atormentan (documentados por ellos mismos):**
- Fallas **silenciosas**: triggers que se borran solos (se perdieron los correos de
  despacho sin aviso), caches en 4 capas ("no se actualiza"), deployments a URL
  equivocada.
- **Sheets como BD**: sin transacciones, "002"→2, cruces por nombre difuso
  (facturas ruteadas al vendedor equivocado; costó 3 intentos arreglarlo).
- **Un solo punto de fallo físico**: toda la data depende de UNA PC encendida con
  los Excel cerrados.
- **Seguridad**: API de pedidos abierta a "Anyone" sin token (deuda documentada),
  protección de páginas solo en el navegador, cartera de clientes estuvo pública,
  `costos-data.json` (márgenes) sigue público.
- **No apto para agentes de IA**: un agente operando sobre Sheets + GAS sin
  transacciones ni permisos de servidor es un riesgo, no una función.

### Sistema B — el nuestro (este repo) · `http://80.241.212.7`
React + Express/TS + PostgreSQL en el VPS propio del cliente, Docker.

**Lo mejor (es la base):**
- **Cimientos**: BD real con migraciones, roles verificados EN el servidor, sesiones
  httpOnly, BD y API cerradas a internet, deploy reproducible (`punky-deploy`).
- **El flujo transaccional que el otro no tiene**: cotización por productos con
  stock y precios del inventario (validados en servidor) → aprobación CxC →
  despacho con timeline → hoja imprimible con firmas.
- **Capa de notificaciones** correo + WhatsApp (Twilio/Cloud API intercambiables)
  con bitácora en BD y a prueba de fallos.
- **Modo TV** (centro de operaciones) y móvil first.
- **API-first**: cada acción es un endpoint con permisos → exactamente lo que un
  agente de IA necesita para operar con seguridad.

**Lo que le falta hoy:** datos reales (inventario demo hasta conectar la fuente),
BI de ventas/margen, CxC real, app de campo, permisos granulares finos.

## 2. Decisión de arquitectura

**La base es el Sistema B** (VPS + Postgres + API). No por gusto: porque los
4 objetivos del cliente (seguridad, centralización, notificaciones, IA futura)
son exactamente las 4 debilidades estructurales del stack A, y no se corrigen
"puliendo" — son los cimientos.

**El Sistema A no se bota**: se absorbe por módulos, y **nada se apaga hasta que
su reemplazo esté vivo y validado**. Su pipeline de datos es el puente inicial.

## 3. Hoja de ruta por fases

### Fase 1 — El puente de datos (la jugada clave) 🔴
Adaptar los extractores existentes (`extraer_inventario/cxc/ventas/clientes.py`)
para que además de generar JSON a Drive, **los envíen a la API de la intranet
nueva** (endpoint de ingesta autenticado con token). El `ProfitPlusConnector`
gana un modo `pipeline` que lee esas tablas.

**Resultado inmediato**: los vendedores cotizan con **inventario y precios
reales**, CxC ve saldos reales, y desaparece el catálogo demo — sin esperar el
acceso al SQL Server y sin tocar el sistema A (la misma corrida alimenta a ambos).

### Fase 2 — Seguridad y usuarios 🔴
- Gestión de usuarios en la intranet (crear/desactivar, cambiar contraseñas —
  hoy todos tienen `punky123`).
- Evolución de roles → **permisos granulares** (modelo de los 14 permisos del
  sistema A: `dash_ventas`, `ver_margen`, `ped_cxc`, etc.).
- HTTPS con dominio + `COOKIE_SECURE=true`.

### Fase 3 — Flujo comercial completo 🟠
- Incorporar la etapa **Facturación** al workflow (CxC → Facturación → Despacho),
  como en el proceso real del sistema A. "Cotización aprobada" se convierte en
  **pedido** con los mismos renglones (unifica los dos conceptos).
- Registro de **facturas** (número de factura de Profit sobre el pedido) +
  notificaciones de factura emitida.
- Config de notificaciones por evento (encender/apagar, destinatarios) — la idea
  de `Config_Correos` pero en BD con UI.

### Fase 4 — BI y visibilidad 🟠
- **Ventas Analítica** portada: ventas por vendedor/categoría/cliente, márgenes
  (solo admin/CFO), comparaciones por tramo. La data ya entra por la Fase 1.
- **CxC como módulo de consulta** (saldos, vencidos) integrado a la aprobación:
  el aprobador ve la deuda del cliente al decidir.
- Nuevas escenas del TV con datos reales (ventas del día, margen del mes).

### Fase 5 — Campo y RRHH 🟢
- Portar la **app de campo** (visitas, fotos, offline) a la plataforma — es el
  módulo más grande del sistema A; mientras tanto sigue funcionando el actual.
- RRHH al final (el menos crítico).

### Fase 6 — Agentes de IA 🟢
Sobre la API con permisos: agente de reportes (resumen diario a WhatsApp del
Owner), agente de cobranza (detecta vencidos y redacta recordatorios), agente de
inventario (alerta quiebres antes de cotizar). El sistema A ya experimentó aquí
(ai-backend con Anthropic): la idea se hereda, la ejecución se hace sobre una
plataforma que un agente no puede romper.

### Transversal
- El SQL Server de Profit (lectura directa o escritura) **sigue en el plan** como
  reemplazo del puente de Excel cuando haya acceso; la interfaz del conector no
  cambia. La experiencia del sistema A sugiere tratar la escritura directa con
  cautela y validar con el proveedor de Profit.

## 4. Reglas heredadas del sistema A (obligatorias en la nueva)

1. Vendedor nunca ve montos USD, **excepto** en CxC.
2. Margen/costos: solo admin/CFO. Jamás en un JSON público.
3. Almacenes vendibles: 002 y 035 (mapean a Almacén Boleíta / Almacén Principal —
   confirmar mapeo exacto con el cliente).
4. Todo correo/WhatsApp automático debe poderse apagar por configuración sin deploy.
5. En cruces difusos (cliente↔vendedor), ante la duda NO adivinar: a revisión manual.
6. Nada de datos de negocio en archivos estáticos públicos.
7. Toda función que recree triggers/jobs debe recrear la lista completa (lección
   aprendida a sangre en el sistema A; aplica a nuestros crons futuros).
