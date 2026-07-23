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

// Estado de los respaldos automáticos (pg_dump vía cron en el VPS)
systemRouter.get('/backups', requireRole(), async (_req, res, next) => {
  try {
    const existe = await db.schema.hasTable('backup_log')
    if (!existe) {
      res.json({ configurado: false, ultimo: null, recientes: [] })
      return
    }
    const recientes = await db('backup_log').orderBy('created_at', 'desc').limit(14)
    const ultimo = recientes[0] ?? null
    const horas = ultimo ? (Date.now() - new Date(ultimo.created_at).getTime()) / 3_600_000 : null
    res.json({
      configurado: recientes.length > 0,
      ultimo,
      horasDesdeUltimo: horas,
      alDia: horas != null && horas < 26 && Boolean(ultimo?.ok), // ~1 día + margen
      recientes,
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
