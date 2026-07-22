import { config } from '../config.js'
import { db } from '../db/knex.js'
import type { EmailProvider, WhatsAppProvider } from './types.js'
import { ConsoleEmailProvider } from './email/console.js'
import { SmtpEmailProvider } from './email/smtp.js'
import { ConsoleWhatsAppProvider } from './whatsapp/console.js'
import { TwilioWhatsAppProvider } from './whatsapp/twilio.js'
import { CloudApiWhatsAppProvider } from './whatsapp/cloudapi.js'
import { textToHtml } from './templates.js'

function buildEmailProvider(): EmailProvider {
  switch (config.email.provider) {
    case 'smtp':
      return new SmtpEmailProvider()
    default:
      return new ConsoleEmailProvider()
  }
}

function buildWhatsAppProvider(): WhatsAppProvider {
  switch (config.whatsapp.provider) {
    case 'twilio':
      return new TwilioWhatsAppProvider()
    case 'cloudapi':
      return new CloudApiWhatsAppProvider()
    default:
      return new ConsoleWhatsAppProvider()
  }
}

const emailProvider = buildEmailProvider()
const whatsappProvider = buildWhatsAppProvider()

interface Meta {
  evento: string
  ref?: string
}

// Fachada única de notificaciones: envía por el proveedor configurado y deja
// rastro en notification_log. Nunca lanza: un fallo de notificación no debe
// tumbar el workflow (queda registrado con estado 'error').
export const notifier = {
  async email(to: string, subject: string, text: string, meta: Meta): Promise<void> {
    if (!to) return
    let result
    try {
      result = await emailProvider.send({ to, subject, text, html: textToHtml(text) })
    } catch (err) {
      result = { ok: false, proveedor: emailProvider.nombre, estado: 'error' as const, error: String(err) }
    }
    await log('email', result.proveedor, to, subject, text, meta, result.estado, result.error)
  },

  // Igual que email() pero con HTML propio (para correos con formato rico,
  // ej. el CxC diario). `text` es el respaldo en texto plano para el log.
  async emailHtml(to: string, subject: string, html: string, text: string, meta: Meta): Promise<'simulado' | 'enviado' | 'error'> {
    if (!to) return 'error'
    let result
    try {
      result = await emailProvider.send({ to, subject, text, html })
    } catch (err) {
      result = { ok: false, proveedor: emailProvider.nombre, estado: 'error' as const, error: String(err) }
    }
    await log('email', result.proveedor, to, subject, text, meta, result.estado, result.error)
    return result.estado
  },

  async whatsapp(to: string, body: string, meta: Meta): Promise<void> {
    if (!to) return
    let result
    try {
      result = await whatsappProvider.send({ to, body })
    } catch (err) {
      result = { ok: false, proveedor: whatsappProvider.nombre, estado: 'error' as const, error: String(err) }
    }
    await log('whatsapp', result.proveedor, to, null, body, meta, result.estado, result.error)
  },
}

async function log(
  canal: string,
  proveedor: string,
  destinatario: string,
  asunto: string | null,
  cuerpo: string,
  meta: Meta,
  estado: string,
  error?: string,
): Promise<void> {
  try {
    await db('notification_log').insert({
      canal,
      proveedor,
      destinatario,
      asunto,
      cuerpo,
      evento: meta.evento,
      ref: meta.ref ?? null,
      estado,
      error: error ?? null,
    })
  } catch (err) {
    console.error('No se pudo registrar la notificación:', err)
  }
}
