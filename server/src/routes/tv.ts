import { Router } from 'express'
import { db } from '../db/knex.js'
import { config } from '../config.js'
import { SERVICIOS } from '../services/pricing.js'

// Centro de Operaciones (modo TV): un solo endpoint agregado, de solo lectura,
// protegido por clave estática (TV_ACCESS_KEY) porque el TV no puede loguearse.
// El frontend lo consulta cada ~20s.

export const tvRouter = Router()

const nombreServicio = (id: string) => SERVICIOS.find((s) => s.id === id)?.nombre ?? id

tvRouter.get('/board', async (req, res, next) => {
  try {
    if (!config.tvAccessKey) {
      res.status(503).json({ error: 'Modo TV deshabilitado: define TV_ACCESS_KEY en el .env' })
      return
    }
    if (req.query.key !== config.tvAccessKey) {
      res.status(401).json({ error: 'Clave de acceso inválida' })
      return
    }

    // ── KPIs ────────────────────────────────────────────────────────────────
    const [{ count: cotHoy }] = await db('quotes').where('created_at', '>=', db.raw(`date_trunc('day', now())`)).count()
    const [{ count: cotMes }] = await db('quotes').where('created_at', '>=', db.raw(`date_trunc('month', now())`)).count()
    const [{ sum: montoCotizadoMes }] = await db('quotes')
      .where('created_at', '>=', db.raw(`date_trunc('month', now())`))
      .sum('total')
    const [{ sum: montoAprobadoMes }] = await db('quotes')
      .where('estado', 'aprobada')
      .andWhere('decided_at', '>=', db.raw(`date_trunc('month', now())`))
      .sum('total')
    const [{ count: porAprobar }] = await db('quotes').where('estado', 'pendiente').count()
    const [{ sum: montoPorAprobar }] = await db('quotes').where('estado', 'pendiente').sum('total')
    const [{ count: enviosActivos }] = await db('shipments').whereNot('estado', 'Entregado').count()
    const [{ count: entregadosMes }] = await db('shipments')
      .where('estado', 'Entregado')
      .andWhere('updated_at', '>=', db.raw(`date_trunc('month', now())`))
      .count()
    const [{ count: entregados }] = await db('shipments').where('estado', 'Entregado').count()
    const [{ count: conIncidencia }] = await db('shipments').where('incidencia', true).count()
    const cerrados = Number(entregados) + Number(conIncidencia)
    const entregasATiempo = cerrados > 0 ? Math.round((Number(entregados) / cerrados) * 100) : 100

    // ── Esperando aprobación (las más antiguas primero) ─────────────────────
    const pendientes = await db('quotes')
      .where('estado', 'pendiente')
      .orderBy('created_at', 'asc')
      .limit(8)
      .select('numero', 'razon_social', 'servicio', 'total', 'created_at')

    // ── Despachos activos (incidencias primero) ─────────────────────────────
    const envios = await db('shipments')
      .whereNot('estado', 'Entregado')
      .orderBy([
        { column: 'incidencia', order: 'desc' },
        { column: 'updated_at', order: 'desc' },
      ])
      .limit(10)
      .select('numero', 'cliente', 'origen', 'destino_ciudad', 'estado', 'eta', 'incidencia')

    const incidencias = await db('shipments')
      .where('incidencia', true)
      .select('numero', 'cliente', 'destino_ciudad')

    // ── Ticker: últimos eventos derivados de cotizaciones y envíos ──────────
    const ultQuotes = await db('quotes')
      .orderBy('updated_at', 'desc')
      .limit(10)
      .select('numero', 'razon_social', 'total', 'estado', 'servicio', 'created_at', 'decided_at')
    const ultShipments = await db('shipments')
      .orderBy('updated_at', 'desc')
      .limit(10)
      .select('numero', 'cliente', 'estado', 'destino_ciudad', 'created_at', 'updated_at')

    type Evento = { t: string; texto: string }
    const eventos: Evento[] = []
    for (const q of ultQuotes) {
      eventos.push({ t: q.created_at, texto: `📝 ${q.numero} · ${q.razon_social} · ${nombreServicio(q.servicio)}` })
      if (q.decided_at) {
        const emoji = q.estado === 'aprobada' ? '✅' : '⛔'
        eventos.push({ t: q.decided_at, texto: `${emoji} ${q.numero} ${q.estado} · ${q.razon_social}` })
      }
    }
    for (const s of ultShipments) {
      const emoji = s.estado === 'Entregado' ? '🎉' : s.estado === 'Incidencia' ? '⚠️' : '🚚'
      eventos.push({ t: s.updated_at, texto: `${emoji} ${s.numero} ${s.estado.toLowerCase()} · ${s.cliente} → ${s.destino_ciudad}` })
    }
    eventos.sort((a, b) => new Date(b.t).getTime() - new Date(a.t).getTime())

    res.json({
      ahora: new Date().toISOString(),
      kpis: {
        cotizacionesHoy: Number(cotHoy),
        cotizacionesMes: Number(cotMes),
        montoCotizadoMes: Number(montoCotizadoMes ?? 0),
        montoAprobadoMes: Number(montoAprobadoMes ?? 0),
        porAprobar: Number(porAprobar),
        montoPorAprobar: Number(montoPorAprobar ?? 0),
        enviosActivos: Number(enviosActivos),
        entregadosMes: Number(entregadosMes),
        entregasATiempo,
        incidencias: Number(conIncidencia),
      },
      pendientes,
      envios,
      incidencias,
      eventos: eventos.slice(0, 15),
    })
  } catch (err) {
    next(err)
  }
})
