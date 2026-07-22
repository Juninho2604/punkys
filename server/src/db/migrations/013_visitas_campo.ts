import type { Knex } from 'knex'

// Visitas de campo (mercaderistas / asesores): réplica mejorada de lo que el
// cliente llevaba en su hoja de "Visitas". Cada visita guarda ubicación GPS,
// fotos del anaquel, precios de la competencia y degustaciones.
// Las fotos se guardan en la misma base (bytea) para que entren en el respaldo
// y no dependan de un volumen de disco aparte.

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('visitas', (t) => {
    t.increments('id').primary()
    t.integer('usuario_id').notNullable().references('users.id').index()
    t.integer('cliente_id').references('clients.id') // opcional: puede ser un punto sin cliente en catálogo
    t.text('cliente_nombre').notNullable()
    t.decimal('lat', 10, 7)
    t.decimal('lng', 10, 7)
    t.decimal('gps_precision', 8, 1) // metros de precisión reportados por el teléfono
    t.text('direccion')
    t.text('notas')
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now()).index()
  })

  await db.schema.createTable('visita_fotos', (t) => {
    t.increments('id').primary()
    t.integer('visita_id').notNullable().references('visitas.id').onDelete('CASCADE').index()
    t.specificType('imagen', 'bytea').notNullable()
    t.text('mime').notNullable().defaultTo('image/jpeg')
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now())
  })

  await db.schema.createTable('visita_competencia', (t) => {
    t.increments('id').primary()
    t.integer('visita_id').notNullable().references('visitas.id').onDelete('CASCADE').index()
    t.text('producto').notNullable()
    t.text('competidor')
    t.decimal('precio', 14, 2)
    t.text('moneda').notNullable().defaultTo('Bs')
    t.text('nota')
  })

  await db.schema.createTable('visita_degustaciones', (t) => {
    t.increments('id').primary()
    t.integer('visita_id').notNullable().references('visitas.id').onDelete('CASCADE').index()
    t.text('producto').notNullable()
    t.decimal('unidades', 12, 2)
    t.text('notas')
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('visita_degustaciones')
  await db.schema.dropTableIfExists('visita_competencia')
  await db.schema.dropTableIfExists('visita_fotos')
  await db.schema.dropTableIfExists('visitas')
}
