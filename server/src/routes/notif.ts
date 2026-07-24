import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

// Config de notificaciones (grupos de correo + tipos) — espejo de su Sheet de
// Configuración. Solo admin. El envío real depende del SMTP; aquí se gestiona
// el ruteo y los flags.
export const notifRouter = Router()
notifRouter.use(requireAuth)
notifRouter.use(requireRole())

notifRouter.get('/config', async (_req, res, next) => {
  try {
    const [grupos, tipos] = await Promise.all([
      db('notif_grupos').orderBy('grupo'),
      db('notif_tipos').orderBy('clave'),
    ])
    res.json({ grupos, tipos })
  } catch (err) {
    next(err)
  }
})

// ── Grupos de correo ─────────────────────────────────────────────────────────
const grupoSchema = z.object({
  grupo: z.string().min(1).max(60),
  correos: z.string().min(1),
})

notifRouter.post('/grupos', async (req, res, next) => {
  try {
    const data = grupoSchema.parse(req.body)
    const [g] = await db('notif_grupos').insert(data).onConflict('grupo').merge().returning('*')
    res.status(201).json({ grupo: g })
  } catch (err) {
    next(err)
  }
})

notifRouter.patch('/grupos/:id', async (req, res, next) => {
  try {
    const data = grupoSchema.partial().parse(req.body)
    const [g] = await db('notif_grupos').where('id', Number(req.params.id)).update({ ...data, updated_at: db.fn.now() }).returning('*')
    if (!g) {
      res.status(404).json({ error: 'Grupo no encontrado' })
      return
    }
    res.json({ grupo: g })
  } catch (err) {
    next(err)
  }
})

notifRouter.delete('/grupos/:id', async (req, res, next) => {
  try {
    const n = await db('notif_grupos').where('id', Number(req.params.id)).del()
    res.json({ ok: n > 0 })
  } catch (err) {
    next(err)
  }
})

// ── Tipos de notificación ────────────────────────────────────────────────────
const tipoSchema = z.object({
  clave: z.string().min(1).max(60),
  nombre: z.string().min(1).max(120),
  activo: z.boolean().optional(),
  para: z.string().max(200).optional().nullable(),
  cc: z.string().max(200).optional().nullable(),
  destino: z.string().max(200).optional().nullable(),
})

notifRouter.post('/tipos', async (req, res, next) => {
  try {
    const data = tipoSchema.parse(req.body)
    const [t] = await db('notif_tipos').insert(data).onConflict('clave').merge().returning('*')
    res.status(201).json({ tipo: t })
  } catch (err) {
    next(err)
  }
})

notifRouter.patch('/tipos/:id', async (req, res, next) => {
  try {
    const data = tipoSchema.partial().parse(req.body)
    const [t] = await db('notif_tipos').where('id', Number(req.params.id)).update({ ...data, updated_at: db.fn.now() }).returning('*')
    if (!t) {
      res.status(404).json({ error: 'Tipo no encontrado' })
      return
    }
    res.json({ tipo: t })
  } catch (err) {
    next(err)
  }
})

notifRouter.delete('/tipos/:id', async (req, res, next) => {
  try {
    const n = await db('notif_tipos').where('id', Number(req.params.id)).del()
    res.json({ ok: n > 0 })
  } catch (err) {
    next(err)
  }
})
