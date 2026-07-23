import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { posicion, proyeccion } from '../services/tesoreria.js'

// Tesorería / Flujo de Caja. Solo finanzas (admin + CxC).

export const tesoreriaRouter = Router()
tesoreriaRouter.use(requireAuth)
tesoreriaRouter.use(requireRole('admin', 'cxc'))

const MONEDAS = ['Bs', 'USD'] as const

// ── Resumen: posición consolidada + proyección de caja ───────────────────────
tesoreriaRouter.get('/resumen', async (req, res, next) => {
  try {
    const semanas = Math.min(26, Math.max(4, Number(req.query.semanas) || 12))
    const [pos, proy] = await Promise.all([posicion(), proyeccion(semanas)])
    res.json({ posicion: pos, proyeccion: proy })
  } catch (err) {
    next(err)
  }
})

// ── Bancos ───────────────────────────────────────────────────────────────────
tesoreriaRouter.get('/bancos', async (_req, res, next) => {
  try {
    const bancos = await db('bancos').orderBy(['orden', 'id'])
    res.json({ bancos })
  } catch (err) {
    next(err)
  }
})

const bancoSchema = z.object({
  nombre: z.string().min(1).max(120),
  moneda: z.enum(MONEDAS).default('Bs'),
  numero: z.string().max(60).optional().nullable(),
  activo: z.boolean().optional(),
  orden: z.number().int().optional(),
})

tesoreriaRouter.post('/bancos', async (req, res, next) => {
  try {
    const data = bancoSchema.parse(req.body)
    const [banco] = await db('bancos').insert(data).returning('*')
    res.status(201).json({ banco })
  } catch (err) {
    next(err)
  }
})

tesoreriaRouter.patch('/bancos/:id', async (req, res, next) => {
  try {
    const data = bancoSchema.partial().parse(req.body)
    const [banco] = await db('bancos').where('id', Number(req.params.id)).update(data).returning('*')
    if (!banco) {
      res.status(404).json({ error: 'Banco no encontrado' })
      return
    }
    res.json({ banco })
  } catch (err) {
    next(err)
  }
})

// ── Movimientos ──────────────────────────────────────────────────────────────
tesoreriaRouter.get('/movimientos', async (req, res, next) => {
  try {
    const q = db('mov_tesoreria as m')
      .leftJoin('bancos as b', 'b.id', 'm.banco_id')
      .select('m.*', 'b.nombre as banco_nombre', 'b.moneda as banco_moneda')
      .orderBy('m.fecha', 'desc')
      .orderBy('m.id', 'desc')
      .limit(Math.min(500, Number(req.query.limit) || 200))
    if (req.query.banco_id) q.where('m.banco_id', Number(req.query.banco_id))
    const movimientos = await q
    res.json({ movimientos })
  } catch (err) {
    next(err)
  }
})

const movSchema = z.object({
  banco_id: z.number().int(),
  fecha: z.string().min(8),
  tipo: z.enum(['ingreso', 'egreso']),
  monto: z.number().positive(),
  moneda: z.enum(MONEDAS).default('Bs'),
  tasa: z.number().positive().optional().nullable(),
  concepto: z.string().min(1).max(200),
  categoria: z.string().max(80).optional().nullable(),
  referencia: z.string().max(120).optional().nullable(),
  conciliado: z.boolean().optional(),
})

tesoreriaRouter.post('/movimientos', async (req, res, next) => {
  try {
    const data = movSchema.parse(req.body)
    const [mov] = await db('mov_tesoreria')
      .insert({ ...data, origen: 'manual', created_by: req.user!.id })
      .returning('*')
    res.status(201).json({ movimiento: mov })
  } catch (err) {
    next(err)
  }
})

tesoreriaRouter.delete('/movimientos/:id', async (req, res, next) => {
  try {
    const n = await db('mov_tesoreria').where('id', Number(req.params.id)).del()
    res.json({ ok: n > 0 })
  } catch (err) {
    next(err)
  }
})

// ── Compromisos de pago (CxP nativo) ─────────────────────────────────────────
tesoreriaRouter.get('/compromisos', async (req, res, next) => {
  try {
    const incluirPagados = req.query.pagados === '1'
    const q = db('compromisos_pago').orderBy('fecha_venc', 'asc')
    if (!incluirPagados) q.where('pagado', false)
    const compromisos = await q
    res.json({ compromisos })
  } catch (err) {
    next(err)
  }
})

const compromisoSchema = z.object({
  proveedor: z.string().min(1).max(120),
  descripcion: z.string().max(200).optional().nullable(),
  monto: z.number().positive(),
  moneda: z.enum(MONEDAS).default('Bs'),
  tasa: z.number().positive().optional().nullable(),
  fecha_venc: z.string().min(8),
  prioridad: z.enum(['alta', 'media', 'baja']).default('media'),
})

tesoreriaRouter.post('/compromisos', async (req, res, next) => {
  try {
    const data = compromisoSchema.parse(req.body)
    const [compromiso] = await db('compromisos_pago')
      .insert({ ...data, created_by: req.user!.id })
      .returning('*')
    res.status(201).json({ compromiso })
  } catch (err) {
    next(err)
  }
})

// Marcar pagado (opcionalmente registra el egreso en un banco) o editar
tesoreriaRouter.patch('/compromisos/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const schema = compromisoSchema.partial().extend({ pagado: z.boolean().optional(), banco_id: z.number().int().optional() })
    const data = schema.parse(req.body)
    const { pagado, banco_id, ...resto } = data

    const compromiso = await db('compromisos_pago').where('id', id).first()
    if (!compromiso) {
      res.status(404).json({ error: 'Compromiso no encontrado' })
      return
    }

    const patch: Record<string, unknown> = { ...resto }
    if (pagado != null) {
      patch.pagado = pagado
      patch.pagado_at = pagado ? db.fn.now() : null
      // Al marcar pagado con banco, deja registrado el egreso en tesorería.
      if (pagado && banco_id && !compromiso.pagado) {
        await db('mov_tesoreria').insert({
          banco_id,
          fecha: new Date().toISOString().slice(0, 10),
          tipo: 'egreso',
          monto: compromiso.monto,
          moneda: compromiso.moneda,
          tasa: compromiso.tasa,
          concepto: `Pago a ${compromiso.proveedor}${compromiso.descripcion ? ` — ${compromiso.descripcion}` : ''}`,
          categoria: 'Compromisos',
          origen: 'manual',
          created_by: req.user!.id,
        })
      }
    }
    const [actualizado] = await db('compromisos_pago').where('id', id).update(patch).returning('*')
    res.json({ compromiso: actualizado })
  } catch (err) {
    next(err)
  }
})

tesoreriaRouter.delete('/compromisos/:id', async (req, res, next) => {
  try {
    const n = await db('compromisos_pago').where('id', Number(req.params.id)).del()
    res.json({ ok: n > 0 })
  } catch (err) {
    next(err)
  }
})
