# Migración y corte (cutover): sistema paralelo del cliente → intranet Punky

> Bitácora viva del corte. El cliente (andreas@punkypartners.com) opera hoy en
> su "intranet" hecha en Google Sheets (usados como base de datos) + Apps Script
> + Supabase. Este documento registra QUÉ data hay, HASTA qué fecha, CÓMO la
> traemos, y el procedimiento del **arrastre final** el día que se apague su
> sistema. Todo el acceso a sus Sheets es de **solo lectura**.

**Snapshot de este inventario:** 2026-07-23
**Fecha de corte objetivo:** _por definir_
**Modo:** cutover (reemplazo) — se congela su sistema y se arrastra el delta. _(confirmar vs. espejo continuo)_

---

## 1. Estrategia: "congelar y arrastrar"

1. Hoy documentamos el estado y traemos la data histórica (ensayo de migración).
2. Se acuerda una **fecha de corte**. Desde ese momento nadie crea pedidos en el
   sistema viejo (freeze).
3. El día del corte corremos el importador con los Sheets **congelados** →
   trae el delta final.
4. El equipo empieza a operar en la intranet. Los Sheets quedan de respaldo
   (solo lectura), no se borran.

No se toca ni modifica nada en sus Sheets en ningún momento.

---

## 2. Inventario de datos (fuente → destino)

### "Punky - Configuración" (`1Unz…SNBPsG0`) — 8 pestañas

| Pestaña | Filas | ¿Migrar? | Destino en la intranet |
|---|---|---|---|
| Productos | ~44 | ✅ | `op_productos` (ya espejado, Ola 1) |
| Almacenes | 17 | ✅ | `op_almacenes` (ya espejado) |
| Categorías/Marcas | 5 | ✅ | `op_categorias` (ya espejado) |
| Config_Vendedores (nombre→correo) | 8 | ✅ | `users` (rol vendedor) + `cxc_vendedor_correo` |
| Config_Mercaderistas (nombre→correo) | 2 | ✅ | `users` (rol mercaderista) |
| Grupos de correo (grupo→correos) | 3 | ✅ | **NUEVA** `notif_grupos` |
| Tipos de Notificación (clave/activo/para/cc) | 12 | ✅ | **NUEVA** `notif_tipos` (flags + ruteo) |
| Log de Notificaciones (histórico de envíos) | ~414 | ⭕ opcional | `notif_log` (solo si se quiere el histórico) |

> Nota: `clave` en "Tipos de Notificación" es la LLAVE del tipo (`stock_critico`,
> `pedido_entregado`…), **no** una contraseña. En ninguno de los dos Sheets hay
> contraseñas ni secretos.

### "Pedidos Punky" (`1gveN…lB9DE`) — 8 pestañas

| Pestaña | Filas | ¿Migrar? | Destino |
|---|---|---|---|
| Dashboard | — | ❌ | UI (modo TV); se regenera con queries |
| Pedidos ACTIVOS (maestro) | ~62 | ✅ | `pedidos` (tabla principal) |
| Pedidos históricos/Entregados | ~123 | ✅ | `pedidos` (mismo destino; archivo) |
| Auditoría / Cambios de estado | ~355 | ✅ | `pedido_estado_log` (equivale a `quote_estado_log`) |
| Cola CxC | ~182 | 🔁 vista | Filtro `estado='CXC'` de `pedidos` (no tabla propia) |
| Cola Facturación | ~176 | 🔁 vista | Filtro `estado='Facturación'`; captura **Nro. Nota** y **Nro. Factura** |
| Fletes / Transportistas (semana/costo) | ~23 | ✅ | costos de flete (módulo Costos) |
| Logística / Despacho (29 columnas) | ~84 | ✅ | `shipments` (enriquecer, ver §4) |

**Ciclo de vida del pedido (suyo):** Recibido → CXC → Aprobado CXC → Facturación
→ Logística → En Ruta → Entregado. Cada etapa tiene su columna de fecha.

---

## 3. Cómo la traemos (método)

- Se lee su Drive **directo** (acceso de lectura ya disponible) → un **importador
  one-shot** parsea cada pestaña e inserta en la intranet. **No** requiere
  publicar los Sheets como CSV ni SMTP ni tocar nada del lado del cliente.
