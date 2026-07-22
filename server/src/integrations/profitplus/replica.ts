import { db } from '../../db/knex.js'
import { config } from '../../config.js'
import { normalizarNombre } from '../../services/normalize.js'
import { PipelineProfitPlusConnector } from './pipeline.js'
import type { PPStatus } from './types.js'

// Modo RÉPLICA: punky-sync (en el servidor del cliente) replica las tablas de
// Profit al esquema `profit` de esta misma base cada 10 minutos. Este módulo
// MATERIALIZA esa réplica hacia las tablas pp_* que la intranet ya consume
// (pp_products, pp_cxc, pp_cobranzas, pp_compras, pp_cxp, pp_ventas), así
// todos los módulos existentes funcionan sin cambios.
//
// Detalles de Profit a tener en cuenta:
// - Las columnas char() llegan con espacios de relleno → trim() en TODO cruce.
// - saArtPrecio es histórico: precio vigente = inactivo=false, desde<=hoy,
//   (hasta nulo o futuro); se prefiere la lista PP_LISTA y el `desde` más nuevo.
// - Montos de documentos: se guardan TAL CUAL vienen de Profit (Bolívares) y se
//   etiquetan con PP_MONEDA (default 'Bs'). El equivalente en USD lo calcula la
//   intranet al mostrar, con la tasa oficial del BCV (servicio tasaCambio).
//   Los PRECIOS de artículos sí quedan en su moneda de lista (USD en Profit).

const REFRESH_MS = 5 * 60_000
const MONEDA_DOC = () => config.profitPlus.replica.moneda

function esUsd(mone: string): boolean {
  const m = mone.toUpperCase()
  return m === '' || m.includes('USD') || m.includes('US$') || m === '$' || m.includes('DOL')
}

async function replicaDisponible(): Promise<boolean> {
  const r = await db.raw("SELECT to_regclass('profit.saarticulo') AS t")
  return Boolean(r.rows?.[0]?.t)
}

// ── productos: saarticulo + sastockalmacen + saartprecio → pp_products ───────
async function refrescarProductos(): Promise<string> {
  const { lista, stockTipos, sedes } = config.profitPlus.replica
  const almacenes = Object.keys(sedes)

  const precios = await db.raw(
    `SELECT DISTINCT ON (trim(co_art)) trim(co_art) AS co_art, monto, trim(coalesce(co_mone,'USD')) AS mone
     FROM profit.saartprecio
     WHERE coalesce(inactivo,false) = false AND desde <= now() AND (hasta IS NULL OR hasta >= now())
     ORDER BY trim(co_art), (trim(co_precio) = ?) DESC, desde DESC`,
    [lista],
  )
  const precioDe = new Map<string, { monto: number; mone: string }>(
    precios.rows.map((p: any) => [p.co_art, { monto: Number(p.monto), mone: p.mone }]),
  )

  const stockFiltro = stockTipos.length ? `AND trim(tipo) = ANY(?)` : ''
  const stockRows = await db.raw(
    `SELECT trim(co_art) AS co_art, trim(co_alma) AS co_alma, sum(stock) AS s
     FROM profit.sastockalmacen
     WHERE trim(co_alma) = ANY(?) ${stockFiltro}
     GROUP BY 1, 2`,
    stockTipos.length ? [almacenes, stockTipos] : [almacenes],
  )
  const stockDe = new Map<string, Record<string, number>>()
  for (const r of stockRows.rows) {
    const porSede = stockDe.get(r.co_art) ?? {}
    porSede[sedes[r.co_alma]] = Number(r.s)
    stockDe.set(r.co_art, porSede)
  }

  const arts = await db.raw(
    `SELECT trim(co_art) AS codigo, trim(art_des) AS nombre
     FROM profit.saarticulo WHERE coalesce(anulado,false) = false`,
  )

  let sinPrecio = 0
  const productos: { codigo: string; nombre: string; precio: number; moneda: string; stock: Record<string, number> }[] = []
  for (const a of arts.rows) {
    const precio = precioDe.get(a.codigo)
    if (!precio) {
      sinPrecio++
      continue
    }
    productos.push({
      codigo: a.codigo,
      nombre: a.nombre,
      precio: Math.round(precio.monto * 100) / 100,
      moneda: esUsd(precio.mone) ? 'USD' : precio.mone,
      stock: stockDe.get(a.codigo) ?? {},
    })
  }

  let desactivados = 0
  await db.transaction(async (trx) => {
    for (const p of productos) {
      await trx('pp_products')
        .insert({ ...p, stock: JSON.stringify(p.stock), activo: true, updated_at: trx.fn.now() })
        .onConflict('codigo')
        .merge(['nombre', 'precio', 'moneda', 'stock', 'activo', 'updated_at'])
    }
    desactivados = await trx('pp_products')
      .whereNotIn('codigo', productos.map((p) => p.codigo))
      .andWhere('activo', true)
      .update({ activo: false, updated_at: trx.fn.now() })
    await trx('sync_log').insert({
      dataset: 'productos',
      fuente: 'réplica Profit',
      registros: productos.length,
      desactivados,
      detalle: sinPrecio ? `sin precio vigente (lista ${lista}): ${sinPrecio}` : null,
    })
  })
  return `productos ${productos.length}${sinPrecio ? ` (sin precio: ${sinPrecio})` : ''}`
}

