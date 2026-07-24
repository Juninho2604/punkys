import type { Knex } from 'knex'

// Los pedidos del cliente (op_pedidos, traídos de sus Sheets) dejan de vivir
// en una página aparte y se vuelven pedidos NATIVOS: fluyen por los módulos
// (Aprobaciones / Facturación / Despacho) según su etapa. Para distinguirlos
// del pedido cargado nativamente y conservar el nombre de su vendedor:
//   · quotes.fuente        → 'nativo' | 'importado'
//   · quotes.vendedor_ext  → nombre del vendedor del cliente (importados)
//   · shipments.fuente     → 'nativo' | 'importado'

export async function up(db: Knex): Promise<void> {
  await db.schema.alterTable('quotes', (t) => {
    t.text('fuente').notNullable().defaultTo('nativo')
    t.text('vendedor_ext')
  })
  await db.schema.alterTable('shipments', (t) => {
    t.text('fuente').notNullable().defaultTo('nativo')
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.alterTable('quotes', (t) => {
    t.dropColumn('fuente')
    t.dropColumn('vendedor_ext')
  })
  await db.schema.alterTable('shipments', (t) => {
    t.dropColumn('fuente')
  })
}
