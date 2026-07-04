import { db } from '../db/knex.js'
import { HttpError } from '../middleware/errors.js'
import type { AuthUser } from '../middleware/auth.js'
import { IVA_RATE } from './pricing.js'
import { nextNumber } from './counters.js'
import { notifier } from '../notifications/index.js'
import { templates, type QuoteInfo, type ShipmentInfo } from '../notifications/templates.js'
import { profitPlus } from '../integrations/profitplus/index.js'

export const MILESTONES = ['Orden creada', 'Preparando carga', 'Despachado', 'En tránsito', 'Entregado'] as const

export function estadoFromDone(done: number, incidencia: boolean): string {
  if (incidencia) return 'Incidencia'
  if (done >= 5) return 'Entregado'
  if (done === 4) return 'En reparto'
  if (done >= 2) return 'En tránsito'
  return 'Preparando'
}

export interface NuevaCotizacion {
  razonSocial: string
  rif: string
  telefono?: string
  contacto?: string
  origen: string
  destinoCiudad: string
  destinoDireccion: string
  items: { codigo: string; cantidad: number }[]
}

// Resumen legible de los renglones ("3 productos · 14 unidades")
export function resumenItems(items: { cantidad: number }[]): string {
  const unidades = items.reduce((s, i) => s + i.cantidad, 0)
  return `${items.length} producto${items.length === 1 ? '' : 's'} · ${unidades} unidad${unidades === 1 ? '' : 'es'}`
}

async function itemsDe(quoteId: number) {
  return db('quote_items').where({ quote_id: quoteId }).orderBy('id')
}

function quoteInfo(q: any, vendedorNombre: string, items: { cantidad: number }[]): QuoteInfo {
  return {
    numero: q.numero,
    razonSocial: q.razon_social,
    contacto: q.contacto,
    origen: q.origen,
    destinoCiudad: q.destino_ciudad,
    resumen: items.length > 0 ? resumenItems(items) : (q.servicio ?? '—'),
    total: Number(q.total),
    vendedor: vendedorNombre,
    motivoRechazo: q.motivo_rechazo,
  }
}

const r2 = (n: number) => Math.round(n * 100) / 100

export async function crearCotizacion(datos: NuevaCotizacion, user: AuthUser) {
  if (datos.items.length === 0) throw new HttpError(400, 'La cotización necesita al menos un producto')

  // Precios y stock SIEMPRE del inventario (Profit Plus / simulado), nunca del cliente
  const codigos = [...new Set(datos.items.map((i) => i.codigo))]
  const productos = await profitPlus.getProducts(codigos)
  const porCodigo = new Map(productos.map((p) => [p.codigo, p]))

  const renglones = datos.items.map((i) => {
    const p = porCodigo.get(i.codigo)
    if (!p) throw new HttpError(400, `Producto no encontrado en el inventario: ${i.codigo}`)
    const disponible = p.stock[datos.origen] ?? 0
    if (i.cantidad > disponible) {
      throw new HttpError(
        409,
        `Stock insuficiente de "${p.nombre}" en ${datos.origen}: quedan ${disponible} y pediste ${i.cantidad}`,
      )
    }
    return {
      codigo: p.codigo,
      nombre: p.nombre,
      precio_unit: r2(p.precio),
      cantidad: i.cantidad,
      total: r2(p.precio * i.cantidad),
    }
  })

  const subtotal = r2(renglones.reduce((s, r) => s + r.total, 0))
  const iva = r2(subtotal * IVA_RATE)
  const total = r2(subtotal + iva)

  return db.transaction(async (trx) => {
    // Mantener el catálogo de clientes al día (clave: RIF)
    const [client] = await trx('clients')
      .insert({
        razon_social: datos.razonSocial,
        rif: datos.rif,
        telefono: datos.telefono ?? null,
        contacto: datos.contacto ?? null,
      })
      .onConflict('rif')
      .merge(['razon_social', 'telefono', 'contacto'])
      .returning('*')

    const numero = await nextNumber(trx, 'quote', 'COT')
    const [quote] = await trx('quotes')
      .insert({
        numero,
        client_id: client.id,
        razon_social: datos.razonSocial,
        rif: datos.rif,
        telefono: datos.telefono ?? null,
        contacto: datos.contacto ?? null,
        origen: datos.origen,
        destino_ciudad: datos.destinoCiudad,
        destino_direccion: datos.destinoDireccion,
        subtotal,
        iva,
        total,
        estado: 'generada',
        created_by: user.id,
      })
      .returning('*')

    await trx('quote_items').insert(renglones.map((r) => ({ ...r, quote_id: quote.id })))
    return { ...quote, items: renglones }
  })
}

