import type { Knex } from 'knex'

// La cotización pasa de modelo transporte (peso × tarifa) a renglones de
// productos con precios del inventario (Profit Plus). Los campos del modelo
// viejo se vuelven opcionales para no romper cotizaciones históricas.

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('quote_items', (t) => {
    t.increments('id').primary()
    t.integer('quote_id').notNullable().references('quotes.id').onDelete('CASCADE')
    t.text('codigo').notNullable()
    t.text('nombre').notNullable()
    t.decimal('precio_unit', 14, 2).notNullable()
    t.integer('cantidad').notNullable()
    t.decimal('total', 14, 2).notNullable()
  })

  await db.schema.alterTable('quotes', (t) => {
    t.decimal('peso_kg', 12, 2).nullable().alter()
    t.decimal('volumen_m3', 12, 2).nullable().alter()
    t.integer('bultos').nullable().alter()
    t.decimal('valor_declarado', 14, 2).nullable().alter()
    t.text('servicio').nullable().alter()
    t.decimal('flete_base', 14, 2).nullable().alter()
    t.decimal('cargo_peso', 14, 2).nullable().alter()
    t.decimal('seguro', 14, 2).nullable().alter()
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('quote_items')
}
