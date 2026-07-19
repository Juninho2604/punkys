export type Rol = 'vendedor' | 'cxc' | 'facturacion' | 'despacho' | 'admin'

export interface User {
  id: number
  nombre: string
  email: string
  rol: Rol
}

export interface QuoteItem {
  id: number
  codigo: string
  nombre: string
  precio_unit: string
  cantidad: number
  total: string
}

export interface Producto {
  codigo: string
  nombre: string
  precio: number
  stock: Record<string, number>
}

export interface Quote {
  id: number
  numero: string
  razon_social: string
  rif: string
  telefono: string | null
  contacto: string | null
  origen: string
  destino_ciudad: string
  destino_direccion: string
  // Modelo viejo (cotizaciones históricas); las nuevas usan items
  peso_kg: string | null
  volumen_m3: string | null
  bultos: number | null
  valor_declarado: string | null
  servicio: string | null
  flete_base: string | null
  cargo_peso: string | null
  seguro: string | null
  subtotal: string
  iva: string
  total: string
  estado: 'generada' | 'pendiente' | 'aprobada' | 'facturada' | 'rechazada'
  factura_numero?: string | null
  facturada_at?: string | null
  motivo_rechazo: string | null
  pp_sync_status: string
  pp_external_ref: string | null
  vendedor?: string
  resumen?: string
  items?: QuoteItem[]
  created_at: string
}

export interface Shipment {
  id: number
  numero: string
  quote_id: number | null
  cliente: string
  origen: string
  destino_ciudad: string
  destino_direccion: string
  transportista: string
  placa: string | null
  carga: string | null
  estado: string
  eta: string | null
  done: number
  incidencia: boolean
  created_at: string
}

export interface Milestone {
  id: number
  idx: number
  titulo: string
  at: string | null
}

export interface ShipmentDoc {
  id: number
  nombre: string
  tamano: string | null
}

export interface Servicio {
  id: 'terrestre' | 'express' | 'frio' | 'especial'
  nombre: string
  detalle: string
  base: number
  porKg: number
}

export interface DashboardData {
  kpis: {
    enviosActivos: number
    enviosNuevosSemana: number
    cotizacionesMes: number
    deltaCotizaciones: number | null
    porAprobar: number
    entregasATiempo: number
  }
  recientes: Shipment[]
  pendientes: Quote[]
}
