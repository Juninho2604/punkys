import { Router } from 'express'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

// BI de Ventas (Fase 4). El MARGEN solo se sirve a admin (regla heredada).
export const ventasRouter = Router()
ventasRouter.use(requireAuth)

ventasRouter.get('/resumen', requireRole(), async (req, res, next) => {
  try {
    const esAdmin = req.user!.rol === 'admin'
    // Rango: últimos 6 meses presentes en los datos
    const mesesRows = await db('pp_ventas').distinct('mes').orderBy('mes', 'desc').limit(6)
    const meses = mesesRows.map((m) => m.mes).reverse()

    // monto = Bs (columna legada monto_usd) · montoUsd = USD histórico (monto_usd_real)
    const conMargen = (q: any) => (esAdmin ? q.sum({ margen: 'margen_usd' }) : q)
    const conMontos = (q: any) => conMargen(q.sum({ monto: 'monto_usd' }).sum({ montoUsd: 'monto_usd_real' }))

    // Por mes
    const porMes = await conMontos(
      db('pp_ventas').whereIn('mes', meses).groupBy('mes').select('mes').sum({ unidades: 'unidades' }),
    ).orderBy('mes')

    // Por vendedor (rango completo)
    const porVendedor = await conMontos(
      db('pp_ventas').whereIn('mes', meses).groupBy('vendedor').select('vendedor'),
    ).orderBy('monto', 'desc')

    // Por categoría (rango completo)
    const porCategoria = await conMontos(
      db('pp_ventas').whereIn('mes', meses).groupBy('categoria').select('categoria'),
    ).orderBy('monto', 'desc')

    const [tot] = await conMontos(db('pp_ventas').whereIn('mes', meses))

    const num = (x: any) => Number(x ?? 0)
    const marginPct = (monto: number, margen: number | null) =>
      esAdmin && margen != null && monto > 0 ? Math.round((margen / monto) * 100) : null

    const ultimo = await db('sync_log').where('dataset', 'ventas').orderBy('created_at', 'desc').first()

    res.json({
      hayMargen: esAdmin,
      meses,
      totalUsd: num(tot?.monto),
      totalUsdReal: num(tot?.montoUsd),
      totalMargenPct: esAdmin ? marginPct(num(tot?.monto), num(tot?.margen)) : null,
      porMes: porMes.map((r: any) => ({ mes: r.mes, monto: num(r.monto), montoUsd: num(r.montoUsd), unidades: num(r.unidades), margenPct: marginPct(num(r.monto), esAdmin ? num(r.margen) : null) })),
      porVendedor: porVendedor.map((r: any) => ({ vendedor: r.vendedor ?? '—', monto: num(r.monto), montoUsd: num(r.montoUsd), margenPct: marginPct(num(r.monto), esAdmin ? num(r.margen) : null) })),
      porCategoria: porCategoria.map((r: any) => ({ categoria: r.categoria ?? 'otros', monto: num(r.monto), montoUsd: num(r.montoUsd), margenPct: marginPct(num(r.monto), esAdmin ? num(r.margen) : null) })),
      actualizado: ultimo?.created_at ?? null,
    })
  } catch (err) {
    next(err)
  }
})
