import type { EmailMessage, EmailProvider, SendResult } from '../types.js'

// Proveedor simulado: imprime el correo en el log del servidor.
// Útil en desarrollo y mientras no haya credenciales SMTP.
export class ConsoleEmailProvider implements EmailProvider {
  nombre = 'console'

  async send(msg: EmailMessage): Promise<SendResult> {
    console.log(`\n📧 [EMAIL simulado] → ${msg.to}\n   Asunto: ${msg.subject}\n   ${msg.text.split('\n').join('\n   ')}\n`)
    return { ok: true, proveedor: this.nombre, estado: 'simulado' }
  }
}
