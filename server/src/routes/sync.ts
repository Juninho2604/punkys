import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { config } from '../config.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

// Puente de datos (Fase 1 del plan maestro): los extractores de la PC del
// cliente suben aquí el inventario real de Profit. Autenticación por token
// estático (SYNC_TOKEN) porque quien llama es un script, no una persona.

export const syncRouter = Router()

function tokenValido(header: string | undefined): boolean {
  if (!config.syncToken) return false
  if (!header) return false
  const token = header.startsWith('Bearer ') ? header.slice(7) : header
  return token === config.syncToken
}

const productosSchema = z.object({
  fuente: z.string().trim().max(200).optional(),
  productos: z
    .array(
      z.object({
        codigo: z.string().trim().min(1).max(60),
        nombre: z.string().trim().min(1).max(300),
        precio: z.number().min(0),
        moneda: z.string().trim().max(10).optional().default('USD'),
        stock: z.record(z.string(), z.number()),
      }),
    )
    .min(1, 'El catálogo llegó vacío')
    .max(20000),
})

// Sincronización COMPLETA del catálogo: upsert de lo recibido y desactivación
// de lo que ya no venga (productos descontinuados dejan de ser cotizables,
// pero se conservan para las cotizaciones históricas).
syncRouter.post('/productos', async (req, res, next) => {
  try {
    if (!config.syncToken) {
      res.status(503).json({ error: 'Ingesta deshabilitada: define SYNC_TOKEN en el .env del servidor' })
      return
    }
    if (!tokenValido(req.headers.authorization)) {
      res.status(401).json({ error: 'Token de sincronización inválido' })
      return
    }

    const { fuente, productos } = productosSchema.parse(req.body)

    // Rechazar códigos duplicados en el payload (señal de un export corrupto)
    const codigos = productos.map((p) => p.codigo)
    if (new Set(codigos).size !== codigos.length) {
      res.status(400).json({ error: 'El payload trae códigos de producto duplicados' })
      return
    }

    let desactivados = 0
    await db.transaction(async (trx) => {
      for (const p of productos) {
        await trx('pp_products')
          .insert({
            codigo: p.codigo,
            nombre: p.nombre,
            precio: p.precio,
            moneda: p.moneda,
            stock: JSON.stringify(p.stock),
            activo: true,
            updated_at: trx.fn.now(),
          })
          .onConflict('codigo')
          .merge(['nombre', 'precio', 'moneda', 'stock', 'activo', 'updated_at'])
      }
      const res2 = await trx('pp_products').whereNotIn('codigo', codigos).andWhere('activo', true).update({
        activo: false,
        updated_at: trx.fn.now(),
      })
      desactivados = res2
      await trx('sync_log').insert({
        dataset: 'productos',
        fuente: fuente ?? null,
        registros: productos.length,
        desactivados,
        detalle: null,
      })
    })

    console.log(`🔄 [Sync] Inventario: ${productos.length} productos (${desactivados} desactivados) · fuente: ${fuente ?? '—'}`)
    res.json({ ok: true, recibidos: productos.length, desactivados })
  } catch (err) {
    next(err)
  }
})

// Estado del puente (para el admin en la intranet)
syncRouter.get('/estado', requireAuth, requireRole(), async (_req, res, next) => {
  try {
    const ultimos = await db('sync_log').orderBy('created_at', 'desc').limit(10)
    const [{ count: activos }] = await db('pp_products').where('activo', true).count()
    const [{ count: total }] = await db('pp_products').count()
    res.json({ productosActivos: Number(activos), productosTotal: Number(total), sincronizaciones: ultimos })
  } catch (err) {
    next(err)
  }
})
