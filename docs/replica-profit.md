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

## Siguiente fase (nuestra, cuando la réplica esté corriendo)

Conector `PROFIT_PLUS_MODE=replica`: la API lee inventario/precios/CxC/
cobranzas/ventas/compras directo de `profit.*` — se retiran los extractores
de Excel y los scripts `pipeline/sync_*.py`, y los datos pasan de 6 corridas
diarias a cada 10 minutos. Las pantallas no cambian.

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
