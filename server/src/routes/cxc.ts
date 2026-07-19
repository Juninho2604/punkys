import { Router } from 'express'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

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
      .sum({ vencido: db.raw('case when dias_vencido > 0 then saldo else 0 end') })
      .count({ documentos: '*' })
      .max({ peorDiasVencido: 'dias_vencido' })
      .orderBy('vencido', 'desc')

    const [tot] = await db('pp_cxc')
      .sum({ saldo: 'saldo' })
      .sum({ vencido: db.raw('case when dias_vencido > 0 then saldo else 0 end') })

    const ultimo = await db('sync_log').where('dataset', 'cxc').orderBy('created_at', 'desc').first()

    res.json({
      clientes: rows.map((r: any) => ({
        cliente: r.cliente,
        moneda: r.moneda,
        saldo: Number(r.saldo ?? 0),
        vencido: Number(r.vencido ?? 0),
        documentos: Number(r.documentos ?? 0),
        peorDiasVencido: Number(r.peorDiasVencido ?? 0),
      })),
      totales: { saldo: Number(tot?.saldo ?? 0), vencido: Number(tot?.vencido ?? 0) },
      actualizado: ultimo?.created_at ?? null,
    })
  } catch (err) {
    next(err)
  }
})
