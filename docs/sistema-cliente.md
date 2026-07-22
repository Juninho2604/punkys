# El sistema actual del cliente (análisis para la migración)

> Análisis de la intranet que Andreas (dueño) construyó en Google Sheets +
> Apps Script + Supabase. Objetivo: replicar y MEJORAR cada función en nuestra
> intranet. Todo obtenido en solo lectura. Fuente: proyecto Apps Script
> "Ventas Backend" y los Sheets compartidos.

## Arquitectura de su sistema

```
Frontend web  ──►  Apps Script "Ventas Backend" (doGet)  ──►  datos
   (auth Supabase, token Bearer)                              │
                                                              ├─ JSON en Drive (de los extractores de Profit):
                                                              │    ventas-data / catalogo-activo / cxc-data /
                                                              │    lista-precios / costos / pagos / bancos
                                                              ├─ Sheet de Configuración (catálogos)
                                                              └─ Supabase: auth de usuarios + tabla notas_cxc
```

- **Auth**: Supabase (`SUPABASE_URL`, `/auth/v1/user` con token Bearer). En
  nuestra intranet esto ya lo reemplazamos por JWT propio + tabla `users`.
- **Fuente de datos**: los MISMOS `*-data.json` que generan los extractores de
  Profit (los que ya conocíamos del puente). O sea, su intranet **también lee
  Profit**, vía esos JSON en Drive. Nosotros ahora leemos Profit por réplica
  directa (mejor).
- **Caché**: cada dataset se cachea (300s a 6h según si es histórico).

## Módulos que sirve su backend (funciones getX)

| Función | Qué sirve | ¿Lo tenemos? |
|---|---|---|
| getVentas / getVentasHist / getVentasRecent | Ventas (completo/histórico/reciente) | ✅ Ventas Analítica |
| getCatalogo | Inventario con stock | ✅ (réplica Profit) |
| getListaPrecios | Lista de precios | ✅ (saArtPrecio, pendiente activar) |
| getCxc | Cuentas por cobrar | ✅ Cuentas por Cobrar |
| **getCostos** | Costos de envío por transportista/semana | ❌ NUEVO |
| **getPagos** | Pagos | ❌ NUEVO |
| **getBancos** | Bancos / posición de caja | ❌ NUEVO |
| getResumen / getConfig | Dashboard + config | parcial |

## 💎 La joya: el correo diario de CxC (`enviarCxcDiario`)

Trigger time-based **todos los días a las 7am**. Por CADA vendedor arma y envía
un correo `"CxC diario — <vendedor> (<fecha>)"` con SU cartera:

- Agrupado **por cliente** (el vendedor llama al cliente, no a la factura),
  ordenado por el más vencido primero; a igual antigüedad, el que más debe.
- **Buckets de antigüedad**: 1–30 días, 31–60, +60, y **"vence en 7 días"**
  (lo que toca cobrar esta semana).
- **Créditos a favor** (saldo < 0) pegados al mismo grupo del cliente.
- **Notas por cliente** traídas de la tabla Supabase `notas_cxc`
  (autor_email, texto, fecha) — colaboración del equipo de cobranza.
- HTML formateado, con totales y montos en USD.

**Este es "el correo automático que él tenía".** Es más rico que nuestro panel
de CxC actual: nosotros mostramos saldos pero no mandamos ese resumen diario
por vendedor con antigüedad + notas.

## Cosas suyas que NOSOTROS aún no tenemos (para absorber/mejorar)

1. **Correo diario de CxC por vendedor** (aging + vence-7-días + notas + créditos).
2. **Notas de cobranza por cliente** (colaborativas): el equipo escribe notas
   sobre cada cliente y aparecen en el correo y el panel.
3. **Costos de envío** por transportista y semana (módulo).
4. **Pagos y Bancos**: tesorería / posición de caja (módulos nuevos).
5. **Visitas de mercaderistas/asesores** (Sheet "Mercaderista-Promoción"):
   - Movimientos de mercaderista: Fecha, Tipo, Nro Doc, Cliente, Sucursal,
     Producto, Cantidad, Archivo.
   - **Degustaciones/promotoras**: Fecha, Hora, Promotora, Tipo Cliente,
     Cliente, Sucursal, Personas Abordadas, Muestras Entregadas, Clientes
     Compraron, Flujo, Apoyo, Razón No Compra.
   - **Visitas de asesores en calle**: Fecha, Asesor, Tienda, **GPS**, **Fotos**,
     Propósitos, **Inventario Punky en tienda**, **Precios Competencia**,
     Resultado, Pedido, Próxima Visita, Notas. (Inteligencia de campo valiosa.)
6. **Reportes con IA** (había plantillas "Reporte diario IA", "stock crítico
   7am" en el Sheet de config) — reportes automáticos programados.
7. **Control de líneas telefónicas** (Sheet aparte): 17 líneas por
   departamento con fecha de corte y plan — módulo utilitario menor.

## Constantes/config detectadas (no secretas)
- Supabase: `oshxnhmuhegisbyrztgi.supabase.co` (auth + tabla `notas_cxc`).
- Datasets Drive por ID en ScriptProperties (VENTAS_JSON_ID, CATALOGO_JSON_ID,
  CXC_JSON_ID, PAGOS_JSON_ID, BANCOS_JSON_ID, COSTOS_JSON_ID, LISTA_PRECIOS_JSON_ID).

## Ola en progreso

- ✅ **Correo diario de CxC** (Fase 9): réplica mejorada de `enviarCxcDiario`.
  Servicio `services/cxcDiario.ts` arma por vendedor el HTML con antigüedad
  (1–30/31–60/+60), "vence en 7 días", créditos a favor, agrupado por cliente
  (más vencido primero) y **notas de cobranza colaborativas** (tabla
  `cxc_notas`, editables desde el panel de CxC). Montos en Bs con equivalente
  USD (BCV). Se programa 7am (`CXC_DIARIO_HORA`); admin puede previsualizar y
  enviar a demanda (`/api/cxc/diario/preview` y `/enviar`). Correo por vendedor
  se resuelve de `cxc_vendedor_correo` o del email del usuario. Envío real por
  SMTP (Google Workspace recomendado); en modo consola queda registrado.
  ⚠️ Incluye créditos: la réplica de CxC pasó a `saldo <> 0`.

## Cómo lo mejoramos (resumen)
Nuestra intranet ya supera lo administrativo (lee Profit en vivo por réplica,
no por JSON cacheado; auth propia sin depender de Supabase). Lo que falta es
**absorber su capa operacional y de cobranza**: el correo diario de CxC con
notas, los módulos de campo (visitas/degustaciones con GPS y fotos),
tesorería (pagos/bancos) y los reportes automáticos. Eso se hace por olas,
espejando primero (solo lectura) y construyendo la pantalla nativa después.
