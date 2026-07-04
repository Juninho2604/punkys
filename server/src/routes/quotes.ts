import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { SERVICIOS, IVA_RATE, SEGURO_RATE } from '../services/pricing.js'
import { crearCotizacion, enviarAAprobacion, decidirCotizacion, devolverAPendiente } from '../services/workflow.js'

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
    res.json({ quotes: await q })
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
    res.json({ quote })
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
  pesoKg: z.coerce.number().positive('El peso debe ser mayor que 0'),
  volumenM3: z.coerce.number().min(0).default(0),
  bultos: z.coerce.number().int().positive().default(1),
  valorDeclarado: z.coerce.number().min(0).default(0),
  servicio: z.enum(['terrestre', 'express', 'frio', 'especial']),
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

quotesRouter.post('/:id/reopen', requireRole('cxc'), async (req, res, next) => {
  try {
    const quote = await devolverAPendiente(Number(req.params.id))
    res.json({ quote })
  } catch (err) {
    next(err)
  }
})