// ── CxC: sadocumentoventa (saldo>0) → pp_cxc ─────────────────────────────────
async function refrescarCxc(): Promise<string> {
  const docs = await db.raw(
    `SELECT trim(d.co_tipo_doc) AS tipo_doc, trim(d.nro_doc) AS documento,
            coalesce(nullif(trim(c.cli_des),''), trim(d.co_cli)) AS cliente,
            nullif(trim(v.ven_des),'') AS vendedor,
            d.fec_emis, d.fec_venc, d.total_neto AS total, d.saldo,
            greatest(0, (current_date - d.fec_venc::date))::int AS dias,
            trim(coalesce(d.co_mone,'USD')) AS mone
     FROM profit.sadocumentoventa d
     LEFT JOIN profit.sacliente c ON trim(c.co_cli) = trim(d.co_cli)
     LEFT JOIN profit.savendedor v ON trim(v.co_ven) = trim(d.co_ven)
     WHERE coalesce(d.anulado,false) = false AND d.saldo > 0`,
  )
  await db.transaction(async (trx) => {
    await trx('pp_cxc').del()
    if (docs.rows.length) {
      await trx.batchInsert(
        'pp_cxc',
        docs.rows.map((r: any) => ({
          cliente_norm: normalizarNombre(r.cliente),
          cliente: r.cliente,
          vendedor: r.vendedor,
          documento: r.documento,
          tipo_doc: r.tipo_doc,
          fecha_emision: r.fec_emis,
          fecha_venc: r.fec_venc,
          total: Number(r.total),
          saldo: Number(r.saldo),
          dias_vencido: Number(r.dias),
          moneda: MONEDA_DOC(),
        })),
        500,
      )
    }
    await trx('sync_log').insert({ dataset: 'cxc', fuente: 'réplica Profit', registros: docs.rows.length })
  })
  return `cxc ${docs.rows.length}`
}

// ── Cobranzas: sacobro → pp_cobranzas (base de las comisiones) ───────────────
async function refrescarCobranzas(): Promise<string> {
  const cobros = await db.raw(
    `SELECT b.fecha::date AS fecha, trim(b.cob_num) AS documento,
            coalesce(nullif(trim(c.cli_des),''), trim(b.co_cli)) AS cliente,
            nullif(trim(v.ven_des),'') AS vendedor,
            b.monto, coalesce(b.tasa,0) AS tasa, trim(coalesce(b.co_mone,'USD')) AS mone
     FROM profit.sacobro b
     LEFT JOIN profit.sacliente c ON trim(c.co_cli) = trim(b.co_cli)
     LEFT JOIN profit.savendedor v ON trim(v.co_ven) = trim(b.co_ven)
     WHERE coalesce(b.anulado,false) = false AND b.fecha IS NOT NULL`,
  )
  let sinVendedor = 0
  const filas = cobros.rows
    .filter((r: any) => {
      if (!r.vendedor) sinVendedor++
      return Boolean(r.vendedor)
    })
    .map((r: any) => ({
      fecha: r.fecha,
      documento: r.documento,
      cliente: r.cliente,
      vendedor_norm: normalizarNombre(r.vendedor),
      vendedor: r.vendedor,
      // monto_usd conserva el nombre de columna, pero guarda el monto en la
      // moneda del documento (Bs); el USD se calcula al mostrar con la tasa BCV.
      monto_usd: Math.round(Number(r.monto) * 100) / 100,
      moneda: MONEDA_DOC(),
    }))
  await db.transaction(async (trx) => {
    await trx('pp_cobranzas').del()
    if (filas.length) await trx.batchInsert('pp_cobranzas', filas, 500)
    await trx('sync_log').insert({
      dataset: 'cobranzas',
      fuente: 'réplica Profit',
      registros: filas.length,
      detalle: sinVendedor ? `sin vendedor (excluidos): ${sinVendedor}` : null,
    })
  })
  return `cobranzas ${filas.length}${sinVendedor ? ` (sin vendedor: ${sinVendedor})` : ''}`
}

