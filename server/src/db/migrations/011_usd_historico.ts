import type { Knex } from 'knex'

// USD histórico: el equivalente en dólares de cada documento se calcula con la
// tasa CON QUE SE FACTURÓ (Profit la guarda por documento), no con la tasa de
// hoy. Así una venta de hace 27 días conserva su valor real en USD. El
// materializador llena estas columnas; las vistas suman/muestran el USD real.
// La tasa BCV de hoy queda solo como referencia informativa.

export async function up(db: Knex): Promise<void> {
  await db.schema.alterTable('pp_cxc', (t) => {
    t.decimal('saldo_usd', 16, 2)
    t.decimal('total_usd', 16, 2)
  })
  await db.schema.alterTable('pp_cxp', (t) => {
    t.decimal('saldo_usd', 16, 2)
    t.decimal('total_usd', 16, 2)
  })
  await db.schema.alterTable('pp_compras', (t) => {
    t.decimal('monto_usd_real', 16, 2)
  })
  await db.schema.alterTable('pp_ventas', (t) => {
    t.decimal('monto_usd_real', 16, 2)
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.alterTable('pp_cxc', (t) => { t.dropColumn('saldo_usd'); t.dropColumn('total_usd') })
  await db.schema.alterTable('pp_cxp', (t) => { t.dropColumn('saldo_usd'); t.dropColumn('total_usd') })
  await db.schema.alterTable('pp_compras', (t) => t.dropColumn('monto_usd_real'))
  await db.schema.alterTable('pp_ventas', (t) => t.dropColumn('monto_usd_real'))
}
