import type { Knex } from 'knex'

// Numeración correlativa atómica vía UPDATE … RETURNING.
//  · Con prefijo → "ENV-2481" (envíos).
//  · Sin prefijo (prefijo '') → entero pelado "1190", para continuar la
//    secuencia de pedidos del cliente (sus pedidos se numeran 1, 2, 3…).
export async function nextNumber(trx: Knex, nombre: 'quote' | 'shipment', prefijo: string, pad = 4): Promise<string> {
  const [row] = await trx('counters')
    .where({ nombre })
    .increment('valor', 1)
    .returning<{ valor: number }[]>('valor')
  if (!row) throw new Error(`Contador no inicializado: ${nombre}`)
  if (!prefijo) return String(row.valor)
  return `${prefijo}-${String(row.valor).padStart(pad, '0')}`
}
