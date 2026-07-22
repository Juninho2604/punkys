# Conexión con Profit Plus 2K12 — documentación integral

> Cómo la intranet se alimenta de Profit Plus (el ERP del cliente, SQL Server):
> réplica de la base por un túnel Cloudflare, materialización a las tablas de la
> intranet, y manejo de moneda (Bs con referencia USD del BCV). Este documento
> resume TODO lo que se montó, para poder operarlo o reconstruirlo sin ayuda.

## 1. El panorama en una imagen

```
┌─ Servidor Windows del cliente (oficina) ──────────┐        ┌─ VPS Contabo (Ubuntu, Docker) ──────────────┐
│                                                    │        │                                              │
│  SQL Server · Profit Plus 2K12 · base PUNKYP_A     │        │  Postgres (contenedor db)                    │
│    usuario omia_reader (SOLO LECTURA)              │        │    · esquema profit  ← RÉPLICA cruda de Profit│
│         ▲                                          │        │    · esquema public  ← intranet (pp_*, quotes)│
│         │ lee cada 10 min (NOLOCK)                 │        │         ▲                                     │
│  punky-sync (Node, tarea programada)  ────────────┼──────► │  cloudflared (túnel) → localhost:5432        │
│  cloudflared.exe access tcp (túnel saliente)       │  túnel │                                              │
│         db.punkyintranet.com  (TCP + Service Token)│Cloudflare  server (API) materializa profit.* → pp_*  │
│                                                    │        │         cada 5 min · modo PROFIT_PLUS_MODE=replica │
└────────────────────────────────────────────────────┘        └──────────────────────────────────────────────┘
                                                                        │  web (Nginx) → https://punkyintranet.com
```

**Idea central:** Profit nunca se toca ni se expone. Un proceso en la oficina
LEE Profit y EMPUJA una copia al VPS por un túnel cifrado. La intranet trabaja
sobre esa copia. Si el túnel o la oficina se caen, Profit sigue intacto y la
intranet solo deja de refrescarse hasta que vuelva.

## 2. Decisiones de seguridad (no negociables)

1. **Profit solo-lectura**: usuario `omia_reader` con rol `db_datareader`. No
   puede escribir ni borrar nada en el ERP. Lecturas con `WITH (NOLOCK)` → no
   bloquea a quien esté facturando.
2. **Nada expuesto a internet**: ni el 1433 de SQL Server ni el 5432 de
   Postgres. El Postgres del VPS queda en `127.0.0.1` (`PG_BIND`), alcanzable
   solo por el túnel local de cloudflared.
3. **Túnel con llave**: `db.punkyintranet.com` está detrás de Cloudflare Access
   con un **Service Token** (política Service Auth). Sin ese token nadie pasa, y
   detrás todavía esperan la contraseña de Postgres.
4. **Usuario de réplica enjaulado**: `punky_sync` solo tiene permiso sobre el
   esquema `profit` (+ `CREATE` en la base para crear sus tablas). No puede leer
   las tablas de la intranet (`public`: usuarios, cotizaciones…).
5. **WARP jamás**: el túnel usa `cloudflared access` (ejecutable de usuario, no
   toca rutas de red). El cliente WARP (VPN) tumbó el VPS una vez por capturar
   toda la ruta; queda vetado.

## 3. El dominio `punkyintranet.com`

Comprado por el desarrollador (no del cliente), vive en su cuenta Cloudflare.
Doble función por el mismo túnel `punky`:

| Hostname | Tipo | Servicio | Para qué |
|---|---|---|---|
| `punkyintranet.com` | HTTP | `localhost:8080` | La intranet, con HTTPS automático, sin abrir puertos ni chocar con "Hermes" (nginx del VPS en 80/443) |
| `db.punkyintranet.com` | TCP | `tcp://127.0.0.1:5432` | El túnel de la réplica, protegido con Service Token |

`punkypartners.com` (del cliente, tienda Shopify + correo) **no se toca**; su
DNS sigue en Shopify.

## 4. punky-sync (en el servidor del cliente)

