import { useEffect, useState } from 'react'
import { api } from './api'

// Tasa de cambio oficial (BCV) para mostrar el equivalente USD de los montos
// que la intranet maneja en Bolívares (vienen así de Profit).

export interface Tasa {
  valor: number // Bs por 1 USD (0 = sin tasa disponible)
  fecha: string | null
  fuente: string
  obtenidaAt: string | null
}

let cache: Tasa | null = null

// Hook simple con caché en memoria (una sola llamada por sesión de app).
export function useTasa(): Tasa | null {
  const [tasa, setTasa] = useState<Tasa | null>(cache)
  useEffect(() => {
    if (cache) return
    api
      .get<Tasa>('/tasa')
      .then((t) => {
        cache = t
        setTasa(t)
      })
      .catch(() => setTasa({ valor: 0, fecha: null, fuente: 'sin-tasa', obtenidaAt: null }))
  }, [])
  return tasa
}

const nf = (max: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 0, maximumFractionDigits: max })

// Monto en Bs (o la moneda que sea) con separadores locales.
export function bs(n: number, moneda = 'Bs'): string {
  return `${moneda} ${nf(2).format(n)}`
}

// Equivalente en USD según la tasa; '' si no hay tasa.
export function usdEq(nBs: number, tasa: Tasa | null): string {
  if (!tasa || tasa.valor <= 0) return ''
  return `≈ $ ${nf(0).format(nBs / tasa.valor)}`
}

// "Bs 1.234,00  ≈ $ 34" — para KPIs y totales.
export function montoDual(nBs: number, tasa: Tasa | null, moneda = 'Bs'): string {
  const eq = usdEq(nBs, tasa)
  return eq ? `${bs(nBs, moneda)} ${eq}` : bs(nBs, moneda)
}

export function etiquetaTasa(tasa: Tasa | null): string {
  if (!tasa || tasa.valor <= 0) return 'Sin tasa BCV (montos solo en Bs)'
  const f = tasa.fecha ? new Date(tasa.fecha + 'T12:00:00').toLocaleDateString('es-VE') : ''
  const fuente = tasa.fuente === 'manual' ? ' · manual' : tasa.fuente === 'bcv-api' ? ' · BCV' : ''
  return `Tasa: ${nf(2).format(tasa.valor)} Bs/$${f ? ` (${f})` : ''}${fuente}`
}
