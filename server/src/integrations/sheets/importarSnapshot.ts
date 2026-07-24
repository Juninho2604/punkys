import { db } from '../../db/knex.js'
import { snapshotOperacion } from '../../db/snapshots/operacion.js'
import { convertirOpPedidosANativos, type ResultadoConversion } from './convertirOperacion.js'

// Carga el snapshot de la operación del cliente (op_* tablas). Idempotente:
//  · Pedidos: UPSERT por número (+ reemplaza sus renglones).
//  · Estados/logística/fletes/contactos: reemplazo completo (es una foto).
//  · Config de notificaciones: UPSERT por clave.
// Re-generar el snapshot y volver a llamar esto trae el delta sin duplicar.

export interface ResultadoImport {
  ok: boolean
  generado: string
  pedidos: number
  estados: number
  logistica: number
  fletes: number
  contactos: number
  vacio: boolean
}

export async function importarSnapshotOperacion(): Promise<ResultadoImport> {
  const s = snapshotOperacion
  const vacio = !s.pedidos.length && !s.estados.length && !s.logistica.length
  if (vacio) {
    return { ok: false, generado: s.generado, pedidos: 0, estados: 0, logistica: 0, fletes: 0, contactos: 0, vacio: true }
  }

  await db.transaction(async (trx) => {
    for (const p of s.pedidos) {
      const { renglones, ...row } = p
      await trx('op_pedidos').insert(row).onConflict('numero').merge()
      await trx('op_pedido_reng').where('pedido_numero', p.numero).del()
      if (renglones && renglones.length) {
        await trx('op_pedido_reng').insert(renglones.map((r) => ({ pedido_numero: p.numero, cantidad: r.cantidad, descripcion: r.descripcion })))
      }
    }

    await trx('op_pedido_estados').del()
    if (s.estados.length) await trx.batchInsert('op_pedido_estados', s.estados, 500)

    await trx('op_logistica').del()
    if (s.logistica.length) await trx.batchInsert('op_logistica', s.logistica, 500)

    await trx('op_fletes').del()
    if (s.fletes.length) await trx.batchInsert('op_fletes', s.fletes, 500)

    await trx('op_contactos').del()
    if (s.contactos.length) await trx.batchInsert('op_contactos', s.contactos, 500)

    for (const g of s.notif_grupos) await trx('notif_grupos').insert(g).onConflict('grupo').merge()
    for (const t of s.notif_tipos) await trx('notif_tipos').insert(t).onConflict('clave').merge()

    // Catálogos curados (upsert por clave primaria)
    for (const p of s.productos) await trx('op_productos').insert(p).onConflict('codigo').merge()
    for (const a of s.almacenes) await trx('op_almacenes').insert(a).onConflict('codigo').merge()
    for (const c of s.categorias) await trx('op_categorias').insert(c).onConflict('categoria').merge()

    await trx('sync_log').insert({
      dataset: 'snapshot_operacion',
      fuente: `Sheets cliente (${s.generado})`,
      registros: s.pedidos.length,
    })
  })

  return {
    ok: true,
    generado: s.generado,
    pedidos: s.pedidos.length,
    estados: s.estados.length,
    logistica: s.logistica.length,
    fletes: s.fletes.length,
    contactos: s.contactos.length,
    vacio: false,
  }
}

// Importa el snapshot y, acto seguido, convierte los pedidos del cliente en
// pedidos nativos (fluyen por Aprobaciones / Facturación / Despacho). Es lo que
// usa el endpoint manual /sync/snapshot.
export async function importarYConvertir(): Promise<ResultadoImport & { conversion: ResultadoConversion }> {
  const imp = await importarSnapshotOperacion()
  const conversion = await convertirOpPedidosANativos()
  return { ...imp, conversion }
}

// Arranque: deja la operación lista sin intervención (primer deploy y deploys
// siguientes). Idempotente en dos pasos:
//   1. Si el espejo op_* está vacío → importa el snapshot.
//   2. Si aún no hay pedidos importados en las tablas nativas → los convierte.
export async function arrancarOperacion(): Promise<void> {
  try {
    if (!snapshotOperacion.pedidos.length) return

    const [op] = await db('op_pedidos').count({ n: '*' })
    if (Number(op?.n ?? 0) === 0) {
      const r = await importarSnapshotOperacion()
      console.log(`📥 [Snapshot] Operación del cliente importada: ${r.pedidos} pedidos, ${r.estados} estados, ${r.logistica} logística`)
    }

    const [imp] = await db('quotes').where('fuente', 'importado').count({ n: '*' })
    if (Number(imp?.n ?? 0) === 0) {
      const c = await convertirOpPedidosANativos()
      console.log(`🔁 [Conversión] ${c.quotes} pedidos nativos · ${c.shipments} despachos · próximo #: ${c.proximoNumero ?? '—'}${c.errores ? ` · ${c.errores} con error` : ''}`)
    }
  } catch (err) {
    console.error('⚠️ [Operación] No se pudo preparar la operación:', err instanceof Error ? err.message : err)
  }
}
