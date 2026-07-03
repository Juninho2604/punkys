import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { avanzarEnvio, marcarIncidencia } from '../services/workflow.js'
import { HttpError } from '../middleware/errors.js'

export const shipmentsRouter = Router()
shipmentsRouter.use(requireAuth)

shipmentsRouter.get('/', async (_req, res, next) => {
  try {
    const shipments = await db('shipments').orderBy('created_at', 'desc').limit(200)
    res.json({ shipments })
  } catch (err) {
    next(err)
  }
})

shipmentsRouter.get('/:id', async (req, res, next) => {
  try {
    const shipment = await db('shipments').where({ id: Number(req.params.id) }).first()
    if (!shipment) throw new HttpError(404, 'Envío no encontrado')
    const milestones = await db('shipment_milestones').where({ shipment_id: shipment.id }).orderBy('idx')
    const docs = await db('shipment_docs').where({ shipment_id: shipment.id }).orderBy('id')
    res.json({ shipment, milestones, docs })
  } catch (err) {
    next(err)
  }
})

const patchSchema = z.object({
  transportista: z.string().trim().min(1).optional(),
  placa: z.string().trim().optional(),
  eta: z.string().trim().optional(),
  contactoWhatsapp: z.string().trim().optional(),
  contactoEmail: z.string().trim().email().optional().or(z.literal('')),
})

shipmentsRouter.patch('/:id', requireRole('despacho'), async (req, res, next) => {
  try {
    const datos = patchSchema.parse(req.body)
    const update: Record<string, unknown> = { updated_at: db.fn.now() }
    if (datos.transportista !== undefined) update.transportista = datos.transportista
    if (datos.placa !== undefined) update.placa = datos.placa
    if (datos.eta !== undefined) update.eta = datos.eta
    if (datos.contactoWhatsapp !== undefined) update.contacto_whatsapp = datos.contactoWhatsapp
    if (datos.contactoEmail !== undefined) update.contacto_email = datos.contactoEmail || null
    const [shipment] = await db('shipments').where({ id: Number(req.params.id) }).update(update).returning('*')
    if (!shipment) throw new HttpError(404, 'Envío no encontrado')
    res.json({ shipment })
  } catch (err) {
    next(err)
  }
})

shipmentsRouter.post('/:id/advance', requireRole('despacho'), async (req, res, next) => {
  try {
    const shipment = await avanzarEnvio(Number(req.params.id))
    res.json({ shipment })
  } catch (err) {
    next(err)
  }
})

shipmentsRouter.post('/:id/incidencia', requireRole('despacho'), async (req, res, next) => {
  try {
    const on = Boolean(req.body?.on)
    const shipment = await marcarIncidencia(Number(req.params.id), on)
    res.json({ shipment })
  } catch (err) {
    next(err)
  }
})
