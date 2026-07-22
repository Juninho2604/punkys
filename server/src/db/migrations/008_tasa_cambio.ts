import type { Knex } from 'knex'

// Tasa de cambio oficial (BCV) para mostrar el equivalente en USD de los montos
// que vienen de Profit en Bolívares. Se guarda un histórico (una fila por
// obtención) y la intranet usa siempre la más reciente. Fuente configurable
// (API del BCV / dolarapi); si la red falla, se conserva la última buena.

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('tasa_cambio', (t) => {
    t.increments('id').primary()
    t.text('fuente').notNullable() // 'bcv-api' | 'manual' | 'fallback'
    t.decimal('valor', 16, 4).notNullable() // Bs por 1 USD
    t.date('fecha').notNullable() // fecha de vigencia declarada por la fuente
    t.timestamp('obtenida_at').notNullable().defaultTo(db.fn.now())
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('tasa_cambio')
}
