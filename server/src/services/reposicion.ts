import { db } from '../db/knex.js'

// Motor de reposición (adaptación del "Plan de Compras" del cliente).
// Pronóstico de demanda por SKU + punto de pedido + fecha límite de compra.
// El servidor SIEMPRE recalcula; la página solo muestra.
//
// Enfoque (deliberadamente simple y auditable, como recomienda su propia
// bitácora: "empezar simple, Holt/promedio le gana a modelos sofisticados con
// catálogos chicos"):
//   · demanda semanal = promedio de las últimas ~13 semanas SANAS
//   · censura de quiebre: si hoy no hay stock, las semanas finales en 0 no son
//     demanda real (era quiebre) y se descartan
//   · stock de seguridad = z(nivel servicio) · σ · √(lead)
//   · punto de pedido (ROP) = demanda · lead + SS
//   · fecha límite = hoy + (stock − SS)/demanda − lead

export interface RepoConfig {
  cobertura_objetivo_sem: number
  lead_total_sem: number
  semanas_analisis: number
  nivel_servicio_pct: number
}

const DEFAULTS: RepoConfig = { cobertura_objetivo_sem: 12, lead_total_sem: 14, semanas_analisis: 26, nivel_servicio_pct: 95 }

export async function obtenerConfig(): Promise<RepoConfig> {
  const row = await db('reposicion_config').orderBy('id').first()
  if (!row) return { ...DEFAULTS }
  return {
    cobertura_objetivo_sem: Number(row.cobertura_objetivo_sem) || DEFAULTS.cobertura_objetivo_sem,
    lead_total_sem: Number(row.lead_total_sem) || DEFAULTS.lead_total_sem,
    semanas_analisis: Number(row.semanas_analisis) || DEFAULTS.semanas_analisis,
    nivel_servicio_pct: Number(row.nivel_servicio_pct) || DEFAULTS.nivel_servicio_pct,
  }
}

export async function guardarConfig(patch: Partial<RepoConfig>): Promise<RepoConfig> {
  const row = await db('reposicion_config').orderBy('id').first()
  const data = { ...patch, updated_at: db.fn.now() }
  if (row) await db('reposicion_config').where('id', row.id).update(data)
  else await db('reposicion_config').insert(patch)
  return obtenerConfig()
}

// z para niveles de servicio comunes (cuantil normal). Interpola linealmente.
const TABLA_Z: [number, number][] = [
  [80, 0.8416], [85, 1.0364], [90, 1.2816], [91, 1.3408], [92, 1.4051], [93, 1.4758],
  [94, 1.5548], [95, 1.6449], [96, 1.7507], [97, 1.8808], [98, 2.0537], [99, 2.3263], [99.5, 2.5758],
]
function zServicio(pct: number): number {
  const p = Math.max(80, Math.min(99.5, pct))
  for (let i = 0; i < TABLA_Z.length - 1; i++) {
    const [p0, z0] = TABLA_Z[i]
    const [p1, z1] = TABLA_Z[i + 1]
    if (p >= p0 && p <= p1) return z0 + ((z1 - z0) * (p - p0)) / (p1 - p0)
  }
  return 1.6449
}

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
function lunesDe(f: Date): Date {
  const d = new Date(f.getFullYear(), f.getMonth(), f.getDate())
  const dow = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - dow)
  return d
}

export type EstadoRepo = 'urgente' | 'pronto' | 'ok' | 'exceso' | 'sin_demanda'

export interface FilaRepo {
  codigo: string
  nombre: string
  stock: number
  demandaSemanal: number
  sigma: number
  coberturaSem: number | null // null = sin demanda
  stockSeguridad: number
  puntoPedido: number
  sugeridoPedir: number
  fechaQuiebre: string | null
  pedirAntesDe: string | null
  estado: EstadoRepo
}

export interface ResumenRepo {
  config: RepoConfig
  actualizado: string | null
  filas: FilaRepo[]
  urgentes: number
  sinDatos: boolean
}

const sumaStock = (stock: unknown): number => {
  if (!stock || typeof stock !== 'object') return 0
  return Object.values(stock as Record<string, unknown>).reduce((s: number, v) => s + (Number(v) || 0), 0)
}