- Normalizaciones necesarias:
  - **`Productos`** de cada pedido es texto libre: `24 x Lamichi Salmon 4x15g | 24 x …`.
    Hay que **parsearlo a renglones** (cantidad × nombre) y cruzar el nombre con
    `op_productos`/`pp_products`.
  - Cruces: **Cliente** por `Cod. Cliente` + `RIF`; **Almacén** por código
    (coincide con Profit); **Lista de Precios** por nombre; **Vendedor** por
    nombre visible (join a Config_Vendedores).
  - Montos con coma/punto mezclados (la hoja de Logística es la más sucia):
    parser tolerante.
- El importador es **idempotente** (por `# Pedido`) para poder correrlo el día
  del ensayo y de nuevo el día del corte sin duplicar.

---

## 4. Paridad de funciones (¿podemos hacer TODO lo que su intranet hace?)

### Cubierto — e incluso mejorado

| Su sistema | La nuestra | Mejora |
|---|---|---|
| Ventas (getVentas/Hist/Recent) | Ventas Analítica | Lee Profit EN VIVO (réplica), no JSON cacheado |
| Catálogo/stock | Réplica Profit + Catálogos curados | — |
| Lista de precios | saArtPrecio (réplica) | — |
| CxC | Cuentas por Cobrar | + notas colaborativas |
| **Correo diario CxC** | `cxcDiario` | Antigüedad, vence-7d, créditos, notas, Bs/USD |
| Costos de envío | Módulo Costos | — |
| Pagos/Bancos | **Tesorería** (posición Bs/USD + proyección) | Más completo |
| Visitas/degustaciones/asesores (GPS, fotos) | Módulo Visitas | — |
| Reportes automáticos | Reportes deterministas **+ Reposición** | Sin costo de API |
| Auth (Supabase) | JWT propio + `users` | Sin dependencia externa |
| — | **Reposición / forecast de compras** | Nosotros lo tenemos, él no |
| Pedidos: ciclo de vida + auditoría de estados | quotes + `quote_estado_log` | ✅ |
| Facturación: Nº Nota + Nº Factura | Facturación (nº factura) | Falta Nº Nota (ver abajo) |

### Huecos a cerrar ANTES de garantizar paridad 100 %

1. **Campos de logística en `shipments`.** Su hoja de Logística captura cosas que
   hoy no guardamos:
   - `Tipo de Transporte` (Moto/…), `Ruta`, `Devolución`.
   - **Unidades Fable / Unidades PP** y **Monto Fable / Monto PP** (split por línea).
   - `Kilos Aprox`, `Promesa de Entrega` vs `Fecha Compromiso Logística`,
     `Días para Entregar`, `Detalle Incidencia`, `Comentario Logística`.
   → Se agregan como columnas a `shipments` (aditivo, bajo riesgo).
2. **Nº de Nota de entrega** en Facturación (hoy guardamos Nº Factura, falta Nº Nota).
3. **Config de notificaciones**: `notif_grupos` + `notif_tipos` (flags + ruteo) —
   base para activar las notificaciones reales. Depende también de **SMTP** (dueño).
4. **Control de líneas telefónicas** (17 líneas por depto.) — utilitario menor.
   _Decisión de alcance: ¿dentro o fuera?_
5. **El importador** en sí (parser de `Productos`, cruces, idempotencia).

> Lectura honesta: en lo administrativo y de cobranza estamos **por encima**. La
> paridad total depende de cerrar los campos de logística (#1) y el importador
> (#5); lo demás es config/menor.

---

## 5. Procedimiento del arrastre final (día del corte)

1. **Freeze**: se avisa que el sistema viejo queda de solo lectura; no se crean
   pedidos nuevos allá.
2. Se corre el importador con los Sheets congelados (mismo que el ensayo).
3. **Verificación** de conteos:
   - pedidos migrados vs. filas de "Pedidos ACTIVOS" + "Históricos".
   - transiciones de estado vs. "Auditoría".
   - filas de logística vs. hoja "Logística".
4. Revisión rápida por muestreo (5–10 pedidos: cliente, renglones, estado, fechas).
5. **Cutover**: el equipo empieza a operar en la intranet.
6. Los Sheets quedan archivados (respaldo), no se borran.

---

## 6. Estado de este documento

- [x] Inventario de las 16 pestañas (2 Sheets) — 2026-07-23.
- [x] Paridad evaluada, huecos identificados.
- [ ] Decisión: cutover vs. espejo · líneas telefónicas dentro/fuera.
- [ ] Cerrar huecos de logística (#1) + Nº Nota (#2).
- [ ] Config de notificaciones (#3).
- [ ] Construir el importador (#5).
- [ ] Fecha de corte acordada.
- [ ] Ensayo de migración (dry-run con conteos).
- [ ] Arrastre final + cutover.
