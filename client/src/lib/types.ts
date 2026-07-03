export type Rol = 'vendedor' | 'cxc' | 'despacho' | 'admin'

export interface User {
  id: number
  nombre: string
  email: string
  rol: Rol
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
  peso_kg: string
  volumen_m3: string
  bultos: number
  valor_declarado: string
  servicio: string
  flete_base: string
  cargo_peso: string
  seguro: string
  subtotal: string
  iva: string
  total: string
  estado: 'generada' | 'pendiente' | 'aprobada' | 'rechazada'
  motivo_rechazo: string | null
  pp_sync_status: string
  pp_external_ref: string | null
  vendedor?: string
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
