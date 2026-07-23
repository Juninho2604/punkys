import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { normalizarNombre } from '../services/normalize.js'
import { enviarCxcDiario } from '../services/cxcDiario.js'

// Cuentas por Cobrar (Fase 4): consulta de saldos reales de Profit.
// Regla heredada: CxC es el único módulo donde se ven montos en la moneda real.
export const cxcRouter = Router()
cxcRouter.use(requireAuth)

// Resumen por cliente (para CxC y admin). Vencido = saldo con días_vencido > 0.
cxcRouter.get('/', requireRole('cxc'), async (_req, res, next) => {
  try {
    const rows = await db('pp_cxc')
      .groupBy('cliente_norm', 'cliente', 'moneda')
      .select('cliente', 'moneda')
      .sum({ saldo: 'saldo' })
      .sum({ saldoUsd: 'saldo_usd' })
      .sum({ vencido: db.raw('case when dias_vencido > 0 and saldo > 0 then saldo else 0 end') })
      .sum({ vencidoUsd: db.raw('case when dias_vencido > 0 and saldo > 0 then saldo_usd else 0 end') })
      .count({ documentos: '*' })
      .max({ peorDiasVencido: 'dias_vencido' })
      .orderBy('vencido', 'desc')

    const [tot] = await db('pp_cxc')
      .sum({ saldo: 'saldo' })
      .sum({ saldoUsd: 'saldo_usd' })
      .sum({ vencido: db.raw('case when dias_vencido > 0 and saldo > 0 then saldo else 0 end') })
      .sum({ vencidoUsd: db.raw('case when dias_vencido > 0 and saldo > 0 then saldo_usd else 0 end') })

    const ultimo = await db('sync_log').where('dataset', 'cxc').orderBy('created_at', 'desc').first()

    res.json({
      clientes: rows.map((r: any) => ({
        cliente: r.cliente,
        moneda: r.moneda,
        saldo: Number(r.saldo ?? 0),
        saldoUsd: Number(r.saldoUsd ?? 0),
        vencido: Number(r.vencido ?? 0),
        vencidoUsd: Number(r.vencidoUsd ?? 0),
        documentos: Number(r.documentos ?? 0),
        peorDiasVencido: Number(r.peorDiasVencido ?? 0),
      })),
      totales: {
        saldo: Number(tot?.saldo ?? 0), saldoUsd: Number(tot?.saldoUsd ?? 0),
        vencido: Number(tot?.vencido ?? 0), vencidoUsd: Number(tot?.vencidoUsd ?? 0),
      },
      actualizado: ultimo?.created_at ?? null,
    })
  } catch (err) {
    next(err)
  }
})

// ── Notas de cobranza colaborativas por cliente (cxc/admin) ──────────────────
cxcRouter.get('/notas', requireRole('cxc'), async (req, res, next) => {
  try {
    const cliente = String(req.query.cliente ?? '')
    const q = db('cxc_notas').orderBy('created_at', 'desc').limit(100)
    if (cliente) q.where('cliente_norm', normalizarNombre(cliente))
    res.json({ notas: await q })
  } catch (err) {
    next(err)
  }
})

const notaSchema = z.object({ cliente: z.string().trim().min(1).max(300), texto: z.string().trim().min(1).max(1000) })
cxcRouter.post('/notas', requireRole('cxc'), async (req, res, next) => {
  try {
    const { cliente, texto } = notaSchema.parse(req.body)
    const [nota] = await db('cxc_notas')
      .insert({ cliente_norm: normalizarNombre(cliente), cliente, texto, autor_id: req.user!.id, autor_nombre: req.user!.nombre })
      .returning('*')
    res.json({ ok: true, nota })
  } catch (err) {
    next(err)
  }
})

cxcRouter.delete('/notas/:id', requireRole('cxc'), async (req, res, next) => {
  try {
    const borrados = await db('cxc_notas').where('id', Number(req.params.id)).del()
    res.json({ ok: borrados > 0 })
  } catch (err) {
    next(err)
  }
})

// ── Correo diario de CxC: vista previa (dry-run) y envío manual (solo admin) ──
cxcRouter.get('/diario/preview', requireRole(), async (req, res, next) => {
  try {
    const soloVendedor = typeof req.query.vendedor === 'string' ? req.query.vendedor : undefined
    res.json(await enviarCxcDiario({ soloVendedor, dryRun: true }))
  } catch (err) {
    next(err)
  }
})

cxcRouter.post('/diario/enviar', requireRole(), async (req, res, next) => {
  try {
    const soloVendedor = typeof req.body?.vendedor === 'string' ? req.body.vendedor : undefined
    res.json(await enviarCxcDiario({ soloVendedor }))
  } catch (err) {
    next(err)
  }
})

// ── Mapeo vendedor → correo del CxC diario (solo admin) ──────────────────────
// Lista los vendedores que aparecen en la cartera y a qué correo se les manda
// su reporte (override manual; si no, cae al email del usuario del sistema).
cxcRouter.get('/diario/vendedores', requireRole(), async (_req, res, next) => {
  try {
    const [ventas, overrides, usuarios] = await Promise.all([
      db('pp_cxc').whereNotNull('vendedor').groupBy('vendedor').select('vendedor').count('* as docs').sum('saldo as saldo'),
      db('cxc_vendedor_correo'),
      db('users').whereIn('rol', ['vendedor', 'cxc']).andWhere('activo', true).select('nombre', 'email'),
    ])
    const overrideDe = new Map(overrides.map((o: any) => [o.vendedor_norm, o]))
    const usuarioDe = new Map(usuarios.map((u: any) => [normalizarNombre(u.nombre), u.email]))
    const vendedores = (ventas as any[])
      .map((v) => {
        const norm = normalizarNombre(v.vendedor)
        const ov = overrideDe.get(norm)
        const fallback = usuarioDe.get(norm) ?? null
        return {
          vendedor: v.vendedor,
          vendedorNorm: norm,
          docs: Number(v.docs),
          saldo: Number(v.saldo ?? 0),
          correo: ov?.correo ?? null,
          cc: ov?.cc ?? null,
          activo: ov ? Boolean(ov.activo) : true,
          correoResuelto: ov?.correo ?? fallback,
          fuente: ov?.correo ? 'manual' : fallback ? 'usuario' : 'sin correo',
        }
      })
      .sort((a, b) => b.saldo - a.saldo)
    res.json({ vendedores })
  } catch (err) {
    next(err)
  }
})

cxcRouter.put('/diario/vendedores', requireRole(), async (req, res, next) => {
  try {
    const d = z
      .object({
        vendedor: z.string().trim().min(1),
        correo: z.string().trim().email('Correo inválido').or(z.literal('')),
        cc: z.string().trim().max(300).optional().default(''),
        activo: z.boolean().optional().default(true),
      })
      .parse(req.body)
    const norm = normalizarNombre(d.vendedor)
    if (!d.correo) {
      // Sin correo → quitar el override (vuelve al fallback por usuario)
      await db('cxc_vendedor_correo').where('vendedor_norm', norm).del()
      res.json({ ok: true, removed: true })
      return
    }
    await db('cxc_vendedor_correo')
      .insert({ vendedor_norm: norm, vendedor: d.vendedor, correo: d.correo, cc: d.cc || null, activo: d.activo, updated_at: db.fn.now() })
      .onConflict('vendedor_norm')
      .merge(['vendedor', 'correo', 'cc', 'activo', 'updated_at'])
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})
