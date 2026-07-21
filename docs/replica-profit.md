# Réplica directa Profit → VPS (punky-sync, del técnico OMIA)

El técnico del cliente (OMIA Agency) entregó **punky-sync**: un script Node
que corre en el servidor Windows de la oficina y replica las tablas de Profit
(SQL Server, base `PUNKYP_A`) hacia el PostgreSQL del VPS, en el esquema
**`profit`**. Revisado y corregido por nosotros (v2). Cuando esté activo,
reemplaza a los extractores de Excel como fuente de datos.

## Arquitectura (decisiones de seguridad — NO negociables)

```
Servidor Punkys (Windows, SQL Server)          VPS (Docker)
  omia_reader (SOLO lectura) ──punky-sync──▶ túnel Tailscale ──▶ db:5432
                                                    (100.x.y.z, IP privada)
```

1. **Profit nunca se expone**: el script corre EN el servidor del cliente y
   la conexión sale de allá hacia el VPS. El puerto 1433 jamás se abre.
2. **El PostgreSQL del VPS tampoco se expone**: el 5432 se publica solo en la
   IP privada del túnel Tailscale (`PG_BIND` en el `.env` del VPS). Desde
   internet ese puerto no existe. **NUNCA** poner `PG_BIND=0.0.0.0` ni la IP
   pública.
3. **Usuario `punky_sync` enjaulado**: solo tiene permisos sobre el esquema
   `profit`. No puede leer ni tocar `public` (cotizaciones, usuarios, etc.).
   El usuario `punky` (la API) puede LEER `profit.*` (default privileges).
4. En Profit se usa `omia_reader` (solo lectura) con `WITH (NOLOCK)`.

## Activación en el VPS (cuando el técnico esté listo)

```bash
# 1. Túnel
curl -fsSL https://tailscale.com/install.sh | sh
tailscale up            # iniciar sesión (misma cuenta que el servidor Windows)
tailscale ip -4         # anotar la IP 100.x.y.z

# 2. Esquema y usuario enjaulado
cd /root/punky-intranet
docker compose exec db psql -U punky -d punky_intranet <<'SQL'
CREATE SCHEMA IF NOT EXISTS profit;
CREATE USER punky_sync WITH PASSWORD 'PASSWORD_FUERTE';
GRANT USAGE, CREATE ON SCHEMA profit TO punky_sync;
ALTER DEFAULT PRIVILEGES FOR ROLE punky_sync IN SCHEMA profit
  GRANT SELECT ON TABLES TO punky;
SQL

# 3. Publicar 5432 SOLO en el túnel
echo "PG_BIND=<IP_TAILSCALE_DEL_VPS>" >> .env
punky-deploy
```

Verificar que NO quedó público: `ss -tlnp | grep 5432` debe mostrar solo la
IP 100.x.y.z (y/o 127.0.0.1), nunca `0.0.0.0`.

## Túnel ELEGIDO: Cloudflare (dominio propio `punkyintranet.com`, SIN WARP)

Decisión final tras el incidente WARP (instalado por error en el VPS, capturó
la ruta por defecto y tumbó los servicios): se usa Cloudflare Tunnel en modo
**`cloudflared access` (TCP)** — un ejecutable de espacio de usuario que NO
toca rutas, DNS ni adaptadores. **WARP no se instala en NINGÚN servidor.**

El dominio `punkyintranet.com` es del desarrollador (no del cliente), vive en
su cuenta Cloudflare y hace doble función:
- `https://punkyintranet.com` → hostname HTTP del túnel → `localhost:8080`
  (la intranet con HTTPS, sin abrir puertos y sin chocar con Hermes).
- `db.punkyintranet.com` → hostname **TCP** del túnel → `tcp://127.0.0.1:5432`,
  protegido con **Cloudflare Access + Service Token** (política Service Auth).

Configuración:
1. **VPS**: instalar el túnel `punky` como servicio (comando del panel Zero
   Trust). `PG_BIND` se queda en `127.0.0.1` (la base nunca sale de localhost).
   `.env`: `CLIENT_ORIGIN=https://punkyintranet.com`, `COOKIE_SECURE=true`.
