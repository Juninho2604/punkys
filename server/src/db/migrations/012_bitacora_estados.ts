import type { Knex } from 'knex'

// Bitácora de estados de pedidos/cotizaciones (lo que el cliente tenía como
// "Historial de Estados"): cada transición queda registrada con quién y cuándo.

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('quote_estado_log', (t) => {
    t.increments('id').primary()
    t.integer('quote_id').notNullable().references('quotes.id').onDelete('CASCADE').index()
    t.text('estado_anterior') // null cuando se crea
    t.text('estado_nuevo').notNullable()
    t.integer('usuario_id').references('users.id')
    t.text('usuario_nombre')
    t.text('nota')
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now())
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('quote_estado_log')
}
