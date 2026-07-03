import type { Knex } from 'knex'

// Numeración correlativa (COT-0459, ENV-2481) atómica vía UPDATE … RETURNING.
export async function nextNumber(trx: Knex, nombre: 'quote' | 'shipment', prefijo: string, pad = 4): Promise<string> {
  const [row] = await trx('counters')
    .where({ nombre })
    .increment('valor', 1)
    .returning<{ valor: number }[]>('valor')
  if (!row) throw new Error(`Contador no inicializado: ${nombre}`)
  return `${prefijo}-${String(row.valor).padStart(pad, '0')}`
}
