import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

// Catálogos operacionales: espejo inicial desde los Sheets del cliente, pero
// EDITABLES desde la intranet (activar/desactivar, visibilidad, foco, orden).
// Nuestra copia manda; el Sheet del cliente queda de referencia. Solo admin.

export const operacionalRouter = Router()
operacionalRouter.use(requireAuth, requireRole())

// Actualiza banderas/orden de un registro de catálogo (whitelist por entidad).
function editar(tabla: string, claveCol: string, campos: z.ZodRawShape) {
  const schema = z.object(campos)
  return async (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => {
    try {
      const data = schema.parse(req.body)
      const [row] = await db(tabla)
        .where(claveCol, String(req.params.clave))
        .update({ ...data, updated_at: db.fn.now() })
        .returning('*')
      if (!row) {
        res.status(404).json({ error: 'No encontrado' })
        return
      }
      res.json({ row })
    } catch (err) {
      next(err)
    }
  }
}

operacionalRouter.patch('/productos/:clave', editar('op_productos', 'codigo', {
  activo: z.boolean().optional(),
  mostrar_inventario: z.boolean().optional(),
  mostrar_ventas: z.boolean().optional(),
  mostrar_vendedores: z.boolean().optional(),
  foco_mes: z.boolean().optional(),
  orden: z.number().int().optional(),
}))

operacionalRouter.patch('/almacenes/:clave', editar('op_almacenes', 'codigo', {
  activo: z.boolean().optional(),
  mostrar_admin: z.boolean().optional(),
  mostrar_vendedor: z.boolean().optional(),
  mostrar_inventario: z.boolean().optional(),
  orden: z.number().int().optional(),
}))

operacionalRouter.patch('/categorias/:clave', editar('op_categorias', 'categoria', {
  activo: z.boolean().optional(),
  mostrar_dashboard: z.boolean().optional(),
  orden: z.number().int().optional(),
}))

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
