import type { Knex } from 'knex'

// Costos de envío por despacho (Tesorería): permite ver la rentabilidad real
// de cada despacho = venta del pedido − costos logísticos. Los montos van en Bs
// (moneda contable); el USD se muestra como referencia con la tasa BCV.

export async function up(db: Knex): Promise<void> {
  await db.schema.alterTable('shipments', (t) => {
    t.decimal('costo_flete', 14, 2)
    t.decimal('costo_combustible', 14, 2)
    t.decimal('costo_peaje', 14, 2)
    t.decimal('costo_otros', 14, 2)
    t.text('costo_nota')
    t.timestamp('costos_at')
    t.integer('costos_by').references('users.id')
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.alterTable('shipments', (t) => {
    t.dropColumn('costo_flete')
    t.dropColumn('costo_combustible')
    t.dropColumn('costo_peaje')
    t.dropColumn('costo_otros')
    t.dropColumn('costo_nota')
    t.dropColumn('costos_at')
    t.dropColumn('costos_by')
  })
}
