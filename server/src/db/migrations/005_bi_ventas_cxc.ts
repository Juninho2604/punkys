import type { Knex } from 'knex'

// Fase 4 del plan maestro: BI de ventas + Cuentas por Cobrar reales, por el
// mismo puente de datos. Snapshots que se reemplazan por completo en cada sync.

export async function up(db: Knex): Promise<void> {
  // Cuentas por Cobrar a nivel de documento (una fila por factura pendiente)
  await db.schema.createTable('pp_cxc', (t) => {
    t.increments('id').primary()
    t.text('cliente_norm').notNullable().index() // nombre normalizado (clave de cruce)
    t.text('cliente').notNullable()
    t.text('vendedor')
    t.text('documento')
    t.text('tipo_doc')
    t.date('fecha_emision')
    t.date('fecha_venc')
    t.decimal('total', 16, 2).notNullable().defaultTo(0)
    t.decimal('saldo', 16, 2).notNullable().defaultTo(0)
    t.integer('dias_vencido').notNullable().defaultTo(0)
    t.text('moneda').notNullable().defaultTo('USD')
  })

  // Ventas agregadas por mes × vendedor × categoría (el detalle se agrega en la PC)
  await db.schema.createTable('pp_ventas', (t) => {
    t.increments('id').primary()
    t.text('mes').notNullable().index() // 'YYYY-MM'
    t.text('vendedor')
    t.text('categoria')
    t.decimal('unidades', 16, 2).notNullable().defaultTo(0)
    t.decimal('monto_usd', 16, 2).notNullable().defaultTo(0)
    t.decimal('margen_usd', 16, 2) // NULL si no hay costo; solo se muestra a admin
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('pp_ventas')
  await db.schema.dropTableIfExists('pp_cxc')
}
