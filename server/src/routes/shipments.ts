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

// Rentabilidad por despacho (Tesorería · solo admin): venta del pedido vs
// costos logísticos = margen. Montos en Bs; el USD es referencia en el front.
shipmentsRouter.get('/costos', requireRole('admin'), async (_req, res, next) => {
  try {
    const rows = await db('shipments as s')
      .leftJoin('quotes as q', 'q.id', 's.quote_id')
      .select(
        's.id',
        's.numero',
        's.cliente',
        's.estado',
        's.created_at',
        's.costo_flete',
        's.costo_combustible',
        's.costo_peaje',
        's.costo_otros',
        's.costo_nota',
        's.costos_at',
        'q.total as venta',
      )
      .orderBy('s.created_at', 'desc')
      .limit(300)

    const despachos = rows.map((r) => {
      const costo =
        Number(r.costo_flete ?? 0) +
        Number(r.costo_combustible ?? 0) +
        Number(r.costo_peaje ?? 0) +
        Number(r.costo_otros ?? 0)
      const venta = Number(r.venta ?? 0)
      const tieneCostos = r.costos_at != null
      const margen = venta - costo
      return {
        id: r.id,
        numero: r.numero,
        cliente: r.cliente,
        estado: r.estado,
        created_at: r.created_at,
        venta,
        costoFlete: Number(r.costo_flete ?? 0),
        costoCombustible: Number(r.costo_combustible ?? 0),
        costoPeaje: Number(r.costo_peaje ?? 0),
        costoOtros: Number(r.costo_otros ?? 0),
        costoNota: r.costo_nota ?? '',
        costo,
        tieneCostos,
        margen: tieneCostos ? margen : null,
        margenPct: tieneCostos && venta > 0 ? Math.round((margen / venta) * 1000) / 10 : null,
      }
    })

    const conCostos = despachos.filter((d) => d.tieneCostos)
    const totales = {
      venta: conCostos.reduce((s, d) => s + d.venta, 0),
      costo: conCostos.reduce((s, d) => s + d.costo, 0),
      margen: conCostos.reduce((s, d) => s + (d.margen ?? 0), 0),
      despachos: conCostos.length,
      sinCostos: despachos.length - conCostos.length,
    }
    res.json({ despachos, totales })
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

const costosSchema = z.object({
  costoFlete: z.coerce.number().nonnegative().optional(),
  costoCombustible: z.coerce.number().nonnegative().optional(),
  costoPeaje: z.coerce.number().nonnegative().optional(),
  costoOtros: z.coerce.number().nonnegative().optional(),
  costoNota: z.string().trim().max(400).optional().default(''),
})

// Registrar/actualizar los costos logísticos de un despacho (despacho o admin).
shipmentsRouter.patch('/:id/costos', requireRole('despacho'), async (req, res, next) => {
  try {
    const d = costosSchema.parse(req.body)
    const [shipment] = await db('shipments')
      .where({ id: Number(req.params.id) })
      .update({
        costo_flete: d.costoFlete ?? 0,
        costo_combustible: d.costoCombustible ?? 0,
        costo_peaje: d.costoPeaje ?? 0,
        costo_otros: d.costoOtros ?? 0,
        costo_nota: d.costoNota || null,
        costos_at: db.fn.now(),
        costos_by: req.user!.id,
        updated_at: db.fn.now(),
      })
      .returning('*')
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
