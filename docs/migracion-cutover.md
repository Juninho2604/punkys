# Copiar y mejorar el sistema del cliente (Sheets) → intranet Punky

> Bitácora viva. El cliente (andreas@punkypartners.com) opera hoy en su
> "intranet" hecha en Google Sheets (usados como base de datos) + Apps Script +
> Supabase. **NO se apaga ni se toca su sistema.** Objetivo: copiar TODA su data
> y TODAS sus funciones a nuestra base **SQL** (estructuras más sólidas) y
> mejorarlas — para venderle un producto superior al que ya tiene. Todo el
> acceso a sus Sheets es de **solo lectura**; su sistema sigue funcionando.

**Snapshot de este inventario:** 2026-07-23
**Modo:** copia de **solo lectura** + mejora. Su sistema queda intacto y activo;
nosotros construimos la versión superior y traemos su data para operar encima.

---

## 1. Estrategia: "copiar y mejorar" (sin tocar su sistema)

1. Documentamos toda su data (este inventario) y sus funciones.
2. Traemos su data a nuestra base SQL (importador de **solo lectura** desde sus
   Sheets; nunca se les escribe).
3. Replicamos **cada función** que ella tiene y la **mejoramos** (estructuras
   sólidas, Profit en vivo, auth propia, módulos nuevos).
4. Su sistema sigue vivo en paralelo el tiempo que ella quiera; cuando decida,
   migra su operación a la intranet sin presión ni fecha impuesta.

No se modifica ni borra nada en sus Sheets en ningún momento.

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

## 5. Cómo se mantiene la copia al día (sin tocar su sistema)

Como su sistema sigue vivo, la copia en nuestra base se **refresca de solo
lectura** (una vez para el histórico, y luego periódicamente mientras ella siga
operando en Sheets):

1. El importador lee sus Sheets (solo lectura) y **reemplaza/actualiza** las
   tablas espejo en nuestra SQL. Es **idempotente** (por `# Pedido`) → se puede
   correr las veces que haga falta sin duplicar.
2. **Verificación** de conteos: pedidos vs. "Pedidos ACTIVOS"+"Históricos";
   transiciones vs. "Auditoría"; logística vs. hoja "Logística".
3. Cuando el cliente decida operar en la intranet, ya toda su data está aquí y
   funcionando — sin corte forzado. Sus Sheets quedan como respaldo.

**Acceso necesario para que el servidor lea sus Sheets en continuo** (una sola
configuración, sin exponer nada): compartir los dos Sheets en **solo lectura**
con el correo de una **cuenta de servicio de Google** (la vía limpia), o
publicar cada pestaña como **CSV**. Este es el "tema del correo/URL de los
Sheets". Mientras tanto, el importador ya queda construido y listo.

---

## 6. Estado de este documento

- [x] Inventario de las 16 pestañas (2 Sheets) — 2026-07-23.
- [x] Paridad evaluada, huecos identificados.
- [ ] Decisión de alcance: líneas telefónicas dentro/fuera.
- [ ] Cerrar huecos de logística (#1) + Nº Nota (#2).
- [ ] Config de notificaciones (#3).
- [ ] Construir el importador de solo lectura (#5).
- [ ] Configurar acceso del servidor a los Sheets (cuenta de servicio o CSV).
- [ ] Ensayo: correr el importador y verificar conteos.
- [ ] Refresco periódico mientras el cliente siga en Sheets.
