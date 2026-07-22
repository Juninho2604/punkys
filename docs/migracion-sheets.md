# Migración de la intranet-Sheets del cliente → intranet Punky

> El cliente (andreas@punkypartners.com) opera hoy en Google Sheets. Migramos
> esa operación a la intranet **por olas, sin romper su Sheet**: primero
> clonamos (solo lectura, auto-actualizado), luego construimos la pantalla
> nativa y recién ahí se jubila cada hoja. El Sheet es la fuente hasta que la
> migración de esa hoja esté completa.

## Los dos Sheets del cliente

- **"Punky - Configuración"** (`1Unz-IDfRehJZRwyQvksYC2RPuZ3wYifyKb7lSNBPsG0`):
  catálogos maestros (Productos, Almacenes, Categorías) + config de
  notificaciones (grupos de correo, vendedores→correo, plantillas).
- **"Pedidos Punky"** (`1gveNlFkNzBPRTKD0D2EISlYQVmqJzMDmgeMnJQlB9DE`): el flujo
  operacional (pedidos con ciclo de vida, historial de estados, logística,
  costos de envío).

## Plan por olas

| Ola | Qué | Estado |
|---|---|---|
| **1** | Catálogos: Productos, Almacenes, Categorías → `op_productos/op_almacenes/op_categorias` | ✅ construido |
| 2 | Flujo de pedidos + Historial de Estados (log de auditoría) | pendiente |
| 3 | Logística rica (rutas/transporte/costos) + config de notificaciones | pendiente |
| — | Dashboard y vistas condensadas: NO se importan (son reportes; se regeneran con queries) | — |

## Ola 1 — Espejo de catálogos (construido)

Conector `server/src/integrations/sheets/` — **SOLO LECTURA**. Descarga cada
tab como CSV, lo parsea (soporta comas y comillas) y **reemplaza completa** la
tabla `op_*` (son catálogos pequeños). Corre en el VPS directo (Sheets es
nube, sin túnel) al arrancar y cada `SHEETS_REFRESH_MIN` (default 15 min).
Refresco manual admin: `POST /api/sync/sheets/refresh` o el botón "Refrescar
ahora" en la página **Catálogos**.

### Cómo linkear cada catálogo (una vez, sin tocar los datos del Sheet)

Para cada uno de los 3 tabs (Productos, Almacenes, Categorías) hay que obtener
una **URL de CSV**. La forma que no expone el archivo entero:

1. Abrir "Punky - Configuración" → menú **Archivo → Compartir → Publicar en la
   web**.
2. En el desplegable, elegir **el tab** (ej. "Productos") y formato **CSV**.
3. **Publicar** → copiar la URL que da (termina en `output=csv`).
4. Repetir con Almacenes y Categorías.

> Alternativa si el Sheet ya está compartido "cualquiera con el enlace":
> `https://docs.google.com/spreadsheets/d/<ID>/export?format=csv&gid=<GID>`
> (el `gid` es el número al final de la URL del tab).

### Activar en el VPS

```bash
cd /root/punky-intranet
cat >> .env <<'ENV'
SHEETS_URL_PRODUCTOS=<URL CSV de Productos>
SHEETS_URL_ALMACENES=<URL CSV de Almacenes>
SHEETS_URL_CATEGORIAS=<URL CSV de Categorías>
SHEETS_REFRESH_MIN=15
ENV
punky-deploy
```

Verificar: entrar como admin → **Catálogos** → "Refrescar ahora" → deben
aparecer los productos/almacenes/categorías. O por consola:

```bash
docker compose -f /root/punky-intranet/docker-compose.yml exec -T db \
  psql -U punky -d punky_intranet -c \
  "SELECT 'productos' t,count(*) FROM op_productos UNION ALL \
   SELECT 'almacenes',count(*) FROM op_almacenes UNION ALL \
   SELECT 'categorias',count(*) FROM op_categorias;"
```

### Encabezados que espera cada CSV

- **Productos**: `codigo_producto, nombre_producto, marca, categoria,
  subcategoria, activo, mostrar_en_inventario, mostrar_en_ventas,
  mostrar_a_vendedores, orden_visual, es_foco_mes`
- **Almacenes**: `codigo_almacen, nombre_almacen, activo, mostrar_admin,
  mostrar_vendedor, mostrar_inventario, orden_visual`
- **Categorías**: `categoria, subcategoria, marca, activo, mostrar_dashboard,
  orden_visual`

Los booleanos aceptan `TRUE/FALSE` (o sí/1/x). Si el cliente cambia el orden
de las columnas no pasa nada (se mapea por nombre de encabezado). Si renombra
un encabezado, hay que ajustar el `mapear()` del conector.

## Relación con Profit (importante)

Estos catálogos NO reemplazan a Profit: son una **capa de curaduría** encima.
Profit da TODOS los artículos y almacenes; el Sheet dice **cuáles mostrar, a
qué rol y qué destacar** (foco del mes). En una ola futura se cruza
`op_productos.codigo` ↔ `pp_products.codigo` para que el buscador de cotización
muestre solo lo que el cliente marcó visible.

## Próximas olas (resumen del análisis)

- **Historial de Estados** (log limpio, ~356 filas) → tabla de auditoría tal cual.
- **Pedidos** (cabecera + parsear la columna `Productos` "24 x … | 24 x …" en
  renglones) → alimentar/comparar con el flujo de cotización de la intranet.
- **Logística** (29 columnas, la más sucia: montos con coma y punto mezclados)
  → enriquecer el módulo de Despacho (ruta, transporte, kilos, promesa).
- **Config de notificaciones** (grupos, vendedores→correo, plantillas) → base
  para activar las notificaciones reales de la intranet.
