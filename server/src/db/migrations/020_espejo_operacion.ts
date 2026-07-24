import type { Knex } from 'knex'

// Espejo (solo lectura) de la operación del cliente que hoy vive en sus Sheets
// "Pedidos Punky" + "Configuración". Tablas `op_*` fieles a su data; se cargan
// desde un snapshot (idempotente por clave natural), sin tocar sus Sheets.

export async function up(db: Knex): Promise<void> {
  // Pedidos (une "Pedidos ACTIVOS" + "Históricos/Entregados")
  await db.schema.createTable('op_pedidos', (t) => {
    t.text('numero').primary() // # Pedido
    t.date('fecha_pedido')
    t.date('fecha_despacho')
    t.text('cliente')
    t.text('cod_cliente')
    t.text('rif')
    t.text('vendedor')
    t.text('observaciones')
    t.text('cond_pago')
    t.text('productos') // texto original "24 x … | 24 x …"
    t.decimal('monto_usd', 16, 2)
    t.text('almacen')
    t.text('lista_precios')
    t.text('estado')
    t.text('nro_nota')
    t.text('nro_factura')
    t.date('fecha_recibido')
    t.date('fecha_cxc')
    t.date('fecha_aprobado_cxc')
    t.date('fecha_logistica')
    t.date('fecha_entregado')
    t.date('fecha_en_ruta')
    t.text('origen') // 'activo' | 'archivo'
  })

  // Renglones parseados de la columna "Productos"
  await db.schema.createTable('op_pedido_reng', (t) => {
    t.increments('id').primary()
    t.text('pedido_numero').notNullable().index()
    t.decimal('cantidad', 14, 2)
    t.text('descripcion')
  })

  // Auditoría de cambios de estado
  await db.schema.createTable('op_pedido_estados', (t) => {
    t.increments('id').primary()
    t.text('ts') // timestamp original (texto tal cual)
    t.text('pedido_numero').index()
    t.text('cliente')
    t.text('vendedor')
    t.text('estado_anterior')
    t.text('estado_nuevo')
    t.text('usuario')
  })

  // Logística / despacho (29 columnas de su hoja)
  await db.schema.createTable('op_logistica', (t) => {
    t.increments('id').primary()
    t.text('pedido_numero').index()
    t.text('nro_factura')
    t.text('estado_despacho')
    t.text('mes')
    t.text('semana')
    t.text('cliente')
    t.text('vendedor')
    t.text('almacen')
    t.text('destino')
    t.text('ciudad_destino')
    t.date('promesa_entrega')
    t.date('compromiso_logistica')
    t.date('fecha_pedido')
    t.date('fecha_entregado')
    t.text('dias_para_entregar')
    t.text('devolucion')
    t.text('transporte')
    t.text('tipo_transporte')
    t.decimal('unidades_fable', 14, 2)
    t.decimal('unidades_pp', 14, 2)
    t.decimal('kilos', 14, 2)
    t.decimal('monto_fable', 16, 2)
    t.decimal('monto_pp', 16, 2)
    t.decimal('monto_total', 16, 2)
    t.text('observaciones')
    t.text('incidencia_detalle')
    t.text('comentario_logistica')
    t.text('ruta')
  })

  // Fletes por semana/transportista
  await db.schema.createTable('op_fletes', (t) => {
    t.increments('id').primary()
    t.text('semana')
    t.text('transportista')
    t.decimal('costo_usd', 14, 2)
    t.text('notas')
  })

  // Contactos (vendedores + mercaderistas → nombre/correo)
  await db.schema.createTable('op_contactos', (t) => {
    t.increments('id').primary()
    t.text('nombre').notNullable()
    t.text('correo')
    t.text('tipo') // 'vendedor' | 'mercaderista'
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('op_contactos')
  await db.schema.dropTableIfExists('op_fletes')
  await db.schema.dropTableIfExists('op_logistica')
  await db.schema.dropTableIfExists('op_pedido_estados')
  await db.schema.dropTableIfExists('op_pedido_reng')
  await db.schema.dropTableIfExists('op_pedidos')
}
