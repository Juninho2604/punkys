import nodemailer, { type Transporter } from 'nodemailer'
import { config } from '../../config.js'
import type { EmailMessage, EmailProvider, SendResult } from '../types.js'

export class SmtpEmailProvider implements EmailProvider {
  nombre = 'smtp'
  private transporter: Transporter

  constructor() {
    const { host, port, secure, user, pass } = config.email.smtp
    if (!host) throw new Error('EMAIL_PROVIDER=smtp requiere SMTP_HOST (ver .env.example)')
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user ? { user, pass } : undefined,
    })
  }

  async send(msg: EmailMessage): Promise<SendResult> {
    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
      })
      return { ok: true, proveedor: this.nombre, estado: 'enviado' }
    } catch (err) {
      return { ok: false, proveedor: this.nombre, estado: 'error', error: String(err) }
    }
  }
}
