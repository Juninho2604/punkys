import { db } from '../db/knex.js'
import { obtenerTasa } from './tasaCambio.js'

// Servicio de Tesorería: posición de caja consolidada (Bs + USD) y proyección
// de flujo de caja semanal. Adaptación nativa del sistema CFO del cliente.

export interface SaldoBanco {
  id: number
  nombre: string
  moneda: string
  numero: string | null
  saldo: number // en la moneda del banco
  saldoBs: number // equivalente en Bs (a la tasa de hoy)
  saldoUsd: number // equivalente en USD (a la tasa de hoy)
  movimientos: number
}

export interface Posicion {
  tasa: number
  bancos: SaldoBanco[]
  totalBs: number
  totalUsd: number
  totalEnBancosBs: number // saldo de las cuentas en Bs (sin convertir)
  totalEnBancosUsd: number // saldo de las cuentas en USD (sin convertir)
}

const num = (v: unknown) => Number(v ?? 0)

// Convierte un monto a Bs y USD según su moneda y una tasa Bs/USD.
function equivalentes(monto: number, moneda: string, tasa: number): { bs: number; usd: number } {
  if (moneda === 'USD') return { bs: tasa > 0 ? monto * tasa : 0, usd: monto }
  return { bs: monto, usd: tasa > 0 ? monto / tasa : 0 }
}

const r2 = (n: number) => Math.round(n * 100) / 100

export async function posicion(): Promise<Posicion> {
  const tasa = (await obtenerTasa()).valor
  const bancos = await db('bancos').where('activo', true).orderBy(['orden', 'id'])

  // Saldo por banco = Σ ingresos − Σ egresos (en la moneda del banco)
  const agregados = (await db('mov_tesoreria')
    .select('banco_id')
    .select(db.raw("sum(case when tipo = 'ingreso' then monto else -monto end) as saldo"))
    .count({ movimientos: '*' })
    .groupBy('banco_id')) as Array<{ banco_id: number; saldo: string | number; movimientos: string | number }>
  const porBanco = new Map<number, { saldo: number; movimientos: number }>()
  for (const a of agregados) porBanco.set(Number(a.banco_id), { saldo: num(a.saldo), movimientos: num(a.movimientos) })

  const saldos: SaldoBanco[] = bancos.map((b) => {
    const ag = porBanco.get(b.id) ?? { saldo: 0, movimientos: 0 }
    const eq = equivalentes(ag.saldo, b.moneda, tasa)
    return {
      id: b.id,
      nombre: b.nombre,
      moneda: b.moneda,
      numero: b.numero ?? null,
      saldo: r2(ag.saldo),
      saldoBs: r2(eq.bs),
      saldoUsd: r2(eq.usd),
      movimientos: ag.movimientos,
    }
  })

  return {
    tasa,
    bancos: saldos,
    totalBs: r2(saldos.reduce((s, b) => s + b.saldoBs, 0)),
    totalUsd: r2(saldos.reduce((s, b) => s + b.saldoUsd, 0)),
    totalEnBancosBs: r2(saldos.filter((b) => b.moneda === 'Bs').reduce((s, b) => s + b.saldo, 0)),
    totalEnBancosUsd: r2(saldos.filter((b) => b.moneda === 'USD').reduce((s, b) => s + b.saldo, 0)),
  }
}

export interface SemanaFlujo {
  semana: number // 0..N-1
  desde: string // YYYY-MM-DD (lunes)
  hasta: string // YYYY-MM-DD (domingo)
  entradasBs: number
  entradasUsd: number
  salidasBs: number
  salidasUsd: number
  saldoFinalBs: number
  saldoFinalUsd: number
  negativo: boolean
}

export interface Proyeccion {
  tasa: number
  inicioBs: number
  inicioUsd: number
  semanas: SemanaFlujo[]
  entradasTotalBs: number
  salidasTotalBs: number
  primeraSemanaNegativa: number | null
}

// Lunes de la semana de una fecha (00:00, hora local del servidor = Venezuela)
function lunesDe(f: Date): Date {
  const d = new Date(f.getFullYear(), f.getMonth(), f.getDate())
  const dow = (d.getDay() + 6) % 7 // 0 = lunes
  d.setDate(d.getDate() - dow)
  return d
}
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const addDias = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

// Índice de semana (0..N-1) de una fecha respecto al lunes base. Fechas
// pasadas (vencido) caen en la semana 0 (se esperan de inmediato).
function indiceSemana(fecha: string, base: Date, n: number): number | null {
  const f = new Date(fecha)
  if (Number.isNaN(f.getTime())) return null
  const dias = Math.floor((f.getTime() - base.getTime()) / 86_400_000)
  if (dias < 0) return 0
  const idx = Math.floor(dias / 7)
  return idx < n ? idx : null
}

export async function proyeccion(semanas = 12): Promise<Proyeccion> {
  const pos = await posicion()
  const tasa = pos.tasa
  const base = lunesDe(new Date())

  const buckets: SemanaFlujo[] = Array.from({ length: semanas }, (_, i) => ({
    semana: i,
    desde: iso(addDias(base, i * 7)),
    hasta: iso(addDias(base, i * 7 + 6)),
    entradasBs: 0,
    entradasUsd: 0,
    salidasBs: 0,
    salidasUsd: 0,
    saldoFinalBs: 0,
    saldoFinalUsd: 0,
    negativo: false,
  }))

  // Entradas esperadas: cobranza de la cartera real (pp_cxc) por vencimiento.
  const cxc = await db('pp_cxc').where('saldo', '>', 0).select('fecha_venc', 'saldo', 'saldo_usd')
  for (const c of cxc) {
    if (!c.fecha_venc) continue
    const idx = indiceSemana(String(c.fecha_venc).slice(0, 10), base, semanas)
    if (idx == null) continue
    buckets[idx].entradasBs += num(c.saldo)
    buckets[idx].entradasUsd += num(c.saldo_usd)
  }

  // Salidas esperadas: compromisos de pago no pagados por vencimiento.
  const comp = await db('compromisos_pago').where('pagado', false).select('fecha_venc', 'monto', 'moneda')
  for (const c of comp) {
    if (!c.fecha_venc) continue
    const idx = indiceSemana(String(c.fecha_venc).slice(0, 10), base, semanas)
    if (idx == null) continue
    const eq = equivalentes(num(c.monto), c.moneda, tasa)
    buckets[idx].salidasBs += eq.bs
    buckets[idx].salidasUsd += eq.usd
  }

  // Balance acumulado desde la posición actual
  let corridaBs = pos.totalBs
  let corridaUsd = pos.totalUsd
  let primeraNeg: number | null = null
  for (const s of buckets) {
    corridaBs += s.entradasBs - s.salidasBs
    corridaUsd += s.entradasUsd - s.salidasUsd
    s.entradasBs = r2(s.entradasBs)
    s.entradasUsd = r2(s.entradasUsd)
    s.salidasBs = r2(s.salidasBs)
    s.salidasUsd = r2(s.salidasUsd)
    s.saldoFinalBs = r2(corridaBs)
    s.saldoFinalUsd = r2(corridaUsd)
    s.negativo = corridaBs < 0
    if (s.negativo && primeraNeg == null) primeraNeg = s.semana
  }

  return {
    tasa,
    inicioBs: pos.totalBs,
    inicioUsd: pos.totalUsd,
    semanas: buckets,
    entradasTotalBs: r2(buckets.reduce((s, b) => s + b.entradasBs, 0)),
    salidasTotalBs: r2(buckets.reduce((s, b) => s + b.salidasBs, 0)),
    primeraSemanaNegativa: primeraNeg,
  }
}
