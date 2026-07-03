import { Router } from 'express'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { profitPlus } from '../integrations/profitplus/index.js'
import { config } from '../config.js'

export const systemRouter = Router()
systemRouter.use(requireAuth)

// Estado de las integraciones (visible para el Owner/admin)
systemRouter.get('/status', requireRole(), async (_req, res, next) => {
  try {
    const pp = await profitPlus.status()
    res.json({
      profitPlus: pp,
      notificaciones: {
        email: config.email.provider,
        whatsapp: config.whatsapp.provider,
      },
    })
  } catch (err) {
    next(err)
  }
})

// Bitácora de notificaciones automáticas enviadas (email + WhatsApp)
systemRouter.get('/notificaciones', requireRole(), async (_req, res, next) => {
  try {
    const log = await db('notification_log').orderBy('created_at', 'desc').limit(100)
    res.json({ log })
  } catch (err) {
    next(err)
  }
})
