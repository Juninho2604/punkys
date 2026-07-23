import type { Knex } from 'knex'

// Registro de respaldos automáticos de la base. El script punky-backup.sh
// (cron en el VPS) hace pg_dump y anota aquí cada corrida, para que la intranet
// pueda mostrar "último respaldo hace X horas" y alertar si se atrasa.

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('backup_log', (t) => {
    t.increments('id').primary()
    t.text('archivo').notNullable()
    t.bigInteger('tamano_bytes')
    t.boolean('ok').notNullable().defaultTo(true)
    t.text('detalle')
    t.timestamp('created_at').notNullable().defaultTo(db.fn.now()).index()
  })
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('backup_log')
}
