import { Router } from 'express'
import { db } from '../db/knex.js'
import { requireAuth } from '../middleware/auth.js'

export const dashboardRouter = Router()
dashboardRouter.use(requireAuth)

dashboardRouter.get('/', async (_req, res, next) => {
  try {
    const [{ count: activos }] = await db('shipments').whereNot('estado', 'Entregado').count()
    const [{ count: nuevosSemana }] = await db('shipments')
      .where('created_at', '>=', db.raw(`now() - interval '7 days'`))
      .count()

    const [{ count: cotizacionesMes }] = await db('quotes')
      .where('created_at', '>=', db.raw(`date_trunc('month', now())`))
      .count()
    const [{ count: cotizacionesMesAnterior }] = await db('quotes')
      .where('created_at', '>=', db.raw(`date_trunc('month', now()) - interval '1 month'`))
      .andWhere('created_at', '<', db.raw(`date_trunc('month', now())`))
      .count()
    const mesAnt = Number(cotizacionesMesAnterior)
    const deltaCotizaciones = mesAnt > 0 ? Math.round(((Number(cotizacionesMes) - mesAnt) / mesAnt) * 100) : null

    const [{ count: porAprobar }] = await db('quotes').where('estado', 'pendiente').count()

    const [{ count: entregados }] = await db('shipments').where('estado', 'Entregado').count()
    const [{ count: incidencias }] = await db('shipments').where('incidencia', true).count()
    const totalCerrados = Number(entregados) + Number(incidencias)
    const entregasATiempo = totalCerrados > 0 ? Math.round((Number(entregados) / totalCerrados) * 100) : 100

    const recientes = await db('shipments').orderBy('created_at', 'desc').limit(4)
    const pendientes = await db('quotes as q')
      .leftJoin('users as u', 'u.id', 'q.created_by')
      .select('q.*', 'u.nombre as vendedor')
      .where('q.estado', 'pendiente')
      .orderBy('q.created_at', 'desc')
      .limit(3)

    res.json({
      kpis: {
        enviosActivos: Number(activos),
        enviosNuevosSemana: Number(nuevosSemana),
        cotizacionesMes: Number(cotizacionesMes),
        deltaCotizaciones,
        porAprobar: Number(porAprobar),
        entregasATiempo,
      },
      recientes,
      pendientes,
    })
  } catch (err) {
    next(err)
  }
})
