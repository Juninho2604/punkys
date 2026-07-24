import { Router } from 'express'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

// Vista (solo lectura) del espejo de la operación del cliente (tablas op_*).
export const operacionRouter = Router()
operacionRouter.use(requireAuth)
operacionRouter.use(requireRole())

operacionRouter.get('/resumen', async (_req, res, next) => {
  try {
    const cuenta = async (tabla: string) => Number((await db(tabla).count({ n: '*' }))[0]?.n ?? 0)
    const [pedidos, estados, logistica, fletes, contactos] = await Promise.all([
      cuenta('op_pedidos'), cuenta('op_pedido_estados'), cuenta('op_logistica'), cuenta('op_fletes'), cuenta('op_contactos'),
    ])
    const [ult] = await db('sync_log').where('dataset', 'snapshot_operacion').orderBy('created_at', 'desc').limit(1)
    const porEstado = await db('op_pedidos').select('estado').count({ n: '*' }).groupBy('estado').orderBy('n', 'desc')
    res.json({
      pedidos, estados, logistica, fletes, contactos,
      importado: ult?.created_at ?? null,
      porEstado: porEstado.map((r: any) => ({ estado: r.estado ?? '—', n: Number(r.n) })),
    })
  } catch (err) {
    next(err)
  }
})

operacionRouter.get('/pedidos', async (req, res, next) => {
  try {
    const q = (typeof req.query.q === 'string' ? req.query.q : '').trim()
    const estado = typeof req.query.estado === 'string' ? req.query.estado : ''
    const query = db('op_pedidos')
      .select('numero', 'cliente', 'vendedor', 'estado', 'fecha_pedido', 'monto_usd', 'origen', 'almacen')
      .orderBy('fecha_pedido', 'desc')
      .limit(400)
    if (estado) query.where('estado', estado)
    if (q) query.where((b) => b.whereILike('cliente', `%${q}%`).orWhereILike('numero', `%${q}%`).orWhereILike('vendedor', `%${q}%`))
    res.json({ pedidos: await query })
  } catch (err) {
    next(err)
  }
})

operacionRouter.get('/pedidos/:numero', async (req, res, next) => {
  try {
    const numero = String(req.params.numero)
    const pedido = await db('op_pedidos').where('numero', numero).first()
    if (!pedido) {
      res.status(404).json({ error: 'Pedido no encontrado' })
      return
    }
    const [renglones, estados, logistica] = await Promise.all([
      db('op_pedido_reng').where('pedido_numero', numero).orderBy('id'),
      db('op_pedido_estados').where('pedido_numero', numero).orderBy('id'),
      db('op_logistica').where('pedido_numero', numero).first(),
    ])
    res.json({ pedido, renglones, estados, logistica: logistica ?? null })
  } catch (err) {
    next(err)
  }
})
