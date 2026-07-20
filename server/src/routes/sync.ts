import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { config } from '../config.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { normalizarNombre } from '../services/normalize.js'

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

// ── Cuentas por Cobrar (snapshot completo por documento) ─────────────────────
const cxcSchema = z.object({
  fuente: z.string().trim().max(200).optional(),
  cuentas: z
    .array(
      z.object({
        cliente: z.string().trim().min(1).max(300),
        vendedor: z.string().trim().max(200).optional().default(''),
        documento: z.string().trim().max(60).optional().default(''),
        tipoDoc: z.string().trim().max(40).optional().default(''),
        fechaEmision: z.string().trim().max(20).optional().default(''),
        fechaVenc: z.string().trim().max(20).optional().default(''),
        total: z.number().default(0),
        saldo: z.number(),
        diasVencido: z.number().int().default(0),
        moneda: z.string().trim().max(10).optional().default('USD'),
      }),
    )
    .max(50000),
})

syncRouter.post('/cxc', async (req, res, next) => {
  try {
    if (!config.syncToken) return void res.status(503).json({ error: 'Ingesta deshabilitada' })
    if (!tokenValido(req.headers.authorization)) return void res.status(401).json({ error: 'Token inválido' })
    const { fuente, cuentas } = cxcSchema.parse(req.body)

    await db.transaction(async (trx) => {
      await trx('pp_cxc').del()
      if (cuentas.length) {
        await trx.batchInsert(
          'pp_cxc',
          cuentas.map((c) => ({
            cliente_norm: normalizarNombre(c.cliente),
            cliente: c.cliente,
            vendedor: c.vendedor || null,
            documento: c.documento || null,
            tipo_doc: c.tipoDoc || null,
            fecha_emision: c.fechaEmision || null,
            fecha_venc: c.fechaVenc || null,
            total: c.total,
            saldo: c.saldo,
            dias_vencido: c.diasVencido,
            moneda: c.moneda,
          })),
          500,
        )
      }
      await trx('sync_log').insert({ dataset: 'cxc', fuente: fuente ?? null, registros: cuentas.length })
    })
    console.log(`🔄 [Sync] CxC: ${cuentas.length} documentos · fuente: ${fuente ?? '—'}`)
    res.json({ ok: true, recibidos: cuentas.length })
  } catch (err) {
    next(err)
  }
})

// ── Ventas agregadas (snapshot completo por mes × vendedor × categoría) ──────
const ventasSchema = z.object({
  fuente: z.string().trim().max(200).optional(),
  ventas: z
    .array(
      z.object({
        mes: z.string().trim().regex(/^\d{4}-\d{2}$/, 'mes debe ser YYYY-MM'),
        vendedor: z.string().trim().max(200).optional().default(''),
        categoria: z.string().trim().max(120).optional().default('otros'),
        unidades: z.number().default(0),
        montoUsd: z.number().default(0),
        margenUsd: z.number().nullable().optional(),
      }),
    )
    .max(50000),
})

syncRouter.post('/ventas', async (req, res, next) => {
  try {
    if (!config.syncToken) return void res.status(503).json({ error: 'Ingesta deshabilitada' })
    if (!tokenValido(req.headers.authorization)) return void res.status(401).json({ error: 'Token inválido' })
    const { fuente, ventas } = ventasSchema.parse(req.body)

    await db.transaction(async (trx) => {
      await trx('pp_ventas').del()
      if (ventas.length) {
        await trx.batchInsert(
          'pp_ventas',
          ventas.map((v) => ({
            mes: v.mes,
            vendedor: v.vendedor || null,
            categoria: v.categoria || 'otros',
            unidades: v.unidades,
            monto_usd: v.montoUsd,
            margen_usd: v.margenUsd ?? null,
          })),
          500,
        )
      }
      await trx('sync_log').insert({ dataset: 'ventas', fuente: fuente ?? null, registros: ventas.length })
    })
    console.log(`🔄 [Sync] Ventas: ${ventas.length} filas · fuente: ${fuente ?? '—'}`)
    res.json({ ok: true, recibidos: ventas.length })
  } catch (err) {
    next(err)
  }
})

// ── Cobranzas por documento (snapshot completo · base de las comisiones) ─────
const cobranzasSchema = z.object({
  fuente: z.string().trim().max(200).optional(),
  cobranzas: z
    .array(
      z.object({
        fecha: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'fecha debe ser YYYY-MM-DD'),
        documento: z.string().trim().max(60).optional().default(''),
        cliente: z.string().trim().max(300).optional().default(''),
        vendedor: z.string().trim().min(1).max(200),
        montoUsd: z.number(),
        moneda: z.string().trim().max(10).optional().default('USD'),
      }),
    )
    .max(50000),
})

