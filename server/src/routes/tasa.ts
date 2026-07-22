import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { obtenerTasa, refrescarTasa, fijarTasaManual } from '../services/tasaCambio.js'

// Tasa de cambio oficial (BCV). La leen todos los módulos con montos para
// mostrar el equivalente en USD. Refrescar/fijar es solo admin.

export const tasaRouter = Router()

tasaRouter.get('/', requireAuth, async (_req, res, next) => {
  try {
    res.json(await obtenerTasa())
  } catch (err) {
    next(err)
  }
})

tasaRouter.post('/refresh', requireAuth, requireRole(), async (_req, res, next) => {
  try {
    res.json(await refrescarTasa())
  } catch (err) {
    next(err)
  }
})

const manualSchema = z.object({ valor: z.number().positive().max(100000) })

tasaRouter.put('/', requireAuth, requireRole(), async (req, res, next) => {
  try {
    const { valor } = manualSchema.parse(req.body)
    res.json(await fijarTasaManual(valor))
  } catch (err) {
    next(err)
  }
})