export async function calcularReposicion(): Promise<ResumenRepo> {
  const config = await obtenerConfig()
  const N = config.semanas_analisis
  const z = zServicio(config.nivel_servicio_pct)

  // Grilla de las últimas N semanas (lunes), incluyendo la semana en curso
  const base = lunesDe(new Date())
  const semanas: string[] = []
  for (let i = N - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(d.getDate() - i * 7)
    semanas.push(iso(d))
  }
  const idxSemana = new Map(semanas.map((s, i) => [s, i]))

  // Historia de demanda por SKU
  const ventas = await db('pp_ventas_sku')
    .whereIn('semana', semanas)
    .select('codigo', 'nombre', 'semana', 'unidades')
  const series = new Map<string, { nombre: string; arr: number[] }>()
  for (const v of ventas) {
    const key = String(v.codigo)
    let s = series.get(key)
    if (!s) {
      s = { nombre: v.nombre ?? key, arr: new Array(N).fill(0) }
      series.set(key, s)
    }
    const i = idxSemana.get(iso(new Date(v.semana)))
    if (i != null) s.arr[i] += Number(v.unidades) || 0
    if (v.nombre && (!s.nombre || s.nombre === key)) s.nombre = v.nombre
  }

  // Stock actual por SKU (productos activos)
  const productos = await db('pp_products').where('activo', true).select('codigo', 'nombre', 'stock')
  const stockPorSku = new Map<string, { nombre: string; stock: number }>()
  for (const p of productos) stockPorSku.set(String(p.codigo), { nombre: p.nombre, stock: sumaStock(p.stock) })

  const [last] = await db('sync_log').where('dataset', 'ventas_sku').orderBy('created_at', 'desc').limit(1)

  // Universo: productos activos + SKUs con ventas (aunque ya no estén activos)
  const codigos = new Set<string>([...stockPorSku.keys(), ...series.keys()])
  const filas: FilaRepo[] = []

  for (const codigo of codigos) {
    const prod = stockPorSku.get(codigo)
    const serie = series.get(codigo)
    const nombre = prod?.nombre ?? serie?.nombre ?? codigo
    const stock = prod?.stock ?? 0
    let arr = serie?.arr ?? new Array(N).fill(0)

    // Censura de quiebre: si hoy no hay stock, descarta la racha final de ceros
    if (stock <= 0) {
      let fin = arr.length
      while (fin > 0 && arr[fin - 1] === 0) fin--
      arr = arr.slice(0, fin)
    }

    // Demanda semanal = promedio de las últimas hasta 13 semanas sanas
    const ventana = arr.slice(-13)
    const n = ventana.length
    const demandaSemanal = n > 0 ? ventana.reduce((s, x) => s + x, 0) / n : 0

    if (demandaSemanal <= 0) {
      filas.push({
        codigo, nombre, stock, demandaSemanal: 0, sigma: 0, coberturaSem: null,
        stockSeguridad: 0, puntoPedido: 0, sugeridoPedir: 0, fechaQuiebre: null, pedirAntesDe: null,
        estado: 'sin_demanda',
      })
      continue
    }

    const media = demandaSemanal
    const sigma = n > 1 ? Math.sqrt(ventana.reduce((s, x) => s + (x - media) ** 2, 0) / (n - 1)) : 0
    const stockSeguridad = z * sigma * Math.sqrt(config.lead_total_sem)
    const puntoPedido = demandaSemanal * config.lead_total_sem + stockSeguridad
    const coberturaSem = demandaSemanal > 0 ? stock / demandaSemanal : null
    const sugeridoPedir = Math.max(0, Math.round(demandaSemanal * config.cobertura_objetivo_sem + stockSeguridad - stock))

    // Fechas: semana de quiebre (agotando el stock por encima del SS) y fecha
    // límite para pedir (restando el lead total).
    const semQuiebre = (stock - stockSeguridad) / demandaSemanal
    const hoy = new Date()
    const fechaQuiebre = new Date(hoy)
    fechaQuiebre.setDate(fechaQuiebre.getDate() + Math.round((stock / demandaSemanal) * 7))
    const pedir = new Date(hoy)
    pedir.setDate(pedir.getDate() + Math.round((semQuiebre - config.lead_total_sem) * 7))

    let estado: EstadoRepo
    if (stock <= puntoPedido) estado = 'urgente'
    else if (coberturaSem != null && coberturaSem < config.cobertura_objetivo_sem) estado = 'pronto'
    else if (coberturaSem != null && coberturaSem > config.cobertura_objetivo_sem * 2) estado = 'exceso'
    else estado = 'ok'

    filas.push({
      codigo, nombre, stock,
      demandaSemanal: Math.round(demandaSemanal * 10) / 10,
      sigma: Math.round(sigma * 10) / 10,
      coberturaSem: coberturaSem != null ? Math.round(coberturaSem * 10) / 10 : null,
      stockSeguridad: Math.round(stockSeguridad),
      puntoPedido: Math.round(puntoPedido),
      sugeridoPedir,
      fechaQuiebre: iso(fechaQuiebre),
      pedirAntesDe: iso(pedir),
      estado,
    })
  }

  // Orden: primero lo más urgente (menor cobertura); "sin demanda" al final
  const rank: Record<EstadoRepo, number> = { urgente: 0, pronto: 1, ok: 2, exceso: 3, sin_demanda: 4 }
  filas.sort((a, b) => {
    if (rank[a.estado] !== rank[b.estado]) return rank[a.estado] - rank[b.estado]
    const ca = a.coberturaSem ?? Infinity
    const cb = b.coberturaSem ?? Infinity
    return ca - cb
  })

  return {
    config,
    actualizado: last?.created_at ?? null,
    filas,
    urgentes: filas.filter((f) => f.estado === 'urgente').length,
    sinDatos: filas.every((f) => f.estado === 'sin_demanda'),
  }
}
