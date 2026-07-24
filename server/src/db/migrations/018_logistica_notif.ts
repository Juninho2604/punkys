import type { Knex } from 'knex'

// Copiar-y-mejorar el sistema del cliente (Sheets):
//  · Enriquecemos `shipments` con los campos de logística que su hoja de
//    "Logística/Despacho" captura y nosotros aún no (para paridad 1:1 y mejor).
//  · Config de notificaciones (grupos + tipos) que hoy vive en su Sheet de
//    Configuración, base para activar las notificaciones reales de la intranet.
// Todo aditivo; no cambia lo existente.

export async function up(db: Knex): Promise<void> {
  await db.schema.alterTable('shipments', (t) => {
    t.text('nro_nota') // Nº de nota de entrega (su hoja de Facturación)
    t.text('tipo_transporte') // Moto, Camión, Encomienda…
    t.text('ruta') // agrupación de reparto
    t.text('devolucion') // estado/observación de devolución ("TODO CONFORME"…)
    t.decimal('unidades_fable', 12, 2) // split por línea de producto
    t.decimal('unidades_pp', 12, 2)
    t.decimal('monto_fable', 14, 2)
    t.decimal('monto_pp', 14, 2)
    t.decimal('kilos', 12, 2)
    t.date('promesa_entrega')
    t.date('compromiso_logistica')
    t.text('incidencia_detalle')
    t.text('comentario_logistica')
  })

  // Grupos de correo (grupo → lista de correos) — de la pestaña "Grupos de correo"
  await db.schema.createTable('notif_grupos', (t) => {
    t.increments('id').primary()
    t.text('grupo').notNullable().unique()
    t.text('correos').notNullable() // separados por coma
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })

  // Tipos de notificación (flags + ruteo) — de la pestaña "Tipos de Notificación"
  await db.schema.createTable('notif_tipos', (t) => {
    t.increments('id').primary()
    t.text('clave').notNullable().unique() // stock_critico, pedido_entregado…
    t.text('nombre').notNullable()
    t.boolean('activo').notNullable().defaultTo(true)
    t.text('para') // destinatario principal (correo o referencia)
    t.text('cc') // grupo o correos en copia
    t.text('destino') // descripción legible del ruteo
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('notif_tipos')
  await db.schema.dropTableIfExists('notif_grupos')
  await db.schema.alterTable('shipments', (t) => {
    t.dropColumn('nro_nota')
    t.dropColumn('tipo_transporte')
    t.dropColumn('ruta')
    t.dropColumn('devolucion')
    t.dropColumn('unidades_fable')
    t.dropColumn('unidades_pp')
    t.dropColumn('monto_fable')
    t.dropColumn('monto_pp')
    t.dropColumn('kilos')
    t.dropColumn('promesa_entrega')
    t.dropColumn('compromiso_logistica')
    t.dropColumn('incidencia_detalle')
    t.dropColumn('comentario_logistica')
  })
}
