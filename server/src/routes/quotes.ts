import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { SERVICIOS, IVA_RATE, SEGURO_RATE } from '../services/pricing.js'
import { crearCotizacion, enviarAAprobacion, decidirCotizacion, devolverAPendiente, facturarCotizacion } from '../services/workflow.js'
import { saldoDeClientes } from '../services/cxc.js'
import { normalizarNombre } from '../services/normalize.js'

export const quotesRouter = Router()
quotesRouter.use(requireAuth)

quotesRouter.get('/services', (_req, res) => {
  res.json({ servicios: SERVICIOS, ivaRate: IVA_RATE, seguroRate: SEGURO_RATE })
})

quotesRouter.get('/', async (req, res, next) => {
  try {
    const estado = req.query.estado as string | undefined
    const q = db('quotes as q')
      .leftJoin('users as u', 'u.id', 'q.created_by')
      .select('q.*', 'u.nombre as vendedor')
      .orderBy('q.created_at', 'desc')
      .limit(200)
    if (estado) q.where('q.estado', estado)
    const quotes = await q

    // Resumen de renglones por cotización ("3 productos · 14 unidades")
    const ids = quotes.map((x) => x.id)
    const agg = ids.length
      ? await db('quote_items')
          .whereIn('quote_id', ids)
          .groupBy('quote_id')
          .select('quote_id')
          .count('* as productos')
          .sum('cantidad as unidades')
      : []
    const porQuote = new Map(agg.map((a: any) => [a.quote_id, a]))
    for (const x of quotes) {
      const a = porQuote.get(x.id) as any
      x.resumen = a
        ? `${a.productos} producto${Number(a.productos) === 1 ? '' : 's'} · ${a.unidades} und`
        : (x.servicio ?? '—')
    }

    // Saldo por cobrar del cliente (solo para quien decide: cxc y admin)
    if (req.user!.rol === 'cxc' || req.user!.rol === 'admin') {
      const saldos = await saldoDeClientes(quotes.map((x) => x.razon_social))
      for (const x of quotes) {
        const s = saldos.get(normalizarNombre(x.razon_social))
        if (s) x.cxc = { saldo: s.saldo, vencido: s.vencido, peorDiasVencido: s.peorDiasVencido, moneda: s.moneda }
      }
    }

    res.json({ quotes })
  } catch (err) {
    next(err)
  }
})

quotesRouter.get('/:id(\\d+)', async (req, res, next) => {
  try {
    const quote = await db('quotes as q')
      .leftJoin('users as u', 'u.id', 'q.created_by')
      .leftJoin('users as d', 'd.id', 'q.decided_by')
      .select('q.*', 'u.nombre as vendedor', 'd.nombre as decidido_por')
      .where('q.id', Number(req.params.id))
      .first()
    if (!quote) {
      res.status(404).json({ error: 'Cotización no encontrada' })
      return
    }
    const items = await db('quote_items').where({ quote_id: quote.id }).orderBy('id')
    res.json({ quote: { ...quote, items } })
  } catch (err) {
    next(err)
  }
})

const nuevaSchema = z.object({
  razonSocial: z.string().trim().min(2, 'Razón social requerida'),
  rif: z
    .string()
    .trim()
    .regex(/^[VEJPG]-?\d{7,9}-?\d$/i, 'RIF inválido (formato J-00000000-0)'),
  telefono: z.string().trim().optional().default(''),
  contacto: z.string().trim().optional().default(''),
  origen: z.string().trim().min(2),
  destinoCiudad: z.string().trim().min(2, 'Ciudad destino requerida'),
  destinoDireccion: z.string().trim().min(5, 'Dirección de entrega requerida'),
  items: z
    .array(
      z.object({
        codigo: z.string().trim().min(1),
        cantidad: z.coerce.number().int().positive('La cantidad debe ser mayor que 0'),
      }),
    )
    .min(1, 'Agrega al menos un producto'),
})

quotesRouter.post('/', requireRole('vendedor'), async (req, res, next) => {
  try {
    const datos = nuevaSchema.parse(req.body)
    const quote = await crearCotizacion(datos, req.user!)
    res.status(201).json({ quote })
  } catch (err) {
    next(err)
  }
})

quotesRouter.post('/:id/submit', requireRole('vendedor'), async (req, res, next) => {
  try {
    const quote = await enviarAAprobacion(Number(req.params.id), req.user!)
    res.json({ quote })
  } catch (err) {
    next(err)
  }
})

quotesRouter.post('/:id/approve', requireRole('cxc'), async (req, res, next) => {
  try {
    const result = await decidirCotizacion(Number(req.params.id), 'aprobada', req.user!)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

quotesRouter.post('/:id/reject', requireRole('cxc'), async (req, res, next) => {
  try {
    const motivo = typeof req.body?.motivo === 'string' ? req.body.motivo : undefined
    const result = await decidirCotizacion(Number(req.params.id), 'rechazada', req.user!, motivo)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

quotesRouter.post('/:id/facturar', requireRole('facturacion'), async (req, res, next) => {
  try {
    const facturaNumero = z
      .string()
      .trim()
      .min(1, 'Indica el número de factura')
      .max(40)
      .parse(req.body?.facturaNumero)
    const result = await facturarCotizacion(Number(req.params.id), facturaNumero, req.user!)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

quotesRouter.post('/:id/reopen', requireRole('cxc'), async (req, res, next) => {
  try {
    const quote = await devolverAPendiente(Number(req.params.id))
    res.json({ quote })
  } catch (err) {
    next(err)
  }
})
