// Plantillas de los mensajes automáticos del workflow.
// Un solo lugar para ajustar copys de email y WhatsApp.

const fmtBs = (n: number) =>
  'Bs. ' + n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export interface QuoteInfo {
  numero: string
  razonSocial: string
  contacto?: string | null
  origen: string
  destinoCiudad: string
  servicioNombre: string
  total: number
  vendedor: string
  motivoRechazo?: string | null
}

export interface ShipmentInfo {
  numero: string
  cliente: string
  estado: string
  eta?: string | null
  destinoCiudad: string
}

const pie = 'Punky Partners · Logística corporativa'

export const templates = {
  cotizacionPendiente(q: QuoteInfo) {
    const subject = `Nueva cotización por aprobar · ${q.numero}`
    const text = [
      `Hola, hay una nueva cotización esperando tu decisión.`,
      ``,
      `Cotización: ${q.numero}`,
      `Cliente: ${q.razonSocial}`,
      `Ruta: ${q.origen} → ${q.destinoCiudad}`,
      `Servicio: ${q.servicioNombre}`,
      `Total: ${fmtBs(q.total)}`,
      `Vendedor: ${q.vendedor}`,
      ``,
      `Entra a la intranet → Aprobaciones para aprobarla o rechazarla.`,
      ``,
      pie,
    ].join('\n')
    return { subject, text }
  },

  cotizacionAprobadaCliente(q: QuoteInfo) {
    const subject = `Tu cotización ${q.numero} fue aprobada ✓`
    const text = [
      `Hola${q.contacto ? ` ${q.contacto}` : ''},`,
      ``,
      `Buenas noticias: la cotización ${q.numero} de ${q.razonSocial} fue aprobada.`,
      `Servicio: ${q.servicioNombre} · Ruta: ${q.origen} → ${q.destinoCiudad}`,
      `Total: ${fmtBs(q.total)}`,
      ``,
      `Tu pedido pasó al área de despacho; te avisaremos en cada etapa del envío.`,
      ``,
      pie,
    ].join('\n')
    return { subject, text }
  },

  cotizacionAprobadaWhatsApp(q: QuoteInfo) {
    return [
      `✅ *Punky Partners*`,
      `Tu cotización *${q.numero}* fue aprobada.`,
      `${q.servicioNombre} · ${q.origen} → ${q.destinoCiudad}`,
      `Total: *${fmtBs(q.total)}*`,
      `Te avisaremos cuando el envío esté en camino. 🐾`,
    ].join('\n')
  },

  cotizacionResueltaVendedor(q: QuoteInfo, aprobada: boolean) {
    const subject = aprobada
      ? `Cotización ${q.numero} aprobada por Cuentas por Cobrar ✓`
      : `Cotización ${q.numero} rechazada por Cuentas por Cobrar`
    const text = [
      `Hola ${q.vendedor},`,
      ``,
      aprobada
        ? `La cotización ${q.numero} (${q.razonSocial}) fue aprobada y ya se generó la orden de despacho.`
        : `La cotización ${q.numero} (${q.razonSocial}) fue rechazada.${q.motivoRechazo ? `\nMotivo: ${q.motivoRechazo}` : ''}`,
      ``,
      pie,
    ].join('\n')
    return { subject, text }
  },

  despachoNuevo(s: ShipmentInfo, q: QuoteInfo) {
    const subject = `Nueva orden de despacho · ${s.numero} (${q.numero})`
    const text = [
      `Se generó una nueva orden de despacho a partir de la cotización aprobada ${q.numero}.`,
      ``,
      `Envío: ${s.numero}`,
      `Cliente: ${s.cliente}`,
      `Ruta: ${q.origen} → ${q.destinoCiudad}`,
      ``,
      `Entra a la intranet → Despacho para asignar transportista y gestionar la carga.`,
      ``,
      pie,
    ].join('\n')
    return { subject, text }
  },

  envioEstadoWhatsApp(s: ShipmentInfo) {
    const lineas: Record<string, string> = {
      'En tránsito': `🚚 Tu envío *${s.numero}* va en camino a ${s.destinoCiudad}.`,
      'En reparto': `📦 Tu envío *${s.numero}* está en reparto, llega hoy.`,
      Entregado: `🎉 Tu envío *${s.numero}* fue entregado. ¡Gracias por confiar en Punky Partners! 🐾`,
      Incidencia: `⚠️ Tu envío *${s.numero}* presenta una incidencia. Nuestro equipo ya está trabajando en resolverla.`,
    }
    const linea = lineas[s.estado] ?? `ℹ️ Tu envío *${s.numero}* cambió de estado: ${s.estado}.`
    return [`*Punky Partners*`, linea, s.eta && s.estado !== 'Entregado' ? `ETA: ${s.eta}` : '']
      .filter(Boolean)
      .join('\n')
  },

  envioEstadoEmail(s: ShipmentInfo) {
    const subject = `Actualización de tu envío ${s.numero}: ${s.estado}`
    const text = [
      `Hola,`,
      ``,
      `Tu envío ${s.numero} cambió de estado: ${s.estado}.`,
      s.eta && s.estado !== 'Entregado' ? `Fecha estimada de entrega: ${s.eta}` : '',
      ``,
      pie,
    ]
      .filter((l) => l !== '')
      .join('\n')
    return { subject, text }
  },
}

export function textToHtml(text: string): string {
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<div style="font-family:'Nunito Sans',Arial,sans-serif;font-size:14px;color:#1C2B4A;line-height:1.6">${esc
    .split('\n')
    .map((l) => (l.trim() === '' ? '<br/>' : `<p style="margin:0">${l}</p>`))
    .join('')}</div>`
}