2. **Windows del cliente** (tras la Fase 0/1 del plan blindado):
   ```powershell
   cloudflared.exe access tcp --hostname db.punkyintranet.com \
     --url tcp://127.0.0.1:5432 --service-token-id ID --service-token-secret SECRETO
   ```
   `.env` del punky-sync: `PG_HOST=127.0.0.1`, `PG_SSL=false`.
3. La app web NO va detrás de Access (tiene su propio login).

Alternativas descartadas pero documentadas: Tailscale (gratis, más simple —
el cliente prefirió Cloudflare), WARP+red privada (vetado por el incidente),
WireGuard puro (sin terceros; opción futura si se quiere soberanía total).

## Qué replica (tables.config.js del punky-sync)

Ventas completas (cotizaciones, pedidos, facturas, renglones), CxC
(`saDocumentoVenta`), clientes, vendedores, artículos, stock por almacén,
despachos, catálogos. **Añadido en v2** (⚠️ nombres por confirmar con
`SELECT name FROM sys.tables` en el SQL Server del cliente):
- Precios (`saArtPrecio`) — sin esto la intranet no puede cotizar con precios reales.
- Cobros (`saCobro`/`saCobroReng`) — base de las Comisiones por quincena.
- Compras y CxP (`saProveedor`, `saFacturaCompra*`, `saDocumentoCompra`).

## Conector `PROFIT_PLUS_MODE=replica` (CONSTRUIDO · Fase 7)

Un materializador (`integrations/profitplus/replica.ts`) traduce `profit.*` →
tablas `pp_*` al arrancar y **cada 5 minutos**, reutilizando TODOS los módulos
existentes sin tocar pantallas:

| Origen (réplica) | Destino | Alimenta |
|---|---|---|
| saarticulo + sastockalmacen + saartprecio | pp_products | Wizard de cotización (stock y precio por sede) |
| sadocumentoventa (saldo>0) | pp_cxc | Cuentas por Cobrar + saldo al aprobar |
| sacobro | pp_cobranzas | Comisiones por quincena |
| safacturaventa(+reng) | pp_ventas | Ventas Analítica (categoría = co_lin; margen aún NULL) |
| safacturacompra | pp_compras | Compras & Por Pagar |
| sadocumentocompra (saldo>0) | pp_cxp | Deuda a proveedores |

Reglas: `trim()` en todo cruce (chars con relleno de Profit); precio vigente =
`inactivo=false`, `desde<=hoy`, `hasta` nulo/futuro, prefiriendo `PP_LISTA` y
el `desde` más nuevo; artículos sin precio vigente se excluyen y se cuentan en
`sync_log.detalle`; montos no-USD se dividen entre `tasa` si viene; cobros sin
vendedor se excluyen (no comisionan).

Config (`.env` del VPS): `PROFIT_PLUS_MODE=replica`, `PP_LISTA` (default 001),
`PP_STOCK_TIPOS` (vacío = suma todos los tipos de saStockAlmacen — ⚠️ afinar si
hay tipos comprometido/tránsito), `PP_ALMACEN_SEDES`
(default `002:Almacén Boleíta,035:Almacén Principal`).

Refresco manual (admin): `POST /api/sync/replica/refresh`. El estado del
conector (`GET /api/system/status`) reporta la última corrida de punky-sync y
alerta si lleva >1h sin sincronizar.

Los scripts `pipeline/sync_*.py` quedan obsoletos con este modo (eran el
plan B por Excel); no borrar por si acaso, pero ya no se usan.

## Corrección aplicada sobre la entrega original del técnico (v1 → v2)

- ❌ v1 pedía abrir `listen_addresses='*'` + ufw 5432 a una IP pública →
  reemplazado por túnel Tailscale + `PG_BIND`.
- ❌ v1 daba `GRANT ALL ON DATABASE punky_intranet` al usuario de sync →
  ahora enjaulado al esquema `profit`.
- ❌ v1 cargaba tablas completas en memoria en la primera corrida →
  paginación de 5.000 filas (`OFFSET/FETCH`).
- ❌ v1 truncaba tablas `full` fuera de transacción (lectores veían la tabla
  vacía unos segundos) → ahora cada tabla va en transacción.
- ➕ Tablas de precios/cobros/compras añadidas al config.
