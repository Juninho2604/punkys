# Puente de datos · Profit → Intranet (Fase 1 del plan maestro)

El inventario real (productos, precios y stock por sede) llega a la intranet
reutilizando el pipeline que YA existe en la PC de la oficina:

```
Profit → Excel (_fuentes/) → extractores py (6×/día, ya existen)
       → catalogo-activo.json + lista-precios-data.json
       → sync_inventario.py  ──POST──▶  intranet /api/sync/productos
       → los vendedores cotizan con stock y precios reales
```

Ventajas: cero cambios en el sistema actual del cliente (la misma corrida
alimenta a ambos), y cuando algún día se conecte el SQL Server directo, solo
cambia el modo del conector — la intranet no se entera.

---

## Activación en el VPS (una vez)

```bash
cd /root/punky-intranet
echo "SYNC_TOKEN=$(openssl rand -hex 24)" >> .env
sed -i 's/^PROFIT_PLUS_MODE=.*/PROFIT_PLUS_MODE=pipeline/' .env   # o editar a mano
grep -E "SYNC_TOKEN|PROFIT_PLUS_MODE" .env    # copiar el token para el paso siguiente
punky-deploy
```

> Con `PROFIT_PLUS_MODE=pipeline` y aún sin sincronizar, el buscador del wizard
> sale vacío y `GET /api/system/status` lo explica. Tras el primer sync, aparece
> el inventario real.

## Instalación en la PC de la oficina (una vez)

1. Copiar `pipeline/sync_inventario.py` (de este repo) a
   `G:\Mi unidad\AI OPTIMIZACIONES\Intranet\_scripts\`.
2. **Revisar el mapeo de sedes** al inicio del script (⚠️ confirmar con Punky):
   ```python
   ALMACEN_SEDE = {
       "002": "Almacén Boleíta",     # extractores lo llaman "Bello Monte"
       "035": "Almacén Principal",   # extractores lo llaman "Vene Embarques"
   }
   ```
   Solo los almacenes mapeados se suben (los demás — consignaciones, stock
   muerto — se ignoran, igual que hace su intranet actual).
3. Elegir la **lista de precios** y la **tasa**: el sistema del cliente maneja
   varias listas en USD (`lista-precios-data.json`). Definir con Punky cuál
   lista usa la cotización y si se convierte a Bs.:
   - `PUNKY_LISTA` = nombre exacto de la lista (vacío = la primera).
   - `PUNKY_TASA` = multiplicador de precio (1 = dejar el monto tal cual).
4. Agregar al final de `actualizar-datos.ps1` (después de los extractores):
   ```powershell
   $env:PUNKY_API_URL   = "http://80.241.212.7:8080"
   $env:PUNKY_SYNC_TOKEN= "<el SYNC_TOKEN del VPS>"
   $env:PUNKY_LISTA     = "<nombre de la lista elegida>"
   py "G:\Mi unidad\AI OPTIMIZACIONES\Intranet\_scripts\sync_inventario.py" >> "G:\Mi unidad\AI OPTIMIZACIONES\Intranet\_scripts\actualizar.log"
   ```
   Con eso, cada corrida de la tarea `PunkyRefreshVentas` (7:30–17:00) sube el
   inventario fresco a la intranet automáticamente.

Prueba manual (sin esperar la tarea): abrir PowerShell y correr las 4 líneas
del punto 4. Debe imprimir `Sync intranet -> OK: N productos subidos`.

## Cómo funciona la ingesta

- `POST /api/sync/productos` con `Authorization: Bearer <SYNC_TOKEN>`.
- **Sincronización completa**: lo recibido se upserta; lo que ya no viene se
  marca `activo=false` (deja de ser cotizable, pero las cotizaciones históricas
  conservan su renglón). Códigos duplicados en el payload → rechazo 400.
- Cada corrida queda en `sync_log`; el admin la ve en `GET /api/sync/estado` y
  en `GET /api/system/status` (incluye alerta si lleva >24 h sin sincronizar).
- Productos sin `co_art` o sin precio vigente no se suben; el script lo avisa.

## Decisiones pendientes con el cliente

| Tema | Pregunta |
|---|---|
| Mapeo de sedes | ¿002 (Bello Monte) = Almacén Boleíta y 035 (Vene Embarques) = Almacén Principal? |
| Lista de precios | ¿Cuál lista usa la cotización? ¿DETAL, MAYOR, otra? ¿Distinta por cliente? (hoy: una global) |
| Moneda | Los precios de Profit están en USD. ¿La cotización se emite en USD o se convierte a Bs. (PUNKY_TASA)? La UI hoy dice "Bs." — ajustar etiqueta según la decisión |
| Frecuencia | ¿Bastan las 6 corridas diarias o Despacho necesita algo más fresco? |

## Futuro

- Datasets ya soportados: `productos` (inventario), `cxc` (saldos — `sync_cxc.py`),
  `ventas` (BI — `sync_ventas.py`). Falta añadir sus llamadas al
  `actualizar-datos.ps1` igual que inventario. Futuro: `clientes`.
- ⚠️ El cruce CxC↔cotización es por **nombre de cliente normalizado** (la CxC de
  Profit no trae RIF). Exacto-o-nada a propósito. Si el export llegara a incluir
  RIF, migrar el cruce a RIF.
- Modo `sqlserver` (lectura directa) reemplaza al puente sin tocar la UI.