// ── Ventas: safacturaventa(+reng) → pp_ventas (mes × vendedor × línea) ───────
async function refrescarVentas(): Promise<string> {
  const reng = await db.raw(
    `SELECT to_char(f.fec_emis, 'YYYY-MM') AS mes,
            coalesce(nullif(trim(v.ven_des),''), 'Sin vendedor') AS vendedor,
            coalesce(nullif(trim(a.co_lin),''), 'otros') AS categoria,
            r.total_art AS unidades, r.reng_neto AS monto,
            coalesce(f.tasa,0) AS tasa, trim(coalesce(f.co_mone,'USD')) AS mone
     FROM profit.safacturaventareng r
     JOIN profit.safacturaventa f ON trim(f.doc_num) = trim(r.doc_num)
     LEFT JOIN profit.savendedor v ON trim(v.co_ven) = trim(f.co_ven)
     LEFT JOIN profit.saarticulo a ON trim(a.co_art) = trim(r.co_art)
     WHERE coalesce(f.anulado,false) = false AND f.fec_emis IS NOT NULL`,
  )
  const agg = new Map<string, { mes: string; vendedor: string; categoria: string; unidades: number; monto: number }>()
  for (const r of reng.rows) {
    const key = `${r.mes}|${r.vendedor}|${r.categoria}`
    const a = agg.get(key) ?? { mes: r.mes, vendedor: r.vendedor, categoria: r.categoria, unidades: 0, monto: 0 }
    a.unidades += Number(r.unidades)
    a.monto += Number(r.monto) // en Bs; el USD se calcula al mostrar con la tasa BCV
    agg.set(key, a)
  }
  const filas = [...agg.values()].map((a) => ({
    mes: a.mes,
    vendedor: a.vendedor,
    categoria: a.categoria,
    unidades: Math.round(a.unidades * 100) / 100,
    monto_usd: Math.round(a.monto * 100) / 100,
    margen_usd: null, // el costo no viaja en la réplica todavía
  }))
  await db.transaction(async (trx) => {
    await trx('pp_ventas').del()
    if (filas.length) await trx.batchInsert('pp_ventas', filas, 500)
    await trx('sync_log').insert({ dataset: 'ventas', fuente: 'réplica Profit', registros: filas.length })
  })
  return `ventas ${filas.length}`
}

// ── Compras: safacturacompra → pp_compras ────────────────────────────────────
async function refrescarCompras(): Promise<string> {
  const compras = await db.raw(
    `SELECT f.fec_emis::date AS fecha,
            coalesce(nullif(trim(f.nro_fact),''), trim(f.doc_num)) AS documento,
            coalesce(nullif(trim(p.prov_des),''), trim(f.co_prov)) AS proveedor,
            f.total_neto AS monto, coalesce(f.tasa,0) AS tasa, trim(coalesce(f.co_mone,'USD')) AS mone
     FROM profit.safacturacompra f
     LEFT JOIN profit.saproveedor p ON trim(p.co_prov) = trim(f.co_prov)
     WHERE coalesce(f.anulado,false) = false AND f.fec_emis IS NOT NULL`,
  )
  const filas = compras.rows.map((r: any) => ({
    fecha: r.fecha,
    documento: r.documento,
    proveedor: r.proveedor,
    categoria: null,
    monto_usd: Math.round(Number(r.monto) * 100) / 100, // en Bs (ver nota arriba)
    moneda: MONEDA_DOC(),
  }))
  await db.transaction(async (trx) => {
    await trx('pp_compras').del()
    if (filas.length) await trx.batchInsert('pp_compras', filas, 500)
    await trx('sync_log').insert({ dataset: 'compras', fuente: 'réplica Profit', registros: filas.length })
  })
  return `compras ${filas.length}`
}

