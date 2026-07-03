import { db } from '../db/knex.js'
import { HttpError } from '../middleware/errors.js'
import type { AuthUser } from '../middleware/auth.js'
import { calcularDesglose, SERVICIOS, type ServicioId } from './pricing.js'
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
  pesoKg: number
  volumenM3: number
  bultos: number
  valorDeclarado: number
  servicio: ServicioId
}

function quoteInfo(q: any, vendedorNombre: string): QuoteInfo {
  const servicio = SERVICIOS.find((s) => s.id === q.servicio)
  return {
    numero: q.numero,
    razonSocial: q.razon_social,
    contacto: q.contacto,
    origen: q.origen,
    destinoCiudad: q.destino_ciudad,
    servicioNombre: servicio?.nombre ?? q.servicio,
    total: Number(q.total),
    vendedor: vendedorNombre,
    motivoRechazo: q.motivo_rechazo,
  }
}

export async function crearCotizacion(datos: NuevaCotizacion, user: AuthUser) {
  const desglose = calcularDesglose(datos.servicio, datos.pesoKg, datos.valorDeclarado)

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
        peso_kg: datos.pesoKg,
        volumen_m3: datos.volumenM3,
        bultos: datos.bultos,
        valor_declarado: datos.valorDeclarado,
        servicio: datos.servicio,
        flete_base: desglose.fleteBase,
        cargo_peso: desglose.cargoPeso,
        seguro: desglose.seguro,
        subtotal: desglose.subtotal,
        iva: desglose.iva,
        total: desglose.total,
        estado: 'generada',
        created_by: user.id,
      })
      .returning('*')
    return quote
  })
}

export async function enviarAAprobacion(quoteId: number, user: AuthUser) {
  const quote = await db('quotes').where({ id: quoteId }).first()
  if (!quote) throw new HttpError(404, 'Cotización no encontrada')
  if (quote.estado !== 'generada') throw new HttpError(409, `La cotización ya está en estado "${quote.estado}"`)

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
    pesoKg: Number(quote.peso_kg),
    volumenM3: Number(quote.volumen_m3),
    bultos: quote.bultos,
    valorDeclarado: Number(quote.valor_declarado),
    servicio: quote.servicio,
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
  const info = quoteInfo(updated, user.nombre)
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
  const info = quoteInfo(updated, vendedor?.nombre ?? 'equipo de ventas')

  let shipment: any = null
  if (decision === 'aprobada') {
    shipment = await crearEnvioDesdeCotizacion(updated, client)
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

async function crearEnvioDesdeCotizacion(quote: any, client: any) {
  return db.transaction(async (trx) => {
    const numero = await nextNumber(trx, 'shipment', 'ENV')
    const carga = `${quote.bultos} bulto${quote.bultos === 1 ? '' : 's'} · ${Number(quote.peso_kg).toLocaleString('es-VE')} kg · ${Number(quote.volumen_m3).toLocaleString('es-VE')} m³`
    const dias = quote.servicio === 'express' ? 1 : 3
    const eta = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toLocaleDateString('es-VE', {
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
