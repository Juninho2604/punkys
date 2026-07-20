import type { Knex } from 'knex'

// Fase 6 (Consultas Profit · lado del gasto): compras por documento y Cuentas
// por Pagar a proveedores, por el mismo puente de datos. Con esto el dueño ve
// las dos caras del negocio: lo que entra (ventas/cobranzas/CxC) y lo que sale
// (compras/CxP). Snapshots que se reemplazan por completo en cada sync.

export async function up(db: Knex): Promise<void> {
  // Compras a nivel de documento (una fila por factura de compra)
  await db.schema.createTable('pp_compras', (t) => {
    t.increments('id').primary()
    t.date('fecha').notNullable().index()
    t.text('documento')
    t.text('proveedor').notNullable()
    t.text('categoria')
    t.decimal('monto_usd', 16, 2).notNullable().defaultTo(0)
    t.text('moneda').notNullable().defaultTo('USD')
  })

  // Cuentas por Pagar a nivel de documento (espejo de pp_cxc, lado proveedor)
  await db.schema.createTable('pp_cxp', (t) => {
    t.increments('id').primary()
    t.text('proveedor').notNullable().index()
    t.text('documento')
    t.text('tipo_doc')
    t.date('fecha_emision')
    t.date('fecha_venc')
    t.decimal('total', 16, 2).notNullable().defaultTo(0)
    t.decimal('saldo', 16, 2).notNullable().defaultTo(0)
    t.integer('dias_vencido').notNullable().defaultTo(0)
    t.text('moneda').notNullable().defaultTo('USD')
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('pp_cxp')
  await db.schema.dropTableIfExists('pp_compras')
}