syncRouter.post('/cobranzas', async (req, res, next) => {
  try {
    if (!config.syncToken) return void res.status(503).json({ error: 'Ingesta deshabilitada' })
    if (!tokenValido(req.headers.authorization)) return void res.status(401).json({ error: 'Token inválido' })
    const { fuente, cobranzas } = cobranzasSchema.parse(req.body)

    await db.transaction(async (trx) => {
      await trx('pp_cobranzas').del()
      if (cobranzas.length) {
        await trx.batchInsert(
          'pp_cobranzas',
          cobranzas.map((c) => ({
            fecha: c.fecha,
            documento: c.documento || null,
            cliente: c.cliente || null,
            vendedor_norm: normalizarNombre(c.vendedor),
            vendedor: c.vendedor,
            monto_usd: c.montoUsd,
            moneda: c.moneda,
          })),
          500,
        )
      }
      await trx('sync_log').insert({ dataset: 'cobranzas', fuente: fuente ?? null, registros: cobranzas.length })
    })
    console.log(`🔄 [Sync] Cobranzas: ${cobranzas.length} documentos · fuente: ${fuente ?? '—'}`)
    res.json({ ok: true, recibidos: cobranzas.length })
  } catch (err) {
    next(err)
  }
})

// ── Compras por documento (snapshot completo · lado del gasto) ───────────────
const comprasSchema = z.object({
  fuente: z.string().trim().max(200).optional(),
  compras: z
    .array(
      z.object({
        fecha: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'fecha debe ser YYYY-MM-DD'),
        documento: z.string().trim().max(60).optional().default(''),
        proveedor: z.string().trim().min(1).max(300),
        categoria: z.string().trim().max(120).optional().default(''),
        montoUsd: z.number(),
        moneda: z.string().trim().max(10).optional().default('USD'),
      }),
    )
    .max(50000),
})

syncRouter.post('/compras', async (req, res, next) => {
  try {
    if (!config.syncToken) return void res.status(503).json({ error: 'Ingesta deshabilitada' })
    if (!tokenValido(req.headers.authorization)) return void res.status(401).json({ error: 'Token inválido' })
    const { fuente, compras } = comprasSchema.parse(req.body)

    await db.transaction(async (trx) => {
      await trx('pp_compras').del()
      if (compras.length) {
        await trx.batchInsert(
          'pp_compras',
          compras.map((c) => ({
            fecha: c.fecha,
            documento: c.documento || null,
            proveedor: c.proveedor,
            categoria: c.categoria || null,
            monto_usd: c.montoUsd,
            moneda: c.moneda,
          })),
          500,
        )
      }
      await trx('sync_log').insert({ dataset: 'compras', fuente: fuente ?? null, registros: compras.length })
    })
    console.log(`🔄 [Sync] Compras: ${compras.length} documentos · fuente: ${fuente ?? '—'}`)
    res.json({ ok: true, recibidos: compras.length })
  } catch (err) {
    next(err)
  }
})

// ── Cuentas por Pagar (snapshot completo por documento) ──────────────────────
const cxpSchema = z.object({
  fuente: z.string().trim().max(200).optional(),
  cuentas: z
    .array(
      z.object({
        proveedor: z.string().trim().min(1).max(300),
        documento: z.string().trim().max(60).optional().default(''),
        tipoDoc: z.string().trim().max(40).optional().default(''),
        fechaEmision: z.string().trim().max(20).optional().default(''),
        fechaVenc: z.string().trim().max(20).optional().default(''),
        total: z.number().default(0),
        saldo: z.number(),
        diasVencido: z.number().int().default(0),
        moneda: z.string().trim().max(10).optional().default('USD'),
      }),
    )
    .max(50000),
})

syncRouter.post('/cxp', async (req, res, next) => {
  try {
    if (!config.syncToken) return void res.status(503).json({ error: 'Ingesta deshabilitada' })
    if (!tokenValido(req.headers.authorization)) return void res.status(401).json({ error: 'Token inválido' })
    const { fuente, cuentas } = cxpSchema.parse(req.body)

    await db.transaction(async (trx) => {
      await trx('pp_cxp').del()
      if (cuentas.length) {
        await trx.batchInsert(
          'pp_cxp',
          cuentas.map((c) => ({
            proveedor: c.proveedor,
            documento: c.documento || null,
            tipo_doc: c.tipoDoc || null,
            fecha_emision: c.fechaEmision || null,
            fecha_venc: c.fechaVenc || null,
            total: c.total,
            saldo: c.saldo,
            dias_vencido: c.diasVencido,
            moneda: c.moneda,
          })),
          500,
        )
      }
      await trx('sync_log').insert({ dataset: 'cxp', fuente: fuente ?? null, registros: cuentas.length })
    })
    console.log(`🔄 [Sync] CxP: ${cuentas.length} documentos · fuente: ${fuente ?? '—'}`)
    res.json({ ok: true, recibidos: cuentas.length })
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
    const [{ count: cxc }] = await db('pp_cxc').count()
    const [{ count: ventas }] = await db('pp_ventas').count()
    const [{ count: cobranzas }] = await db('pp_cobranzas').count()
    const [{ count: compras }] = await db('pp_compras').count()
    const [{ count: cxp }] = await db('pp_cxp').count()
    res.json({
      documentosCompras: Number(compras),
      documentosCxp: Number(cxp),
      productosActivos: Number(activos),
      productosTotal: Number(total),
      documentosCxc: Number(cxc),
      filasVentas: Number(ventas),
      documentosCobranzas: Number(cobranzas),
      sincronizaciones: ultimos,
    })
  } catch (err) {
    next(err)
  }
})
