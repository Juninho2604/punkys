// Contrato de integración con Profit Plus 2K12 (SQL Server).
// La intranet habla SOLO con esta interfaz: cambiar de modo simulado a
// conexión real no toca ninguna otra parte del código.

export interface PPQuotePayload {
  numero: string
  razonSocial: string
  rif: string
  telefono?: string | null
  contacto?: string | null
  origen: string
  destinoCiudad: string
  destinoDireccion: string
  pesoKg: number
  volumenM3: number
  bultos: number
  valorDeclarado: number
  servicio: string
  subtotal: number
  iva: number
  total: number
  vendedorEmail: string
}

export interface PPPushResult {
  ok: boolean
  // 'simulado' mientras no haya acceso al SQL Server real
  estado: 'simulado' | 'sincronizada' | 'error'
  externalRef?: string
  error?: string
}

export interface PPStatus {
  modo: 'simulado' | 'sqlserver'
  conectado: boolean
  detalle: string
}

export interface ProfitPlusConnector {
  /** Inyecta la cotización en la base de datos de Profit Plus 2K12. */
  pushQuote(quote: PPQuotePayload): Promise<PPPushResult>
  /** Estado de la conexión, para mostrar en la intranet. */
  status(): Promise<PPStatus>
}
