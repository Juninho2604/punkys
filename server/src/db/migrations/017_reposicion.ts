import type { Knex } from 'knex'

// Fase D — Reposición / Compras.
// Adaptación del motor de forecast del sistema "Plan de Compras" del cliente
// (hoy en Python sobre exports de Profit) a un servicio nativo de la intranet.
//
// pp_ventas_sku: historia de demanda POR SKU y por semana, materializada desde
// la réplica de Profit (safacturaventareng). Es el insumo del pronóstico; hoy
// pp_ventas solo guarda agregados mensuales por categoría, sin el SKU.

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('pp_ventas_sku', (t) => {
    t.text('codigo').notNullable() // co_art
    t.text('nombre')
    t.date('semana').notNullable() // lunes de la semana ISO
    t.decimal('unidades', 16, 2).notNullable().defaultTo(0)
    t.decimal('monto', 16, 2).notNullable().defaultTo(0) // Bs
    t.primary(['codigo', 'semana'])
    t.index('codigo')
  })

  // Parámetros del cálculo de reposición (fila única, editable por el admin).
  await db.schema.createTable('reposicion_config', (t) => {
    t.increments('id').primary()
    t.integer('cobertura_objetivo_sem').notNullable().defaultTo(12) // meta de cobertura por pedido
    t.integer('lead_total_sem').notNullable().defaultTo(14) // producción + tránsito (semanas)
    t.integer('semanas_analisis').notNullable().defaultTo(26) // ventana de historia para el promedio
    t.integer('nivel_servicio_pct').notNullable().defaultTo(95) // para el stock de seguridad
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })
  await db('reposicion_config').insert({})
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('reposicion_config')
  await db.schema.dropTableIfExists('pp_ventas_sku')
}
