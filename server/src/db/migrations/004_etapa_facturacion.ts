import type { Knex } from 'knex'

// Fase 3 del plan maestro: etapa de Facturación entre CxC y Despacho
// (el flujo real de la empresa: Recibido → CxC → Facturación → Logística).
// La cotización aprobada pasa a la cola de Facturación; al registrar el
// número de factura (emitida en Profit) se crea la orden de despacho.

export async function up(db: Knex): Promise<void> {
  await db.schema.alterTable('quotes', (t) => {
    t.text('factura_numero')
    t.timestamp('facturada_at')
    t.integer('facturada_by').references('users.id')
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.alterTable('quotes', (t) => {
    t.dropColumn('factura_numero')
    t.dropColumn('facturada_at')
    t.dropColumn('facturada_by')
  })
}
