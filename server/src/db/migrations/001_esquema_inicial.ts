import type { Knex } from 'knex'

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('users', (t) => {
    t.increments('id').primary()
    t.text('nombre').notNullable()
    t.text('email').notNullable().unique()
    t.text('password_hash').notNullable()
    t.text('rol').notNullable() // vendedor | cxc | despacho | admin
    t.text('telefono')
    t.boolean('activo').notNullable().defaultTo(true)
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now())
  })

  await db.schema.createTable('clients', (t) => {
    t.increments('id').primary()
    t.text('razon_social').notNullable()
    t.text('rif').notNullable().unique()
    t.text('telefono')
    t.text('contacto')
    t.text('email')
    t.text('whatsapp')
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now())
  })

  await db.schema.createTable('counters', (t) => {
    t.text('nombre').primary()
    t.integer('valor').notNullable()
  })

  await db.schema.createTable('quotes', (t) => {
    t.increments('id').primary()
    t.text('numero').notNullable().unique() // COT-0459
    t.integer('client_id').references('clients.id').onDelete('SET NULL')
    // Snapshot del cliente al momento de cotizar
    t.text('razon_social').notNullable()
    t.text('rif').notNullable()
    t.text('telefono')
    t.text('contacto')
    // Ruta
    t.text('origen').notNullable()
    t.text('destino_ciudad').notNullable()
    t.text('destino_direccion').notNullable()
    // Carga
    t.decimal('peso_kg', 12, 2).notNullable()
    t.decimal('volumen_m3', 12, 2).notNullable().defaultTo(0)
    t.integer('bultos').notNullable().defaultTo(1)
    t.decimal('valor_declarado', 14, 2).notNullable().defaultTo(0)
    t.text('servicio').notNullable() // terrestre | express | frio | especial
    // Desglose de precios (calculado en el servidor)
    t.decimal('flete_base', 14, 2).notNullable()
    t.decimal('cargo_peso', 14, 2).notNullable()
    t.decimal('seguro', 14, 2).notNullable()
    t.decimal('subtotal', 14, 2).notNullable()
    t.decimal('iva', 14, 2).notNullable()
    t.decimal('total', 14, 2).notNullable()
    // Workflow
    t.text('estado').notNullable().defaultTo('generada') // generada | pendiente | aprobada | rechazada
    t.integer('created_by').notNullable().references('users.id')
    t.integer('decided_by').references('users.id')
    t.timestamp('decided_at')
    t.text('motivo_rechazo')
    // Sincronización con Profit Plus 2K12
    t.text('pp_sync_status').notNullable().defaultTo('pendiente') // pendiente | simulado | sincronizada | error
    t.text('pp_external_ref')
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now())
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })

  await db.schema.createTable('shipments', (t) => {
    t.increments('id').primary()
    t.text('numero').notNullable().unique() // ENV-2481
    t.integer('quote_id').references('quotes.id').onDelete('SET NULL')
    t.text('cliente').notNullable()
    t.text('origen').notNullable()
    t.text('destino_ciudad').notNullable()
    t.text('destino_direccion').notNullable()
    t.text('transportista').notNullable().defaultTo('Por asignar')
    t.text('placa')
    t.text('carga')
    t.text('estado').notNullable().defaultTo('Preparando') // Preparando | En tránsito | En reparto | Entregado | Incidencia
    t.text('eta')
    t.integer('done').notNullable().defaultTo(1) // hitos completados (0–5)
    t.boolean('incidencia').notNullable().defaultTo(false)
    t.text('contacto_whatsapp')
    t.text('contacto_email')
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now())
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })

  await db.schema.createTable('shipment_milestones', (t) => {
    t.increments('id').primary()
    t.integer('shipment_id').notNullable().references('shipments.id').onDelete('CASCADE')
    t.integer('idx').notNullable() // 0–4
    t.text('titulo').notNullable()
    t.timestamp('at') // fecha/hora si está completado
    t.unique(['shipment_id', 'idx'])
  })

  await db.schema.createTable('shipment_docs', (t) => {
    t.increments('id').primary()
    t.integer('shipment_id').notNullable().references('shipments.id').onDelete('CASCADE')
    t.text('nombre').notNullable()
    t.text('tamano')
    t.text('url')
  })

  await db.schema.createTable('notification_log', (t) => {
    t.increments('id').primary()
    t.text('canal').notNullable() // email | whatsapp
    t.text('proveedor').notNullable() // console | smtp | twilio | cloudapi
    t.text('destinatario').notNullable()
    t.text('asunto')
    t.text('cuerpo').notNullable()
    t.text('evento').notNullable() // cotizacion_enviada, cotizacion_aprobada, ...
    t.text('ref') // COT-0459 / ENV-2481
    t.text('estado').notNullable() // simulado | enviado | error
    t.text('error')
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now())
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('notification_log')
  await db.schema.dropTableIfExists('shipment_docs')
  await db.schema.dropTableIfExists('shipment_milestones')
  await db.schema.dropTableIfExists('shipments')
  await db.schema.dropTableIfExists('quotes')
  await db.schema.dropTableIfExists('counters')
  await db.schema.dropTableIfExists('clients')
  await db.schema.dropTableIfExists('users')
}
