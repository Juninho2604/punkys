import type { Knex } from 'knex'

// Correo diario de CxC (réplica mejorada de la función estrella del cliente):
//  - cxc_notas: notas de cobranza colaborativas POR CLIENTE (equipo de CxC),
//    que aparecen en el panel y en el correo diario (como su tabla notas_cxc).
//  - cxc_vendedor_correo: a qué correo se le manda el CxC diario de cada
//    vendedor (override manual; si no, se resuelve por el email del usuario).

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('cxc_notas', (t) => {
    t.increments('id').primary()
    t.text('cliente_norm').notNullable().index() // cruce por nombre normalizado
    t.text('cliente').notNullable()
    t.text('texto').notNullable()
    t.integer('autor_id').references('users.id')
    t.text('autor_nombre')
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now())
  })

  await db.schema.createTable('cxc_vendedor_correo', (t) => {
    t.text('vendedor_norm').primary() // nombre de vendedor de Profit, normalizado
    t.text('vendedor').notNullable()
    t.text('correo').notNullable()
    t.text('cc') // copias, separadas por coma (opcional)
    t.boolean('activo').notNullable().defaultTo(true)
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('cxc_vendedor_correo')
  await db.schema.dropTableIfExists('cxc_notas')
}
