import bcrypt from 'bcryptjs'
import { db } from './knex.js'
import { MILESTONES, estadoFromDone } from '../services/workflow.js'
import { calcularDesglose, type ServicioId } from '../services/pricing.js'

// Seed de desarrollo/demo: limpia y repuebla la base de datos.
// Usuarios (contraseña para todos: punky123):
//   admin@punkypartners.com    → Owner (ve todo)
//   ventas@punkypartners.com   → Vendedor (cotiza)
//   cxc@punkypartners.com      → Cuentas por Cobrar (aprueba/rechaza)
//   despacho@punkypartners.com → Despacho (gestiona envíos)

const PASSWORD = 'punky123'

const hace = (dias: number, horas = 0) => new Date(Date.now() - (dias * 24 + horas) * 60 * 60 * 1000)

async function main() {
  await db('notification_log').del()
  await db('shipment_docs').del()
  await db('shipment_milestones').del()
  await db('shipments').del()
  await db('quotes').del()
  await db('counters').del()
  await db('clients').del()
  await db('users').del()

  const hash = await bcrypt.hash(PASSWORD, 10)
  const usersRows = await db('users')
    .insert([
      { nombre: 'José Punky', email: 'admin@punkypartners.com', password_hash: hash, rol: 'admin', telefono: '+584121000001' },
      { nombre: 'María Salas', email: 'ventas@punkypartners.com', password_hash: hash, rol: 'vendedor', telefono: '+584121000002' },
      { nombre: 'Carla Rivas', email: 'cxc@punkypartners.com', password_hash: hash, rol: 'cxc', telefono: '+584121000003' },
      { nombre: 'Luis Mora', email: 'despacho@punkypartners.com', password_hash: hash, rol: 'despacho', telefono: '+584121000004' },
    ])
    .returning('*')
  const vendedor = usersRows.find((u) => u.rol === 'vendedor')!
  const cxc = usersRows.find((u) => u.rol === 'cxc')!

  const clientsRows = await db('clients')
    .insert([
      { razon_social: 'Agropecuaria La Estrella C.A.', rif: 'J-30125478-9', telefono: '0412-555.01.22', contacto: 'Pedro Marcano', email: 'compras@laestrella.com.ve', whatsapp: '+584125550122' },
      { razon_social: 'Clínica Veterinaria Altamira', rif: 'J-29884512-3', telefono: '0414-889.44.10', contacto: 'Dra. Elena Torres', email: 'admin@vetaltamira.com', whatsapp: '+584148894410' },
      { razon_social: 'Mascotas del Este C.A.', rif: 'J-31447890-1', telefono: '0424-771.20.35', contacto: 'Roberto Fuenmayor', email: 'roberto@mascotasdeleste.com', whatsapp: '+584247712035' },
      { razon_social: 'Distribuidora Canina Zulia', rif: 'J-30778123-5', telefono: '0416-620.88.71', contacto: 'Ana Bracho', email: 'ventas@caninazulia.com', whatsapp: '+584166208871' },
      { razon_social: 'Pet Shop Guacara', rif: 'J-29556234-7', telefono: '0412-330.65.49', contacto: 'Miguel Herrera', email: 'petshopguacara@gmail.com', whatsapp: '+584123306549' },
    ])
    .returning('*')
  const cliente = (i: number) => clientsRows[i]

  await db('counters').insert([
    { nombre: 'quote', valor: 458 }, // próxima: COT-0459
    { nombre: 'shipment', valor: 2485 }, // próximo: ENV-2486
  ])

  // ── Cotizaciones ───────────────────────────────────────────────────────────
  interface QSeed {
    numero: string
    clientIdx: number
    origen: string
    destinoCiudad: string
    destinoDireccion: string
    pesoKg: number
    volumenM3: number
    bultos: number
    valorDeclarado: number
    servicio: ServicioId
    estado: 'pendiente' | 'aprobada' | 'rechazada'
    creada: Date
    motivo?: string
  }

  const quotesSeed: QSeed[] = [
    { numero: 'COT-0452', clientIdx: 0, origen: 'CDN Boleíta — Caracas', destinoCiudad: 'Maracay', destinoDireccion: 'Av. Bolívar Este, Galpón 12', pesoKg: 320, volumenM3: 2.4, bultos: 18, valorDeclarado: 45000, servicio: 'terrestre', estado: 'aprobada', creada: hace(9) },
    { numero: 'COT-0453', clientIdx: 1, origen: 'Almacén Valencia', destinoCiudad: 'Caracas', destinoDireccion: 'Av. San Juan Bosco, Altamira, Torre Clínica PB', pesoKg: 45, volumenM3: 0.6, bultos: 5, valorDeclarado: 18000, servicio: 'frio', estado: 'aprobada', creada: hace(7) },
    { numero: 'COT-0454', clientIdx: 3, origen: 'Almacén Barquisimeto', destinoCiudad: 'Maracaibo', destinoDireccion: 'Zona Industrial Sur, Calle 149', pesoKg: 510, volumenM3: 4.1, bultos: 32, valorDeclarado: 82000, servicio: 'terrestre', estado: 'aprobada', creada: hace(6) },
    { numero: 'COT-0455', clientIdx: 4, origen: 'Almacén Valencia', destinoCiudad: 'Guacara', destinoDireccion: 'C.C. Guacara Plaza, Local 34', pesoKg: 120, volumenM3: 1.1, bultos: 9, valorDeclarado: 22000, servicio: 'express', estado: 'aprobada', creada: hace(4) },
    { numero: 'COT-0450', clientIdx: 2, origen: 'CDN Boleíta — Caracas', destinoCiudad: 'Barcelona', destinoDireccion: 'Av. Intercomunal, C.C. Plaza Mayor, Nivel 2', pesoKg: 260, volumenM3: 2.0, bultos: 15, valorDeclarado: 38000, servicio: 'terrestre', estado: 'aprobada', creada: hace(12) },
    { numero: 'COT-0456', clientIdx: 2, origen: 'CDN Boleíta — Caracas', destinoCiudad: 'Puerto La Cruz', destinoDireccion: 'Av. Municipal, Edif. Costa Azul, PB', pesoKg: 180, volumenM3: 1.5, bultos: 12, valorDeclarado: 30000, servicio: 'terrestre', estado: 'pendiente', creada: hace(2) },
    { numero: 'COT-0457', clientIdx: 1, origen: 'Almacén Valencia', destinoCiudad: 'Caracas', destinoDireccion: 'Av. San Juan Bosco, Altamira, Torre Clínica PB', pesoKg: 28, volumenM3: 0.4, bultos: 3, valorDeclarado: 12500, servicio: 'frio', estado: 'pendiente', creada: hace(1) },
    { numero: 'COT-0458', clientIdx: 0, origen: 'Almacén Barquisimeto', destinoCiudad: 'Valencia', destinoDireccion: 'Zona Industrial Municipal Norte, Galpón 7', pesoKg: 95, volumenM3: 0.9, bultos: 7, valorDeclarado: 15800, servicio: 'especial', estado: 'pendiente', creada: hace(0, 5) },
    { numero: 'COT-0451', clientIdx: 4, origen: 'CDN Boleíta — Caracas', destinoCiudad: 'San Cristóbal', destinoDireccion: 'Av. Libertador, Local 8', pesoKg: 400, volumenM3: 3.2, bultos: 25, valorDeclarado: 60000, servicio: 'terrestre', estado: 'rechazada', creada: hace(10), motivo: 'Cliente con facturas vencidas por conciliar' },
  ]

  const quoteIds: Record<string, number> = {}
  for (const q of quotesSeed) {
    const c = cliente(q.clientIdx)
    const d = calcularDesglose(q.servicio, q.pesoKg, q.valorDeclarado)
    const decidida = q.estado !== 'pendiente'
    const [row] = await db('quotes')
      .insert({
        numero: q.numero,
        client_id: c.id,
        razon_social: c.razon_social,
        rif: c.rif,
        telefono: c.telefono,
        contacto: c.contacto,
        origen: q.origen,
        destino_ciudad: q.destinoCiudad,
        destino_direccion: q.destinoDireccion,
        peso_kg: q.pesoKg,
        volumen_m3: q.volumenM3,
        bultos: q.bultos,
        valor_declarado: q.valorDeclarado,
        servicio: q.servicio,
        flete_base: d.fleteBase,
        cargo_peso: d.cargoPeso,
        seguro: d.seguro,
        subtotal: d.subtotal,
        iva: d.iva,
        total: d.total,
        estado: q.estado,
        created_by: vendedor.id,
        decided_by: decidida ? cxc.id : null,
        decided_at: decidida ? hace(0, 20) : null,
        motivo_rechazo: q.motivo ?? null,
        pp_sync_status: 'simulado',
        pp_external_ref: `PP-SIM-${q.numero}`,
        created_at: q.creada,
        updated_at: q.creada,
      })
      .returning('id')
    quoteIds[q.numero] = row.id
  }

  // ── Envíos (5 registros demo) ─────────────────────────────────────────────
  interface SSeed {
    numero: string
    quote: string
    clientIdx: number
    transportista: string
    placa: string
    eta: string
    done: number
    incidencia?: boolean
    creada: Date
  }

  const shipmentsSeed: SSeed[] = [
    { numero: 'ENV-2481', quote: 'COT-0450', clientIdx: 2, transportista: 'Transporte Andino C.A.', placa: 'A83KD2M', eta: 'Entregado', done: 5, creada: hace(11) },
    { numero: 'ENV-2482', quote: 'COT-0452', clientIdx: 0, transportista: 'Logística Miranda', placa: 'B22XN8P', eta: hoyMas(1), done: 3, creada: hace(8) },
    { numero: 'ENV-2483', quote: 'COT-0453', clientIdx: 1, transportista: 'FríoExpress C.A.', placa: 'C51QW4T', eta: hoyMas(0), done: 4, creada: hace(6) },
    { numero: 'ENV-2484', quote: 'COT-0454', clientIdx: 3, transportista: 'Transporte Zuliano', placa: 'D77RT1K', eta: hoyMas(2), done: 2, incidencia: true, creada: hace(5) },
    { numero: 'ENV-2485', quote: 'COT-0455', clientIdx: 4, transportista: 'Por asignar', placa: '', eta: hoyMas(1), done: 1, creada: hace(3) },
  ]

  for (const s of shipmentsSeed) {
    const c = cliente(s.clientIdx)
    const q = quotesSeed.find((x) => x.numero === s.quote)!
    const [row] = await db('shipments')
      .insert({
        numero: s.numero,
        quote_id: quoteIds[s.quote],
        cliente: c.razon_social,
        origen: q.origen,
        destino_ciudad: q.destinoCiudad,
        destino_direccion: q.destinoDireccion,
        transportista: s.transportista,
        placa: s.placa,
        carga: `${q.bultos} bultos · ${q.pesoKg.toLocaleString('es-VE')} kg · ${q.volumenM3.toLocaleString('es-VE')} m³`,
        estado: estadoFromDone(s.done, Boolean(s.incidencia)),
        eta: s.eta,
        done: s.done,
        incidencia: Boolean(s.incidencia),
        contacto_whatsapp: c.whatsapp,
        contacto_email: c.email,
        created_at: s.creada,
        updated_at: s.creada,
      })
      .returning('id')

    await db('shipment_milestones').insert(
      MILESTONES.map((titulo, idx) => ({
        shipment_id: row.id,
        idx,
        titulo,
        at: idx < s.done ? new Date(s.creada.getTime() + idx * 14 * 60 * 60 * 1000) : null,
      })),
    )
    await db('shipment_docs').insert([
      { shipment_id: row.id, nombre: `Orden de despacho ${s.numero}.pdf`, tamano: '96 KB' },
      { shipment_id: row.id, nombre: `Cotización ${s.quote}.pdf`, tamano: '128 KB' },
      { shipment_id: row.id, nombre: 'Guía de transporte.pdf', tamano: '210 KB' },
    ])
  }

  console.log('✅ Seed completado.')
  console.log('   Usuarios (contraseña: punky123):')
  for (const u of usersRows) console.log(`   - ${u.email} (${u.rol})`)
  await db.destroy()
}

function hoyMas(dias: number): string {
  return new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
