import type { Knex } from 'knex'

// Fase 5 del plan maestro: comisiones de vendedores sobre LO COBRADO, cada
// quincena. Las cobranzas llegan por el puente de datos (snapshot completo);
// el % de cada vendedor lo configura solo el admin; al pagar se guarda un
// snapshot inmutable (si luego cambia el % o la ventana del export, el
// histórico de pagos no se altera).

export async function up(db: Knex): Promise<void> {
  // Cobranzas a nivel de documento (una fila por cobro registrado en Profit)
  await db.schema.createTable('pp_cobranzas', (t) => {
    t.increments('id').primary()
    t.date('fecha').notNullable().index()
    t.text('documento')
    t.text('cliente')
    t.text('vendedor_norm').notNullable().index() // clave de cruce (nombre normalizado)
    t.text('vendedor').notNullable()
    t.decimal('monto_usd', 16, 2).notNullable().defaultTo(0)
    t.text('moneda').notNullable().defaultTo('USD')
  })

  // % de comisión por vendedor · SOLO visible/editable por admin
  await db.schema.createTable('comision_config', (t) => {
    t.text('vendedor_norm').primary()
    t.text('vendedor').notNullable()
    t.decimal('pct', 6, 2).notNullable()
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })

  // Quincenas pagadas: snapshot del cálculo al momento de pagar
  await db.schema.createTable('comision_pagos', (t) => {
    t.increments('id').primary()
    t.text('vendedor_norm').notNullable()
    t.text('vendedor').notNullable()
    t.date('periodo_inicio').notNullable()
    t.date('periodo_fin').notNullable()
    t.decimal('base_usd', 16, 2).notNullable()
    t.decimal('pct', 6, 2).notNullable()
    t.decimal('monto_usd', 16, 2).notNullable()
    t.text('referencia') // nº de transferencia / pago móvil (opcional)
    t.integer('pagada_by').references('users.id')
    t.timestamp('pagada_at').notNullable().defaultTo(db.fn.now())
    t.unique(['vendedor_norm', 'periodo_inicio'])
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('comision_pagos')
  await db.schema.dropTableIfExists('comision_config')
  await db.schema.dropTableIfExists('pp_cobranzas')
}
