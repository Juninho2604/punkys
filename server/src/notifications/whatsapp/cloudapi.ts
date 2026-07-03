import { config } from '../../config.js'
import type { SendResult, WhatsAppMessage, WhatsAppProvider } from '../types.js'

// WhatsApp Business Cloud API (Meta) — proveedor previsto para la migración desde Twilio.
// Activar con WHATSAPP_PROVIDER=cloudapi + WA_CLOUD_PHONE_NUMBER_ID + WA_CLOUD_ACCESS_TOKEN.
// Nota: fuera de la ventana de 24h de servicio al cliente, Meta exige plantillas
// aprobadas (type: "template"); ver docs/notificaciones.md antes de salir a producción.
export class CloudApiWhatsAppProvider implements WhatsAppProvider {
  nombre = 'cloudapi'

  constructor() {
    const { phoneNumberId, accessToken } = config.whatsapp.cloudApi
    if (!phoneNumberId || !accessToken) {
      throw new Error('WHATSAPP_PROVIDER=cloudapi requiere WA_CLOUD_PHONE_NUMBER_ID y WA_CLOUD_ACCESS_TOKEN')
    }
  }

  async send(msg: WhatsAppMessage): Promise<SendResult> {
    const { phoneNumberId, accessToken } = config.whatsapp.cloudApi
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: msg.to.replace(/^\+/, ''),
          type: 'text',
          text: { body: msg.body },
        }),
      })
      if (!res.ok) {
        const detail = await res.text()
        return { ok: false, proveedor: this.nombre, estado: 'error', error: `Cloud API ${res.status}: ${detail}` }
      }
      return { ok: true, proveedor: this.nombre, estado: 'enviado' }
    } catch (err) {
      return { ok: false, proveedor: this.nombre, estado: 'error', error: String(err) }
    }
  }
}
