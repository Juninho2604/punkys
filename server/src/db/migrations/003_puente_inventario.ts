import type { Knex } from 'knex'

// Fase 1 del plan maestro: el inventario real llega desde el pipeline del
// cliente (extractores de Profit) a estas tablas; el conector 'pipeline'
// las usa como fuente de productos/precios/stock para cotizar.

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('pp_products', (t) => {
    t.text('codigo').primary() // co_art de Profit
    t.text('nombre').notNullable()
    t.decimal('precio', 14, 2).notNullable()
    t.text('moneda').notNullable().defaultTo('USD')
    t.jsonb('stock').notNullable().defaultTo('{}') // { "Almacén Boleíta": 46, ... }
    t.boolean('activo').notNullable().defaultTo(true)
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })

  await db.schema.createTable('sync_log', (t) => {
    t.increments('id').primary()
    t.text('dataset').notNullable() // productos | (futuro: cxc, ventas, clientes)
    t.text('fuente') // ej: "PC oficina · catalogo-activo.json"
    t.integer('registros').notNullable()
    t.integer('desactivados').notNullable().defaultTo(0)
    t.text('detalle')
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now())
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('sync_log')
  await db.schema.dropTableIfExists('pp_products')
}