Carpeta `C:\omia-punky\punky-sync\` (Node). Replica las tablas de Profit al
esquema `profit` del VPS. Config en `tables.config.js` (qué tablas, modo
incremental/full, clave `rowguid`). Corre cada 10 min por el **Programador de
tareas** (`PunkySync`), y el túnel corre como tarea `PunkyTunnel` al arranque.

Tablas replicadas (nombres reales confirmados en su Profit): `saArticulo`,
`saStockAlmacen`, `saAlmacen`, `saArtPrecio`, `saCliente`, `saVendedor`,
`saCotizacionCliente(+Reng)`, `saPedidoVenta(+Reng)`, `saFacturaVenta(+Reng)`,
`saDocumentoVenta` (CxC), `saCobro` (+`saCobroDocReng`), `saFacturaCompra(+Reng)`,
`saDocumentoCompra` (CxP), `saProveedor`, `saLineaArticulo`, `saSubLinea`,
`saUnidad`, `saMoneda`, `saCondicionPago`, notas de despacho/entrega, devoluciones.

Detalles técnicos del script (v2, revisado por nosotros): carga inicial
paginada (5.000 filas), cada tabla en transacción, UPSERT por `rowguid`,
incremental por `fe_us_mo`/`fe_us_in` con 5 min de solape, bitácora en
`profit._sync_log`. Ver `docs/replica-profit.md` para el detalle y el paso a
paso de instalación.

## 5. El materializador (en el VPS · modo `replica`)

Con `PROFIT_PLUS_MODE=replica`, el server al arrancar y **cada 5 minutos**
traduce el esquema `profit` (crudo de Profit) a las tablas `pp_*` que ya
consumían todos los módulos. Así no hubo que reescribir ninguna pantalla.

| Origen en `profit.*` | Tabla intranet | Módulo que la usa |
|---|---|---|
| saarticulo + sastockalmacen + saartprecio | pp_products | Cotización (stock y precio por sede) |
| sadocumentoventa (saldo>0) | pp_cxc | Cuentas por Cobrar |
| sacobro | pp_cobranzas | Comisiones (por quincena) |
| safacturaventa + safacturaventareng | pp_ventas | Ventas Analítica |
| safacturacompra | pp_compras | Compras & Por Pagar |
| sadocumentocompra (saldo>0) | pp_cxp | Deuda a proveedores |

Reglas: `trim()` en todos los cruces (Profit rellena los `char` con espacios);
precio vigente = `inactivo=false`, `desde<=hoy`, `hasta` nulo/futuro,
prefiriendo la lista `PP_LISTA` y el `desde` más reciente; artículos sin precio
vigente se excluyen y se cuentan; cobros sin vendedor se excluyen (no comisionan).

Código: `server/src/integrations/profitplus/replica.ts`. Refresco manual del
admin (sin esperar los 5 min): `POST /api/sync/replica/refresh`. Estado en
`GET /api/system/status` (alerta si punky-sync lleva >1h sin correr).

## 6. Moneda: Bolívares con referencia USD (BCV)

Los **documentos** de Profit (facturas, cobros, CxC, compras) están en
**Bolívares**; la **lista de precios** de artículos está en **USD**. Por eso:

- Los montos de los módulos financieros se guardan y muestran en **Bs**, tal
  cual Profit (sin convertir). Etiqueta configurable con `PP_MONEDA` (default `Bs`).
- Junto a cada total se muestra el **equivalente en USD** calculado con la
  **tasa oficial del BCV**, que la intranet obtiene sola de una API pública.

**Servicio de tasa** (`server/src/services/tasaCambio.ts`): al arrancar y cada
`BCV_REFRESH_HORAS` (default 8) trae la tasa de `BCV_API_URL`
(default `https://ve.dolarapi.com/v1/dolares/oficial`, campo `promedio`), la
guarda en `tasa_cambio` (histórico) y usa siempre la más reciente. Resiliencia:
si la API falla conserva la última buena; se puede fijar a mano
(`BCV_TASA_MANUAL=36.5` en el `.env`, o `PUT /api/tasa` como admin) y hay
`BCV_TASA_FALLBACK` de emergencia. Endpoint `GET /api/tasa` para el front;
`POST /api/tasa/refresh` (admin) fuerza la actualización.

