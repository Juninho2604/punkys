import { Router } from 'express'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

// Consulta de los catálogos operacionales espejados desde la intranet-Sheets
// del cliente (Ola 1 de la migración). Solo admin por ahora.

export const operacionalRouter = Router()
operacionalRouter.use(requireAuth, requireRole())

operacionalRouter.get('/catalogos', async (_req, res, next) => {
  try {
    const [productos, almacenes, categorias, logs] = await Promise.all([
      db('op_productos').orderBy('orden').orderBy('nombre'),
      db('op_almacenes').orderBy('orden').orderBy('nombre'),
      db('op_categorias').orderBy('orden').orderBy('categoria'),
      db('sync_log').whereIn('dataset', ['op_productos', 'op_almacenes', 'op_categorias']).orderBy('created_at', 'desc').limit(3),
    ])
    res.json({
      productos,
      almacenes,
      categorias,
      actualizado: logs[0]?.created_at ?? null,
    })
  } catch (err) {
    next(err)
  }
})
