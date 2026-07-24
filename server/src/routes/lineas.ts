import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

// Control de líneas telefónicas (solo admin).
export const lineasRouter = Router()
lineasRouter.use(requireAuth)
lineasRouter.use(requireRole())

lineasRouter.get('/', async (_req, res, next) => {
  try {
    const lineas = await db('lineas_telefonicas').orderBy(['departamento', 'numero'])
    res.json({ lineas })
  } catch (err) {
    next(err)
  }
})

const schema = z.object({
  numero: z.string().min(1).max(40),
  operadora: z.string().max(40).optional().nullable(),
  departamento: z.string().max(60).optional().nullable(),
  asignado_a: z.string().max(120).optional().nullable(),
  plan: z.string().max(120).optional().nullable(),
  monto: z.number().nonnegative().optional().nullable(),
  moneda: z.enum(['Bs', 'USD']).optional(),
  fecha_corte: z.string().min(8).optional().nullable(),
  activo: z.boolean().optional(),
  nota: z.string().max(300).optional().nullable(),
})

lineasRouter.post('/', async (req, res, next) => {
  try {
    const data = schema.parse(req.body)
    const [linea] = await db('lineas_telefonicas').insert(data).returning('*')
    res.status(201).json({ linea })
  } catch (err) {
    next(err)
  }
})

lineasRouter.patch('/:id', async (req, res, next) => {
  try {
    const data = schema.partial().parse(req.body)
    const [linea] = await db('lineas_telefonicas')
      .where('id', Number(req.params.id))
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*')
    if (!linea) {
      res.status(404).json({ error: 'Línea no encontrada' })
      return
    }
    res.json({ linea })
  } catch (err) {
    next(err)
  }
})

lineasRouter.delete('/:id', async (req, res, next) => {
  try {
    const n = await db('lineas_telefonicas').where('id', Number(req.params.id)).del()
    res.json({ ok: n > 0 })
  } catch (err) {
    next(err)
  }
})