export async function enviarAAprobacion(quoteId: number, user: AuthUser) {
  const quote = await db('quotes').where({ id: quoteId }).first()
  if (!quote) throw new HttpError(404, 'Cotización no encontrada')
  if (quote.estado !== 'generada') throw new HttpError(409, `La cotización ya está en estado "${quote.estado}"`)

  const items = await itemsDe(quoteId)

  // Inyección en Profit Plus 2K12 (simulada hasta tener acceso al SQL Server)
  const pp = await profitPlus.pushQuote({
    numero: quote.numero,
    razonSocial: quote.razon_social,
    rif: quote.rif,
    telefono: quote.telefono,
    contacto: quote.contacto,
    origen: quote.origen,
    destinoCiudad: quote.destino_ciudad,
    destinoDireccion: quote.destino_direccion,
    items: items.map((i) => ({
      codigo: i.codigo,
      nombre: i.nombre,
      cantidad: i.cantidad,
      precioUnit: Number(i.precio_unit),
      total: Number(i.total),
    })),
    subtotal: Number(quote.subtotal),
    iva: Number(quote.iva),
    total: Number(quote.total),
    vendedorEmail: user.email,
  })

  const [updated] = await db('quotes')
    .where({ id: quoteId })
    .update({
      estado: 'pendiente',
      pp_sync_status: pp.estado,
      pp_external_ref: pp.externalRef ?? null,
      updated_at: db.fn.now(),
    })
    .returning('*')

  // Aviso automático al equipo de Cuentas por Cobrar
  const info = quoteInfo(updated, user.nombre, items)
  const cxcUsers = await db('users').whereIn('rol', ['cxc']).andWhere('activo', true)
  const { subject, text } = templates.cotizacionPendiente(info)
  for (const u of cxcUsers) {
    await notifier.email(u.email, subject, text, { evento: 'cotizacion_pendiente', ref: updated.numero })
  }
  return updated
}

export async function decidirCotizacion(
  quoteId: number,
  decision: 'aprobada' | 'rechazada',
  user: AuthUser,
  motivo?: string,
) {
  const quote = await db('quotes').where({ id: quoteId }).first()
  if (!quote) throw new HttpError(404, 'Cotización no encontrada')
  if (quote.estado !== 'pendiente') throw new HttpError(409, `La cotización no está pendiente (estado actual: "${quote.estado}")`)

  const [updated] = await db('quotes')
    .where({ id: quoteId })
    .update({
      estado: decision,
      decided_by: user.id,
      decided_at: db.fn.now(),
      motivo_rechazo: decision === 'rechazada' ? (motivo ?? null) : null,
      updated_at: db.fn.now(),
    })
    .returning('*')

  const vendedor = await db('users').where({ id: quote.created_by }).first()
  const client = quote.client_id ? await db('clients').where({ id: quote.client_id }).first() : null
  const items = await itemsDe(quoteId)
  const info = quoteInfo(updated, vendedor?.nombre ?? 'equipo de ventas', items)

  let shipment: any = null
  if (decision === 'aprobada') {
    shipment = await crearEnvioDesdeCotizacion(updated, client, items)
    // Cliente: email (si lo tenemos) + WhatsApp al teléfono de contacto
    if (client?.email) {
      const m = templates.cotizacionAprobadaCliente(info)
      await notifier.email(client.email, m.subject, m.text, { evento: 'cotizacion_aprobada', ref: updated.numero })
    }
    const waTo = client?.whatsapp || updated.telefono
    if (waTo) {
      await notifier.whatsapp(normalizarTelefono(waTo), templates.cotizacionAprobadaWhatsApp(info), {
        evento: 'cotizacion_aprobada',
        ref: updated.numero,
      })
    }
    // Equipo de despacho
    const sInfo: ShipmentInfo = {
      numero: shipment.numero,
      cliente: shipment.cliente,
      estado: shipment.estado,
      eta: shipment.eta,
      destinoCiudad: shipment.destino_ciudad,
    }
    const md = templates.despachoNuevo(sInfo, info)
    const despachoUsers = await db('users').where({ rol: 'despacho', activo: true })
    for (const u of despachoUsers) {
      await notifier.email(u.email, md.subject, md.text, { evento: 'despacho_nuevo', ref: shipment.numero })
    }
  }

  // Vendedor: resultado de su cotización
  if (vendedor) {
    const mv = templates.cotizacionResueltaVendedor(info, decision === 'aprobada')
    await notifier.email(vendedor.email, mv.subject, mv.text, {
      evento: `cotizacion_${decision}`,
      ref: updated.numero,
    })
  }

  return { quote: updated, shipment }
}

