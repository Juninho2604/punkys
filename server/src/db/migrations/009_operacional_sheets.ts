import type { Knex } from 'knex'

// Ola 1 de la migración desde la intranet-Sheets del cliente: espejo de solo
// lectura de los CATÁLOGOS de configuración (Google Sheets "Punky -
// Configuración"). El Sheet sigue siendo la fuente; aquí se clona cada N min.
// Tablas pequeñas → se reemplazan completas en cada sync (op_* = operacional).

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('op_productos', (t) => {
    t.text('codigo').primary()
    t.text('nombre').notNullable()
    t.text('marca')
    t.text('categoria')
    t.text('subcategoria')
    t.boolean('activo').notNullable().defaultTo(true)
    t.boolean('mostrar_inventario').notNullable().defaultTo(true)
    t.boolean('mostrar_ventas').notNullable().defaultTo(true)
    t.boolean('mostrar_vendedores').notNullable().defaultTo(true)
    t.integer('orden').notNullable().defaultTo(0)
    t.boolean('foco_mes').notNullable().defaultTo(false)
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })

  await db.schema.createTable('op_almacenes', (t) => {
    t.text('codigo').primary()
    t.text('nombre').notNullable()
    t.boolean('activo').notNullable().defaultTo(true)
    t.boolean('mostrar_admin').notNullable().defaultTo(true)
    t.boolean('mostrar_vendedor').notNullable().defaultTo(true)
    t.boolean('mostrar_inventario').notNullable().defaultTo(true)
    t.integer('orden').notNullable().defaultTo(0)
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })

  await db.schema.createTable('op_categorias', (t) => {
    t.text('categoria').primary()
    t.text('subcategoria')
    t.text('marca')
    t.boolean('activo').notNullable().defaultTo(true)
    t.boolean('mostrar_dashboard').notNullable().defaultTo(true)
    t.integer('orden').notNullable().defaultTo(0)
    t.timestamp('updated_at').notNullable().defaultTo(db.fn.now())
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('op_productos')
  await db.schema.dropTableIfExists('op_almacenes')
  await db.schema.dropTableIfExists('op_categorias')
}
