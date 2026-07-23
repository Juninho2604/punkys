import type { Knex } from 'knex'

// Fase C — Tesorería / Flujo de Caja.
// Módulo nativo de caja inspirado en el sistema CFO del cliente (que hoy vive
// en un Excel frágil conectado a Profit por Power Query). Se construye con
// tablas propias, editables desde la intranet, y queda LISTO para recibir en el
// futuro el feed automático de bancos/caja de Profit (saMovimientoBanco /
// saMovimientoCaja) por el mismo puente de la réplica.
//
// Decisiones de moneda (coherentes con el resto del sistema):
//   · Cada banco opera en UNA moneda (Bs o USD); sus movimientos van en esa moneda.
//   · Para la posición consolidada y la proyección se calcula el equivalente en
//     la otra moneda usando la tasa (histórica del movimiento si se registra, o
//     la del día). Contablemente el Bs manda; el USD es referencia.

export async function up(db: Knex): Promise<void> {
  // Cuentas bancarias / cajas de la empresa
  await db.schema.createTable('bancos', (t) => {
    t.increments('id').primary()
    t.text('nombre').notNullable()
    t.text('moneda').notNullable().defaultTo('Bs') // 'Bs' | 'USD'
    t.text('numero') // últimos dígitos / identificador visible (opcional)
    t.boolean('activo').notNullable().defaultTo(true)
    t.integer('orden').notNullable().defaultTo(0)
    t.timestamp('created_at').defaultTo(db.fn.now())
  })

  // Movimientos de tesorería (ingresos / egresos de banco o caja)
  await db.schema.createTable('mov_tesoreria', (t) => {
    t.increments('id').primary()
    t.integer('banco_id').notNullable().references('id').inTable('bancos').onDelete('CASCADE')
    t.date('fecha').notNullable()
    t.text('tipo').notNullable() // 'ingreso' | 'egreso'
    t.decimal('monto', 16, 2).notNullable().defaultTo(0) // en la moneda del banco
    t.text('moneda').notNullable().defaultTo('Bs')
    t.decimal('tasa', 16, 4) // tasa Bs/USD del día del movimiento (opcional)
    t.text('concepto').notNullable()
    t.text('categoria') // clasificación libre (nómina, proveedores, servicios…)
    t.text('referencia') // nº de operación / documento
    t.boolean('conciliado').notNullable().defaultTo(false)
    t.text('origen').notNullable().defaultTo('manual') // 'manual' | 'profit'
    t.integer('created_by').references('id').inTable('users')
    t.timestamp('created_at').defaultTo(db.fn.now())
    t.index(['banco_id', 'fecha'])
  })

  // Compromisos de pago (CxP nativo): Profit 2K12 NO maneja cuentas por pagar,
  // así que la programación de pagos a proveedores vive aquí. Alimenta la
  // proyección de caja como salidas esperadas.
  await db.schema.createTable('compromisos_pago', (t) => {
    t.increments('id').primary()
    t.text('proveedor').notNullable()
    t.text('descripcion')
    t.decimal('monto', 16, 2).notNullable().defaultTo(0)
    t.text('moneda').notNullable().defaultTo('Bs')
    t.decimal('tasa', 16, 4)
    t.date('fecha_venc').notNullable()
    t.text('prioridad').notNullable().defaultTo('media') // 'alta' | 'media' | 'baja'
    t.boolean('pagado').notNullable().defaultTo(false)
    t.timestamp('pagado_at')
    t.integer('created_by').references('id').inTable('users')
    t.timestamp('created_at').defaultTo(db.fn.now())
    t.index(['pagado', 'fecha_venc'])
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('compromisos_pago')
  await db.schema.dropTableIfExists('mov_tesoreria')
  await db.schema.dropTableIfExists('bancos')
}
