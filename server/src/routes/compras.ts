import { Router } from 'express'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

// Fase 6 (Consultas Profit · lado del gasto): resumen de compras y Cuentas por
// Pagar para el dueño. Solo admin: montos de compra y deuda a proveedores son
// información sensible del negocio.

export const comprasRouter = Router()
comprasRouter.use(requireAuth, requireRole())

comprasRouter.get('/resumen', async (_req, res, next) => {
  try {
    const [porMesRaw, porProveedor, porCategoria, ultimas, cxpRaw, syncCompras, syncCxp] = await Promise.all([
      db('pp_compras')
        .select(db.raw("to_char(fecha, 'YYYY-MM') as mes"))
        .sum('monto_usd as monto')
        .count('* as docs')
        .groupBy('mes')
        .orderBy('mes'),
      db('pp_compras')
        .select('proveedor')
        .sum('monto_usd as monto')
        .count('* as docs')
        .groupBy('proveedor')
        .orderByRaw('sum(monto_usd) desc')
        .limit(12),
      db('pp_compras')
        .whereNotNull('categoria')
        .select('categoria')
        .sum('monto_usd as monto')
        .groupBy('categoria')
        .orderByRaw('sum(monto_usd) desc')
        .limit(12),
      db('pp_compras').orderBy('fecha', 'desc').orderBy('id', 'desc').limit(15),
      db('pp_cxp')
        .select('proveedor', 'moneda')
        .sum('saldo as saldo')
        .sum({ vencido: db.raw('case when dias_vencido > 0 then saldo else 0 end') })
        .max('dias_vencido as peor_dias')
        .count('* as docs')
        .groupBy('proveedor', 'moneda')
        .orderByRaw('sum(case when dias_vencido > 0 then saldo else 0 end) desc, sum(saldo) desc'),
      db('sync_log').where('dataset', 'compras').orderBy('created_at', 'desc').first(),
      db('sync_log').where('dataset', 'cxp').orderBy('created_at', 'desc').first(),
    ])

    res.json({
      porMes: porMesRaw.map((m) => ({ mes: m.mes, monto: Number(m.monto), docs: Number(m.docs) })),
      porProveedor: porProveedor.map((p) => ({ proveedor: p.proveedor, monto: Number(p.monto), docs: Number(p.docs) })),
      porCategoria: porCategoria.map((c) => ({ categoria: c.categoria, monto: Number(c.monto) })),
      ultimas: ultimas.map((u) => ({
        fecha: u.fecha,
        documento: u.documento,
        proveedor: u.proveedor,
        categoria: u.categoria,
        montoUsd: Number(u.monto_usd),
        moneda: u.moneda,
      })),
      cxp: {
        proveedores: cxpRaw.map((p) => ({
          proveedor: p.proveedor,
          moneda: p.moneda,
          saldo: Number(p.saldo),
          vencido: Number(p.vencido),
          peorDiasVencido: Number(p.peor_dias),
          documentos: Number(p.docs),
        })),
        totales: {
          saldo: cxpRaw.reduce((s, p) => s + Number(p.saldo), 0),
          vencido: cxpRaw.reduce((s, p) => s + Number(p.vencido), 0),
        },
      },
      actualizadoCompras: syncCompras?.created_at ?? null,
      actualizadoCxp: syncCxp?.created_at ?? null,
    })
  } catch (err) {
    next(err)
  }
})
