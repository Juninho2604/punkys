// Contrato de integración con Profit Plus 2K12 (SQL Server).
// La intranet habla SOLO con esta interfaz: cambiar de modo simulado a
// conexión real no toca ninguna otra parte del código.

export interface PPQuoteItem {
  codigo: string
  nombre: string
  cantidad: number
  precioUnit: number
  total: number
}

export interface PPQuotePayload {
  numero: string
  razonSocial: string
  rif: string
  telefono?: string | null
  contacto?: string | null
  origen: string
  destinoCiudad: string
  destinoDireccion: string
  items: PPQuoteItem[]
  subtotal: number
  iva: number
  total: number
  vendedorEmail: string
}

// Producto del inventario de Profit Plus (o del catálogo simulado).
// stock: unidades disponibles por sede (clave = nombre de la sede).
export interface PPProduct {
  codigo: string
  nombre: string
  precio: number
  stock: Record<string, number>
}

export interface PPPushResult {
  ok: boolean
  // 'simulado' mientras no haya acceso al SQL Server real
  estado: 'simulado' | 'sincronizada' | 'error'
  externalRef?: string
  error?: string
}

export interface PPStatus {
  modo: 'simulado' | 'pipeline' | 'sqlserver' | 'replica'
  conectado: boolean
  detalle: string
}

export interface ProfitPlusConnector {
  /** Inyecta la cotización en la base de datos de Profit Plus 2K12. */
  pushQuote(quote: PPQuotePayload): Promise<PPPushResult>
  /** Busca productos por nombre o código (inventario con stock por sede). */
  searchProducts(query: string): Promise<PPProduct[]>
  /** Trae productos puntuales por código (para validar precios/stock al cotizar). */
  getProducts(codigos: string[]): Promise<PPProduct[]>
  /** Estado de la conexión, para mostrar en la intranet. */
  status(): Promise<PPStatus>
}