export async function devolverAPendiente(quoteId: number) {
  const quote = await db('quotes').where({ id: quoteId }).first()
  if (!quote) throw new HttpError(404, 'Cotización no encontrada')
  if (quote.estado !== 'aprobada' && quote.estado !== 'rechazada')
    throw new HttpError(409, 'Solo se pueden devolver cotizaciones aprobadas o rechazadas')

  if (quote.estado === 'aprobada') {
    const shipment = await db('shipments').where({ quote_id: quoteId }).first()
    if (shipment) {
      if (shipment.done > 1) {
        throw new HttpError(409, `El envío ${shipment.numero} ya está en curso; no se puede devolver la cotización`)
      }
      await db('shipments').where({ id: shipment.id }).delete()
    }
  }

  const [updated] = await db('quotes')
    .where({ id: quoteId })
    .update({ estado: 'pendiente', decided_by: null, decided_at: null, motivo_rechazo: null, updated_at: db.fn.now() })
    .returning('*')
  return updated
}

async function crearEnvioDesdeCotizacion(quote: any, client: any, items: { cantidad: number }[]) {
  return db.transaction(async (trx) => {
    const numero = await nextNumber(trx, 'shipment', 'ENV')
    const carga = items.length > 0
      ? resumenItems(items)
      : `${quote.bultos ?? '—'} bultos · ${Number(quote.peso_kg ?? 0).toLocaleString('es-VE')} kg`
    const eta = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-VE', {
      day: '2-digit',
      month: 'short',
    })
    const [shipment] = await trx('shipments')
      .insert({
        numero,
        quote_id: quote.id,
        cliente: quote.razon_social,
        origen: quote.origen,
        destino_ciudad: quote.destino_ciudad,
        destino_direccion: quote.destino_direccion,
        carga,
        estado: 'Preparando',
        eta,
        done: 1,
        contacto_whatsapp: client?.whatsapp || quote.telefono || null,
        contacto_email: client?.email || null,
      })
      .returning('*')

    await trx('shipment_milestones').insert(
      MILESTONES.map((titulo, idx) => ({
        shipment_id: shipment.id,
        idx,
        titulo,
        at: idx === 0 ? trx.fn.now() : null,
      })),
    )
    await trx('shipment_docs').insert([
      { shipment_id: shipment.id, nombre: `Orden de despacho ${numero}.pdf`, tamano: '96 KB' },
      { shipment_id: shipment.id, nombre: `Cotización ${quote.numero}.pdf`, tamano: '128 KB' },
    ])
    return shipment
  })
}

export async function avanzarEnvio(shipmentId: number) {
  const shipment = await db('shipments').where({ id: shipmentId }).first()
  if (!shipment) throw new HttpError(404, 'Envío no encontrado')
  if (shipment.done >= 5) throw new HttpError(409, 'El envío ya fue entregado')

  const done = shipment.done + 1
  const estadoAnterior = shipment.estado
  const estado = estadoFromDone(done, false)

  await db('shipment_milestones')
    .where({ shipment_id: shipmentId, idx: done - 1 })
    .update({ at: db.fn.now() })
  const [updated] = await db('shipments')
    .where({ id: shipmentId })
    .update({ done, estado, incidencia: false, updated_at: db.fn.now() })
    .returning('*')

  if (estado !== estadoAnterior) {
    await notificarEstadoEnvio(updated)
  }
  return updated
}

export async function marcarIncidencia(shipmentId: number, on: boolean) {
  const shipment = await db('shipments').where({ id: shipmentId }).first()
  if (!shipment) throw new HttpError(404, 'Envío no encontrado')
  const estado = estadoFromDone(shipment.done, on)
  const [updated] = await db('shipments')
    .where({ id: shipmentId })
    .update({ incidencia: on, estado, updated_at: db.fn.now() })
    .returning('*')
  if (on) await notificarEstadoEnvio(updated)
  return updated
}

async function notificarEstadoEnvio(shipment: any) {
  const sInfo: ShipmentInfo = {
    numero: shipment.numero,
    cliente: shipment.cliente,
    estado: shipment.estado,
    eta: shipment.eta,
    destinoCiudad: shipment.destino_ciudad,
  }
  if (shipment.contacto_whatsapp) {
    await notifier.whatsapp(normalizarTelefono(shipment.contacto_whatsapp), templates.envioEstadoWhatsApp(sInfo), {
      evento: 'envio_estado',
      ref: shipment.numero,
    })
  }
  if (shipment.contacto_email) {
    const m = templates.envioEstadoEmail(sInfo)
    await notifier.email(shipment.contacto_email, m.subject, m.text, { evento: 'envio_estado', ref: shipment.numero })
  }
}

// Acepta formatos locales venezolanos (0412-123.45.67) y devuelve E.164 (+58412…)
export function normalizarTelefono(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('58')) return `+${digits}`
  if (digits.startsWith('0')) return `+58${digits.slice(1)}`
  return `+58${digits}`
}
