// Motor de precios — fuente de verdad del cálculo de cotizaciones.
// El cliente muestra el desglose en tiempo real con estas mismas reglas,
// pero el servidor SIEMPRE recalcula antes de guardar.

export type ServicioId = 'terrestre' | 'express' | 'frio' | 'especial'

export interface Servicio {
  id: ServicioId
  nombre: string
  detalle: string
  base: number // Bs.
  porKg: number // Bs./kg
}

export const SERVICIOS: Servicio[] = [
  { id: 'terrestre', nombre: 'Terrestre Estándar', detalle: 'Entrega 48–72h', base: 850, porKg: 12 },
  { id: 'express', nombre: 'Express 24h', detalle: 'Prioridad máxima', base: 2400, porKg: 28 },
  { id: 'frio', nombre: 'Cadena de Frío', detalle: 'Refrigerado 2–8 °C', base: 1900, porKg: 22 },
  { id: 'especial', nombre: 'Manejo Especial', detalle: 'Frágil / voluminoso', base: 1400, porKg: 18 },
]

export const IVA_RATE = 0.16
export const SEGURO_RATE = 0.02

export interface Desglose {
  fleteBase: number
  cargoPeso: number
  seguro: number
  subtotal: number
  iva: number
  total: number
}

const r2 = (n: number) => Math.round(n * 100) / 100

export function calcularDesglose(servicioId: ServicioId, pesoKg: number, valorDeclarado: number): Desglose {
  const servicio = SERVICIOS.find((s) => s.id === servicioId)
  if (!servicio) throw new Error(`Servicio desconocido: ${servicioId}`)
  const fleteBase = r2(servicio.base)
  const cargoPeso = r2(pesoKg * servicio.porKg)
  const seguro = r2(valorDeclarado * SEGURO_RATE)
  const subtotal = r2(fleteBase + cargoPeso + seguro)
  const iva = r2(subtotal * IVA_RATE)
  const total = r2(subtotal + iva)
  return { fleteBase, cargoPeso, seguro, subtotal, iva, total }
}
