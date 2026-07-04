import { db } from './knex.js'

// Limpieza para puesta en marcha real: borra TODOS los datos de negocio
// (cotizaciones, envíos, clientes, bitácora de notificaciones) y reinicia la
// numeración COT/ENV desde cero. CONSERVA los usuarios y sus contraseñas.
//
// Uso (VPS):   docker compose exec server node dist/db/clean.js
// Uso (dev):   npm run clean-data -w server

async function main() {
  const [{ count: quotes }] = await db('quotes').count()
  const [{ count: shipments }] = await db('shipments').count()
  const [{ count: clients }] = await db('clients').count()

  await db('notification_log').del()
  await db('shipment_docs').del()
  await db('shipment_milestones').del()
  await db('shipments').del()
  await db('quotes').del()
  await db('clients').del()

  // Numeración desde cero: la próxima será COT-0001 / ENV-0001
  await db('counters')
    .insert([
      { nombre: 'quote', valor: 0 },
      { nombre: 'shipment', valor: 0 },
    ])
    .onConflict('nombre')
    .merge(['valor'])

  const users = await db('users').select('email', 'rol').orderBy('id')

  console.log('🧹 Datos de demo eliminados:')
  console.log(`   - ${quotes} cotizaciones · ${shipments} envíos · ${clients} clientes`)
  console.log('   - Numeración reiniciada: la próxima cotización será COT-0001')
  console.log('👤 Usuarios conservados (sin cambios):')
  for (const u of users) console.log(`   - ${u.email} (${u.rol})`)
  await db.destroy()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
