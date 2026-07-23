import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { generarReporte, enviarReporte } from '../services/reportesIA.js'
import { config } from '../config.js'

// Reportes ejecutivos con IA (solo Owner/admin).
export const reportesRouter = Router()
reportesRouter.use(requireAuth)

// Vista previa: genera el reporte sin enviarlo.
reportesRouter.get('/preview', requireRole(), async (_req, res, next) => {
  try {
    res.json(await generarReporte())
  } catch (err) {
    next(err)
  }
})

// Envía el reporte por correo a los administradores.
reportesRouter.post('/enviar', requireRole(), async (_req, res, next) => {
  try {
    res.json(await enviarReporte())
  } catch (err) {
    next(err)
  }
})

// Estado de la integración (si hay API key configurada).
reportesRouter.get('/estado', requireRole(), (_req, res) => {
  res.json({ habilitado: config.ia.habilitado, modelo: config.ia.model, horaDiario: config.ia.reporteDiarioHora })
})
