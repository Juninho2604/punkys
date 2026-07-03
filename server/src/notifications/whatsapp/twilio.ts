import { config } from '../../config.js'
import type { SendResult, WhatsAppMessage, WhatsAppProvider } from '../types.js'

// Proveedor actual: Twilio (API REST directa, sin SDK).
// Migrar a WhatsApp Business Cloud API = cambiar WHATSAPP_PROVIDER=cloudapi (ver cloudapi.ts).
export class TwilioWhatsAppProvider implements WhatsAppProvider {
  nombre = 'twilio'

  constructor() {
    const { accountSid, authToken, from } = config.whatsapp.twilio
    if (!accountSid || !authToken || !from) {
      throw new Error('WHATSAPP_PROVIDER=twilio requiere TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN y TWILIO_WHATSAPP_FROM')
    }
  }

  async send(msg: WhatsAppMessage): Promise<SendResult> {
    const { accountSid, authToken, from } = config.whatsapp.twilio
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    const body = new URLSearchParams({
      From: from,
      To: `whatsapp:${msg.to}`,
      Body: msg.body,
    })
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })
      if (!res.ok) {
        const detail = await res.text()
        return { ok: false, proveedor: this.nombre, estado: 'error', error: `Twilio ${res.status}: ${detail}` }
      }
      return { ok: true, proveedor: this.nombre, estado: 'enviado' }
    } catch (err) {
      return { ok: false, proveedor: this.nombre, estado: 'error', error: String(err) }
    }
  }
}
