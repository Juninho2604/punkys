import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { calcularReposicion, obtenerConfig, guardarConfig } from '../services/reposicion.js'

// Reposición / Compras. Solo admin (como el resto del BI de compras).

export const reposicionRouter = Router()
reposicionRouter.use(requireAuth)
reposicionRouter.use(requireRole())

reposicionRouter.get('/resumen', async (_req, res, next) => {
  try {
    res.json(await calcularReposicion())
  } catch (err) {
    next(err)
  }
})

reposicionRouter.get('/config', async (_req, res, next) => {
  try {
    res.json({ config: await obtenerConfig() })
  } catch (err) {
    next(err)
  }
})

const configSchema = z.object({
  cobertura_objetivo_sem: z.number().int().min(1).max(52).optional(),
  lead_total_sem: z.number().int().min(1).max(52).optional(),
  semanas_analisis: z.number().int().min(8).max(104).optional(),
  nivel_servicio_pct: z.number().min(80).max(99.5).optional(),
})

reposicionRouter.put('/config', async (req, res, next) => {
  try {
    const patch = configSchema.parse(req.body)
    res.json({ config: await guardarConfig(patch) })
  } catch (err) {
    next(err)
  }
})
