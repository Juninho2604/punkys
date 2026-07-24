import type { Knex } from 'knex'

// Módulo utilitario: control de líneas telefónicas (de su Sheet "Control de
// líneas telefónicas" — ~17 líneas por departamento con plan y fecha de corte).
// Se trae al sistema para paridad con lo que ella ya tiene.

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('lineas_telefonicas', (t) => {
    t.increments('id').primary()
    t.text('numero').notNullable()
    t.text('operadora') // Digitel | Movistar | Movilnet…
    t.text('departamento') // Ventas, Logística, Administración…
    t.text('asignado_a') // persona o cargo que la usa
    t.text('plan') // descripción del plan
    t.decimal('monto', 14, 2) // costo del plan
    t.text('moneda').notNullable().defaultTo('USD')
    t.date('fecha_corte') // día de corte/recarga del plan
    t.boolean('activo').notNullable().defaultTo(true)
    t.text('nota')
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now())
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('lineas_telefonicas')
}
