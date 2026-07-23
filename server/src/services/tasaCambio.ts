import { db } from '../db/knex.js'
import { config } from '../config.js'

// Servicio de tasa de cambio oficial (BCV). Estrategia resiliente:
//   1. Si hay override manual en el .env (BCV_TASA_MANUAL > 0), se usa ese.
//   2. Si la última tasa en BD es fresca (< BCV_REFRESH_HORAS), se usa esa.
//   3. Si no, se intenta traer de la API (BCV_API_URL) y se guarda.
//   4. Si la API falla, se conserva la última buena de la BD.
//   5. Si no hay ninguna, se usa BCV_TASA_FALLBACK (si > 0).
// Nunca lanza: si no hay tasa, devuelve valor 0 (el front muestra solo Bs).

export interface Tasa {
  valor: number
  fecha: string | null
  fuente: string
  obtenidaAt: string | null
}

const hoyISO = () => new Date().toISOString().slice(0, 10)

async function ultimaDeBd(): Promise<Tasa | null> {
  const r = await db('tasa_cambio').orderBy('obtenida_at', 'desc').first()
  if (!r) return null
  return { valor: Number(r.valor), fecha: r.fecha, fuente: r.fuente, obtenidaAt: r.obtenida_at }
}

// Extrae el número de tasa de las respuestas más comunes (dolarapi, pydolarve, BCV)
function extraerValor(data: any): { valor: number; fecha: string | null } | null {
  if (data == null) return null
  const cand =
    data.promedio ?? data.price ?? data.venta ?? data.value ??
    data?.monitors?.bcv?.price ?? data?.bcv?.price ?? data?.usd?.promedio
  const valor = Number(cand)
  if (!Number.isFinite(valor) || valor <= 0) return null
  const fecha = data.fechaActualizacion ?? data.last_update ?? data.fecha ?? null
  return { valor, fecha: typeof fecha === 'string' ? fecha.slice(0, 10) : null }
}

async function traerDeApi(): Promise<Tasa | null> {
  const url = config.bcv.apiUrl
  if (!url) return null
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 12_000)
    const res = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json' } })
    clearTimeout(to)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const parsed = extraerValor(await res.json())
    if (!parsed) throw new Error('No se encontró el valor de la tasa en la respuesta')
    const fila = { fuente: 'bcv-api', valor: parsed.valor, fecha: parsed.fecha ?? hoyISO() }
    await db('tasa_cambio').insert(fila)
    console.log(`💱 [Tasa] BCV actualizada: ${parsed.valor} Bs/USD (${fila.fecha})`)
    return { ...fila, obtenidaAt: new Date().toISOString() }
  } catch (err) {
    console.error('⚠️ [Tasa] No se pudo obtener del BCV:', err instanceof Error ? err.message : err)
    return null
  }
}

export async function obtenerTasa(): Promise<Tasa> {
  if (config.bcv.manual > 0) {
    return { valor: config.bcv.manual, fecha: hoyISO(), fuente: 'manual', obtenidaAt: new Date().toISOString() }
  }
  const ultima = await ultimaDeBd()
  if (ultima) {
    const horas = (Date.now() - new Date(ultima.obtenidaAt!).getTime()) / 3_600_000
    if (horas < config.bcv.refreshHoras) return ultima
  }
  return (await traerDeApi()) ?? ultima ?? {
    valor: config.bcv.fallback,
    fecha: null,
    fuente: config.bcv.fallback > 0 ? 'fallback' : 'sin-tasa',
    obtenidaAt: null,
  }
}

// Fuerza traer del BCV (para el botón del admin)
export async function refrescarTasa(): Promise<Tasa> {
  if (config.bcv.manual > 0) return obtenerTasa()
  return (await traerDeApi()) ?? (await obtenerTasa())
}

// Fija una tasa a mano (admin, cuando la API no esté disponible)
export async function fijarTasaManual(valor: number): Promise<Tasa> {
  const fila = { fuente: 'manual', valor, fecha: hoyISO() }
  await db('tasa_cambio').insert(fila)
  return { ...fila, obtenidaAt: new Date().toISOString() }
}

// Historial de tasas (ascendente por fecha) para calcular el USD de documentos
// viejos a la tasa que había ese día, no a la de hoy.
export async function obtenerHistorial(): Promise<{ fecha: string; valor: number }[]> {
  const rows = await db('tasa_cambio').whereNotNull('fecha').orderBy('fecha', 'asc').select('fecha', 'valor')
  return rows.map((r) => ({ fecha: String(r.fecha).slice(0, 10), valor: Number(r.valor) }))
}

// Normaliza una fecha (Date o texto) a 'YYYY-MM-DD'.
function isoDia(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v ?? '').slice(0, 10)
}

// Tasa vigente en (o justo antes de) una fecha. Si la fecha es anterior a todo
// el historial, usa la más antigua conocida; si no hay historial, el respaldo.
export function tasaParaFecha(historial: { fecha: string; valor: number }[], fecha: unknown, fallback: number): number {
  if (!historial.length) return fallback
  const f = isoDia(fecha)
  if (!f) return fallback
  let val = 0
  for (const h of historial) {
    if (h.fecha <= f) val = h.valor
    else break
  }
  return val > 0 ? val : historial[0].valor || fallback
}

export function iniciarRefrescoTasa(): void {
  void obtenerTasa()
  setInterval(() => void obtenerTasa(), config.bcv.refreshHoras * 3_600_000)
  console.log(`💱 [Tasa] Refresco automático cada ${config.bcv.refreshHoras} h`)
}