> El USD mostrado es "valor de hoy al cambio BCV". Es referencia, no el USD
> histórico de cada transacción. El precio de artículo en Cotización sigue en
> USD (de Profit) hasta que se decida si se convierte a Bs con tasa.

## 7. Variables de entorno (en el `.env` del VPS)

```bash
PROFIT_PLUS_MODE=replica              # activa la lectura de la réplica
PP_LISTA=001                          # lista de precios de Profit para cotizar
PP_STOCK_TIPOS=                       # tipos de saStockAlmacen a sumar (vacío = todos)
PP_ALMACEN_SEDES=002:Almacén Boleíta,035:Almacén Principal
PP_MONEDA=Bs                          # etiqueta de la moneda de los documentos
BCV_API_URL=https://ve.dolarapi.com/v1/dolares/oficial
BCV_TASA_MANUAL=                      # >0 fija la tasa a mano (ignora la API)
BCV_TASA_FALLBACK=                    # tasa de emergencia si la API falla y no hay histórico
BCV_REFRESH_HORAS=8
PG_BIND=127.0.0.1                     # el 5432 NUNCA público (solo túnel)
```

## 8. Operación y diagnóstico

```bash
# ¿La réplica llega? (esquema profit, en el VPS)
docker compose -f /root/punky-intranet/docker-compose.yml exec -T db \
  psql -U punky -d punky_intranet -c \
  "SELECT tabla, filas, ok, hasta FROM profit._sync_log ORDER BY hasta DESC LIMIT 15;"

# ¿La materialización llenó las tablas de la intranet?
docker compose -f /root/punky-intranet/docker-compose.yml exec -T db \
  psql -U punky -d punky_intranet -c \
  "SELECT 'productos' t,count(*) FROM pp_products UNION ALL SELECT 'cxc',count(*) FROM pp_cxc \
   UNION ALL SELECT 'ventas',count(*) FROM pp_ventas UNION ALL SELECT 'compras',count(*) FROM pp_compras;"

# Forzar refresco sin esperar (como admin, desde la intranet o con curl+cookie)
#   POST https://punkyintranet.com/api/sync/replica/refresh
```

Del lado del cliente (Windows): tareas `PunkyTunnel` y `PunkySync` en el
Programador de tareas; log de cada corrida en
`C:\omia-punky\punky-sync\ultima-corrida.log`. Botón de pánico: cerrar/borrar
esas tareas — Profit y SQL Server nunca se modifican.

## 9. Historia resumida (cómo se llegó aquí)

1. Primero la intranet leía un catálogo demo (modo `simulado`), luego un puente
   por Excel (`pipeline`, scripts `sync_*.py`) — hoy **obsoleto**.
2. El técnico del cliente (OMIA) entregó `punky-sync` (réplica SQL→Postgres); lo
   revisamos y endurecimos (v2): túnel en vez de puerto público, usuario
   enjaulado, carga paginada, transacciones.
3. Se eligió Cloudflare Tunnel (el cliente ya lo usaba) con dominio propio
   `punkyintranet.com`, modo `access` sin WARP.
4. Se montó todo paso a paso (el técnico se retiró): túnel, usuario de lectura,
   jaula en el VPS, punky-sync como tarea, primera carga (133 artículos, 6.865
   facturas, 19.889 documentos de CxC, 13.188 cobros…).
5. Se construyó el conector `replica` (materializador) y el manejo de moneda
   Bs + USD (BCV). Documentado aquí y en `docs/replica-profit.md`.

## 10. Pendientes conocidos

- **Precios (`saArtPrecio`)**: confirmar que punky-sync ya lo sube (nombre y
  clave correctos en `tables.config.js`); sin él, el buscador de Cotización sale
  vacío.
- Definir si el precio de cotización se convierte a Bs con tasa o se queda en USD.
- Afinar `PP_STOCK_TIPOS` según los tipos reales de `saStockAlmacen` (excluir
  comprometido/tránsito si aplica).
- Inyección de cotizaciones DE VUELTA a Profit (escritura): hoy no se hace; la
  réplica es solo lectura. Sería una fase aparte con mucho más cuidado.
