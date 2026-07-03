# Integración con Profit Plus 2K12

**Estado: EN ESPERA** — el conector corre en modo `simulado` hasta recibir acceso y documentación del SQL Server del cliente.

## Cómo está armado

La intranet nunca habla directo con Profit Plus: todo pasa por la interfaz
`ProfitPlusConnector` (`server/src/integrations/profitplus/types.ts`), con dos implementaciones:

| Implementación | Archivo | Estado |
|---|---|---|
| `SimulatedProfitPlusConnector` | `simulated.ts` | **Activa.** Registra la operación y devuelve una referencia `PP-SIM-COT-XXXX`. El resto del workflow funciona igual. |
| `SqlServerProfitPlusConnector` | `sqlserver.ts` | Esqueleto. Se implementa al recibir el `.md` del cliente con credenciales y esquema. |

El modo se elige por variable de entorno: `PROFIT_PLUS_MODE=simulado|sqlserver`.

**Punto de integración actual:** al enviar una cotización a aprobación
(`POST /api/quotes/:id/submit`) se llama a `profitPlus.pushQuote(...)` y el resultado queda
en `quotes.pp_sync_status` y `quotes.pp_external_ref`.

## Qué necesitamos del cliente para activar el modo real

1. **Acceso de red** al servidor SQL Server donde vive la BD de Profit Plus 2K12
   (host, puerto —típicamente 1433—, ¿VPN?, reglas de firewall).
2. **Credenciales** de un usuario SQL con permisos de lectura/escritura acotados a las
   tablas involucradas (no `sa`).
3. **Esquema de las tablas** que hoy usa la app de cotizaciones para inyectar:
   nombres de tablas de documentos de venta/cotizaciones, clientes y correlativo,
   columnas obligatorias, triggers o procedimientos almacenados que haya que invocar.
4. **Reglas del correlativo**: quién asigna el número de documento en Profit Plus
   (¿la intranet propone y Profit Plus confirma, o al revés?).
5. **Mapeo de vendedores** (usuario intranet ↔ código de vendedor en Profit Plus).
6. Un caso de ejemplo real (una cotización inyectada por la app actual) para validar contra él.

## Pasos para activar (cuando llegue lo anterior)

```bash
npm i mssql -w server
```

1. Implementar `pushQuote()` en `sqlserver.ts` con la escritura real (idealmente vía el
   procedimiento almacenado que use la app actual, para respetar la lógica de Profit Plus).
2. Configurar en `server/.env`:
   ```
   PROFIT_PLUS_MODE=sqlserver
   PP_DB_HOST=...
   PP_DB_PORT=1433
   PP_DB_NAME=...
   PP_DB_USER=...
   PP_DB_PASSWORD=...
   ```
3. Probar con `GET /api/system/status` (muestra el estado de conexión) y una cotización
   de prueba de punta a punta.

Nada más del código cambia: aprobaciones, despacho y notificaciones son agnósticos al modo.

## Extensiones futuras previstas por la interfaz

- Lectura del catálogo de clientes de Profit Plus (autocompletar por RIF en el wizard).
- Lectura del estado de cuenta del cliente para que CxC apruebe con la deuda a la vista.
