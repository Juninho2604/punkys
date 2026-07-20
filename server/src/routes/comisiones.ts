import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { normalizarNombre } from '../services/normalize.js'

// Fase 5: comisiones de vendedores sobre LO COBRADO (pp_cobranzas, puente de
// datos), corte quincenal (1–15 y 16–fin de mes). TODO el módulo es solo
// admin: el % de cada vendedor es información del dueño del negocio.

export const comisionesRouter = Router()
comisionesRouter.use(requireAuth, requireRole())

// ── Quincenas ────────────────────────────────────────────────────────────────
const iso = (d: Date) => d.toISOString().slice(0, 10)

function finDeQuincena(inicio: string): string {
  const [y, m, d] = inicio.split('-').map(Number)
  if (d === 1) return `${inicio.slice(0, 8)}15`
  return iso(new Date(Date.UTC(y, m, 0))) // día 0 del mes siguiente = último del mes
}

function quincenaAnterior(inicio: string): string {
  const [y, m, d] = inicio.split('-').map(Number)
  if (d === 16) return `${inicio.slice(0, 8)}01`
  const prev = new Date(Date.UTC(y, m - 2, 16))
  return iso(prev)
}

function quincenaDe(fechaISO: string): string {
  const dia = Number(fechaISO.slice(8, 10))
  return `${fechaISO.slice(0, 8)}${dia <= 15 ? '01' : '16'}`
}

const INICIO_RE = /^\d{4}-\d{2}-(01|16)$/

// ── Resumen de una quincena ──────────────────────────────────────────────────
comisionesRouter.get('/', async (req, res, next) => {
  try {
    // Rango disponible: cobranzas sincronizadas + pagos históricos
    const [cob] = await db('pp_cobranzas').min('fecha as min').max('fecha as max')
    const [pag] = await db('comision_pagos').min('periodo_inicio as min').max('periodo_inicio as max')
    const fechas = [cob.min, cob.max, pag.min, pag.max]
      .filter(Boolean)
      .map((f) => iso(new Date(f as string | Date)))
    if (fechas.length === 0) {
      res.json({ periodos: [], periodo: null, filas: [], totales: { baseUsd: 0, comisionUsd: 0 }, actualizado: null })
      return
    }
    const primera = quincenaDe(fechas.reduce((a, b) => (a < b ? a : b)))
    const ultima = quincenaDe(fechas.reduce((a, b) => (a > b ? a : b)))

    const periodos: { inicio: string; fin: string }[] = []
    for (let q = ultima; q >= primera; q = quincenaAnterior(q)) {
      periodos.push({ inicio: q, fin: finDeQuincena(q) })
      if (periodos.length > 120) break // tope sano: 5 años de quincenas
    }

    const periodoParam = typeof req.query.periodo === 'string' ? req.query.periodo : ''
    const inicio = INICIO_RE.test(periodoParam) ? periodoParam : ultima
    const fin = finDeQuincena(inicio)

    const [cobrado, pagos, configs, ultimoSync] = await Promise.all([
      db('pp_cobranzas')
        .whereBetween('fecha', [inicio, fin])
        .groupBy('vendedor_norm')
        .select('vendedor_norm')
        .max('vendedor as vendedor')
        .sum('monto_usd as base')
        .count('* as docs'),
      db('comision_pagos').where('periodo_inicio', inicio),
      db('comision_config').select('vendedor_norm', 'pct'),
      db('sync_log').where('dataset', 'cobranzas').orderBy('created_at', 'desc').first(),
    ])

    const pctDe = new Map(configs.map((c) => [c.vendedor_norm, Number(c.pct)]))
    const pagoDe = new Map(pagos.map((p) => [p.vendedor_norm, p]))

    const filas = cobrado.map((r) => {
      const pago = pagoDe.get(r.vendedor_norm)
      const pct = pago ? Number(pago.pct) : (pctDe.get(r.vendedor_norm) ?? null)
      const baseUsd = pago ? Number(pago.base_usd) : Number(r.base)
      return {
        vendedorNorm: r.vendedor_norm,
        vendedor: pago ? pago.vendedor : r.vendedor,
        baseUsd,
        docs: Number(r.docs),
        pct,
        comisionUsd: pago ? Number(pago.monto_usd) : pct != null ? Math.round(baseUsd * pct) / 100 : null,
        pago: pago
          ? { id: pago.id, referencia: pago.referencia, pagadaAt: pago.pagada_at }
          : null,
      }
    })
    // Pagos de vendedores que ya no aparecen en el export (la ventana corrió)
    for (const p of pagos) {
      if (!cobrado.some((r) => r.vendedor_norm === p.vendedor_norm)) {
        filas.push({
          vendedorNorm: p.vendedor_norm,
          vendedor: p.vendedor,
          baseUsd: Number(p.base_usd),
          docs: 0,
          pct: Number(p.pct),
          comisionUsd: Number(p.monto_usd),
          pago: { id: p.id, referencia: p.referencia, pagadaAt: p.pagada_at },
        })
      }
    }
    filas.sort((a, b) => b.baseUsd - a.baseUsd)

    res.json({
      periodos,
      periodo: { inicio, fin },
      filas,
      totales: {
        baseUsd: filas.reduce((s, f) => s + f.baseUsd, 0),
        comisionUsd: filas.reduce((s, f) => s + (f.comisionUsd ?? 0), 0),
      },
      actualizado: ultimoSync?.created_at ?? null,
    })
  } catch (err) {
    next(err)
  }
})

