import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { HttpError } from '../middleware/errors.js'

// Gestión de usuarios (Fase 2 del plan maestro).
// Modelo heredado del sistema previo del cliente (Supabase profiles):
// usuarios activables/desactivables y control TOTAL en el servidor.
// Aquí reemplaza a Supabase: el login y los permisos viven en nuestra BD.

export const usersRouter = Router()
usersRouter.use(requireAuth)

const ROLES = ['vendedor', 'cxc', 'facturacion', 'despacho', 'mercaderista', 'admin'] as const

const emailSchema = z.string().trim().toLowerCase().email('Email inválido')
const passwordSchema = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(100)

// ── Mi cuenta: cambiar mi propia contraseña (todos los roles) ────────────────
usersRouter.post('/me/password', async (req, res, next) => {
  try {
    const { actual, nueva } = z.object({ actual: z.string().min(1), nueva: passwordSchema }).parse(req.body)
    const row = await db('users').where({ id: req.user!.id }).first()
    if (!row || !(await bcrypt.compare(actual, row.password_hash))) {
      throw new HttpError(401, 'La contraseña actual no es correcta')
    }
    await db('users')
      .where({ id: req.user!.id })
      .update({ password_hash: await bcrypt.hash(nueva, 10) })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// ── Administración (solo admin) ──────────────────────────────────────────────
usersRouter.use(requireRole())

usersRouter.get('/', async (_req, res, next) => {
  try {
    const users = await db('users')
      .select('id', 'nombre', 'email', 'rol', 'telefono', 'activo', 'created_at')
      .orderBy([{ column: 'activo', order: 'desc' }, { column: 'nombre' }])
    res.json({ users })
  } catch (err) {
    next(err)
  }
})

usersRouter.post('/', async (req, res, next) => {
  try {
    const datos = z
      .object({
        nombre: z.string().trim().min(2, 'Nombre requerido'),
        email: emailSchema,
        password: passwordSchema,
        rol: z.enum(ROLES),
        telefono: z.string().trim().max(30).optional().default(''),
      })
      .parse(req.body)

    const existe = await db('users').whereRaw('lower(email) = ?', [datos.email]).first()
    if (existe) throw new HttpError(409, 'Ya existe un usuario con ese email')

    const [user] = await db('users')
      .insert({
        nombre: datos.nombre,
        email: datos.email,
        password_hash: await bcrypt.hash(datos.password, 10),
        rol: datos.rol,
        telefono: datos.telefono || null,
        activo: true,
      })
      .returning(['id', 'nombre', 'email', 'rol', 'telefono', 'activo', 'created_at'])
    res.status(201).json({ user })
  } catch (err) {
    next(err)
  }
})

// Garantiza que siempre quede al menos un admin activo
async function otroAdminActivo(exceptoId: number): Promise<boolean> {
  const [{ count }] = await db('users').where({ rol: 'admin', activo: true }).whereNot('id', exceptoId).count()
  return Number(count) > 0
}

usersRouter.patch('/:id(\\d+)', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const datos = z
      .object({
        nombre: z.string().trim().min(2).optional(),
        rol: z.enum(ROLES).optional(),
        telefono: z.string().trim().max(30).optional(),
        activo: z.boolean().optional(),
      })
      .parse(req.body)

    const objetivo = await db('users').where({ id }).first()
    if (!objetivo) throw new HttpError(404, 'Usuario no encontrado')

    const esYo = id === req.user!.id
    if (esYo && datos.activo === false) throw new HttpError(409, 'No puedes desactivar tu propio usuario')
    const pierdeAdmin =
      objetivo.rol === 'admin' && ((datos.rol && datos.rol !== 'admin') || datos.activo === false)
    if (pierdeAdmin && !(await otroAdminActivo(id))) {
      throw new HttpError(409, 'No puedes dejar la intranet sin ningún administrador activo')
    }

    const update: Record<string, unknown> = {}
    if (datos.nombre !== undefined) update.nombre = datos.nombre
    if (datos.rol !== undefined) update.rol = datos.rol
    if (datos.telefono !== undefined) update.telefono = datos.telefono || null
    if (datos.activo !== undefined) update.activo = datos.activo
    const [user] = await db('users')
      .where({ id })
      .update(update)
      .returning(['id', 'nombre', 'email', 'rol', 'telefono', 'activo', 'created_at'])
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

// Restablecer la contraseña de otro usuario (admin)
usersRouter.post('/:id(\\d+)/password', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { nueva } = z.object({ nueva: passwordSchema }).parse(req.body)
    const objetivo = await db('users').where({ id }).first()
    if (!objetivo) throw new HttpError(404, 'Usuario no encontrado')
    await db('users').where({ id }).update({ password_hash: await bcrypt.hash(nueva, 10) })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})
