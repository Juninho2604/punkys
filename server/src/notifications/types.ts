export interface EmailMessage {
  to: string
  subject: string
  html: string
  text: string
}

export interface WhatsAppMessage {
  // Número en formato E.164, ej: +584121234567
  to: string
  body: string
}

export interface SendResult {
  ok: boolean
  proveedor: string
  estado: 'simulado' | 'enviado' | 'error'
  error?: string
}

export interface EmailProvider {
  nombre: string
  send(msg: EmailMessage): Promise<SendResult>
}

export interface WhatsAppProvider {
  nombre: string
  send(msg: WhatsAppMessage): Promise<SendResult>
}