// ── % por vendedor (solo admin, por el guard de arriba) ──────────────────────
const configSchema = z.object({
  vendedor: z.string().trim().min(1).max(200),
  pct: z.number().min(0).max(100),
})

comisionesRouter.put('/config', async (req, res, next) => {
  try {
    const { vendedor, pct } = configSchema.parse(req.body)
    await db('comision_config')
      .insert({ vendedor_norm: normalizarNombre(vendedor), vendedor, pct, updated_at: db.fn.now() })
      .onConflict('vendedor_norm')
      .merge(['vendedor', 'pct', 'updated_at'])
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// ── Marcar quincena pagada (snapshot) ────────────────────────────────────────
const pagarSchema = z.object({
  vendedorNorm: z.string().trim().min(1).max(300),
  periodoInicio: z.string().regex(INICIO_RE, 'periodoInicio debe ser YYYY-MM-01 o YYYY-MM-16'),
  referencia: z.string().trim().max(120).optional(),
})

comisionesRouter.post('/pagar', async (req, res, next) => {
  try {
    const { vendedorNorm, periodoInicio, referencia } = pagarSchema.parse(req.body)
    const fin = finDeQuincena(periodoInicio)

    const cfg = await db('comision_config').where('vendedor_norm', vendedorNorm).first()
    if (!cfg) {
      res.status(400).json({ error: 'Configura primero el % de comisión de este vendedor' })
      return
    }
    const [agg] = await db('pp_cobranzas')
      .where('vendedor_norm', vendedorNorm)
      .whereBetween('fecha', [periodoInicio, fin])
      .max('vendedor as vendedor')
      .sum('monto_usd as base')
      .count('* as docs')
    if (!Number(agg.docs)) {
      res.status(400).json({ error: 'Este vendedor no tiene cobranzas en la quincena' })
      return
    }
    const baseUsd = Number(agg.base)
    const pct = Number(cfg.pct)
    const [pago] = await db('comision_pagos')
      .insert({
        vendedor_norm: vendedorNorm,
        vendedor: agg.vendedor,
        periodo_inicio: periodoInicio,
        periodo_fin: fin,
        base_usd: baseUsd,
        pct,
        monto_usd: Math.round(baseUsd * pct) / 100,
        referencia: referencia || null,
        pagada_by: req.user!.id,
      })
      .onConflict(['vendedor_norm', 'periodo_inicio'])
      .ignore()
      .returning('*')
    if (!pago) {
      res.status(409).json({ error: 'Esa quincena ya está marcada como pagada para este vendedor' })
      return
    }
    console.log(`💵 [Comisiones] ${agg.vendedor}: quincena ${periodoInicio} pagada (${pct}% de $${baseUsd}) por ${req.user!.nombre}`)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// Deshacer un pago (registrado por error)
comisionesRouter.delete('/pagar/:id', async (req, res, next) => {
  try {
    const borrados = await db('comision_pagos').where('id', Number(req.params.id)).del()
    if (!borrados) {
      res.status(404).json({ error: 'Pago no encontrado' })
      return
    }
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})