// ── CxP: sadocumentocompra (saldo>0) → pp_cxp ────────────────────────────────
async function refrescarCxp(): Promise<string> {
  const docs = await db.raw(
    `SELECT coalesce(nullif(trim(p.prov_des),''), trim(d.co_prov)) AS proveedor,
            trim(d.nro_doc) AS documento, trim(d.co_tipo_doc) AS tipo_doc,
            d.fec_emis, d.fec_venc, d.total_neto AS total, d.saldo,
            greatest(0, (current_date - d.fec_venc::date))::int AS dias,
            trim(coalesce(d.co_mone,'USD')) AS mone
     FROM profit.sadocumentocompra d
     LEFT JOIN profit.saproveedor p ON trim(p.co_prov) = trim(d.co_prov)
     WHERE coalesce(d.anulado,false) = false AND d.saldo > 0`,
  )
  await db.transaction(async (trx) => {
    await trx('pp_cxp').del()
    if (docs.rows.length) {
      await trx.batchInsert(
        'pp_cxp',
        docs.rows.map((r: any) => ({
          proveedor: r.proveedor,
          documento: r.documento,
          tipo_doc: r.tipo_doc,
          fecha_emision: r.fec_emis,
          fecha_venc: r.fec_venc,
          total: Number(r.total),
          saldo: Number(r.saldo),
          dias_vencido: Number(r.dias),
          moneda: MONEDA_DOC(),
        })),
        500,
      )
    }
    await trx('sync_log').insert({ dataset: 'cxp', fuente: 'réplica Profit', registros: docs.rows.length })
  })
  return `cxp ${docs.rows.length}`
}

// ── Orquestación ─────────────────────────────────────────────────────────────
let refrescando = false

export async function refrescarDesdeReplica(): Promise<{ ok: boolean; detalle: string }> {
  if (refrescando) return { ok: false, detalle: 'Ya hay un refresco en curso' }
  refrescando = true
  try {
    if (!(await replicaDisponible())) {
      return { ok: false, detalle: 'El esquema profit no existe aún (¿punky-sync ha corrido?)' }
    }
    const partes: string[] = []
    for (const paso of [refrescarProductos, refrescarCxc, refrescarCobranzas, refrescarVentas, refrescarCompras, refrescarCxp]) {
      try {
        partes.push(await paso())
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        partes.push(`${paso.name} ERROR: ${msg}`)
        console.error(`⚠️ [Réplica] ${paso.name}:`, msg)
      }
    }
    const detalle = partes.join(' · ')
    console.log(`🔁 [Réplica] Materializado: ${detalle}`)
    return { ok: !detalle.includes('ERROR'), detalle }
  } finally {
    refrescando = false
  }
}

export function iniciarRefrescoReplica(): void {
  void refrescarDesdeReplica()
  setInterval(() => void refrescarDesdeReplica(), REFRESH_MS)
  console.log(`🔁 [Réplica] Refresco automático cada ${REFRESH_MS / 60000} min activado`)
}

// ── Conector: igual que pipeline (lee pp_products) con estado propio ─────────
export class ReplicaProfitPlusConnector extends PipelineProfitPlusConnector {
  override async status(): Promise<PPStatus> {
    if (!(await replicaDisponible())) {
      return {
        modo: 'replica',
        conectado: false,
        detalle: 'Modo réplica activo pero el esquema profit no existe: verificar punky-sync en el servidor del cliente.',
      }
    }
    const r = await db.raw('SELECT max(hasta) AS h FROM profit._sync_log WHERE ok = true')
    const ultimo = r.rows?.[0]?.h ? new Date(r.rows[0].h) : null
    const [{ count }] = await db('pp_products').where('activo', true).count()
    if (!ultimo) {
      return { modo: 'replica', conectado: false, detalle: 'Réplica presente pero sin corridas exitosas de punky-sync aún.' }
    }
    const mins = (Date.now() - ultimo.getTime()) / 60_000
    return {
      modo: 'replica',
      conectado: mins < 60,
      detalle: `Réplica de Profit vía punky-sync · última corrida ${ultimo.toLocaleString('es-VE')} (hace ${Math.round(mins)} min) · ${count} productos cotizables.${mins >= 60 ? ' ⚠️ Lleva más de 1h sin sincronizar: revisar la tarea PunkySync del servidor del cliente.' : ''}`,
    }
  }
}
