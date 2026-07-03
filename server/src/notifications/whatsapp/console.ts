import type { SendResult, WhatsAppMessage, WhatsAppProvider } from '../types.js'

// Proveedor simulado: imprime el mensaje en el log del servidor.
export class ConsoleWhatsAppProvider implements WhatsAppProvider {
  nombre = 'console'

  async send(msg: WhatsAppMessage): Promise<SendResult> {
    console.log(`\n💬 [WHATSAPP simulado] → ${msg.to}\n   ${msg.body.split('\n').join('\n   ')}\n`)
    return { ok: true, proveedor: this.nombre, estado: 'simulado' }
  }
}
