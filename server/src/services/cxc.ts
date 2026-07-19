import { db } from '../db/knex.js'
import { normalizarNombre } from './normalize.js'

export interface SaldoCliente {
  saldo: number
  vencido: number
  documentos: number
  peorDiasVencido: number
  moneda: string
}

// Saldo por cobrar de un cliente (cruce por nombre normalizado; exacto o nada).
export async function saldoDeClientes(nombres: string[]): Promise<Map<string, SaldoCliente>> {
  const claves = [...new Set(nombres.map(normalizarNombre).filter(Boolean))]
  const mapa = new Map<string, SaldoCliente>()
  if (!claves.length) return mapa

  const rows = await db('pp_cxc')
    .whereIn('cliente_norm', claves)
    .groupBy('cliente_norm', 'moneda')
    .select('cliente_norm', 'moneda')
    .sum({ saldo: 'saldo' })
    .sum({ vencido: db.raw('case when dias_vencido > 0 then saldo else 0 end') })
    .count({ documentos: '*' })
    .max({ peor: 'dias_vencido' })

  for (const r of rows as any[]) {
    mapa.set(r.cliente_norm, {
      saldo: Number(r.saldo ?? 0),
      vencido: Number(r.vencido ?? 0),
      documentos: Number(r.documentos ?? 0),
      peorDiasVencido: Number(r.peor ?? 0),
      moneda: r.moneda ?? 'USD',
    })
  }
  return mapa
}
