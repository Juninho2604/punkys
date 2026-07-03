import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { COOKIE_NAME, requireAuth, signToken, type AuthUser } from '../middleware/auth.js'
import { config } from '../config.js'

export const authRouter = Router()

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
  recordar: z.boolean().optional(),
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password, recordar } = loginSchema.parse(req.body)
    const row = await db('users').whereRaw('lower(email) = lower(?)', [email.trim()]).first()
    if (!row || !row.activo || !(await bcrypt.compare(password, row.password_hash))) {
      res.status(401).json({ error: 'Credenciales incorrectas' })
      return
    }
    const user: AuthUser = { id: row.id, nombre: row.nombre, email: row.email, rol: row.rol }
    res.cookie(COOKIE_NAME, signToken(user), {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.cookieSecure,
      maxAge: (recordar ? 12 * 7 : 12) * 60 * 60 * 1000,
    })
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME)
  res.json({ ok: true })
})

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})
