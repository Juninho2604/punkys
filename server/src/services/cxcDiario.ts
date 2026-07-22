import { db } from '../db/knex.js'
import { normalizarNombre } from './normalize.js'
import { notifier } from '../notifications/index.js'
import { obtenerTasa } from './tasaCambio.js'
import { config } from '../config.js'

// Correo diario de Cuentas por Cobrar por vendedor. Réplica mejorada de la
// función `enviarCxcDiario` de la intranet-Sheets del cliente:
//  - Agrupa la cartera del vendedor POR CLIENTE (se llama al cliente, no a la
//    factura), el más vencido primero; a igual antigüedad, el que más debe.
//  - Antigüedad: 1–30, 31–60, +60 días, y "vence en 7 días" (a cobrar esta semana).
//  - Créditos a favor (saldo < 0) pegados al mismo grupo del cliente.
//  - Notas de cobranza colaborativas por cliente (tabla cxc_notas).
// Mejora nuestra: montos en Bs con equivalente USD a la tasa BCV.

interface DocCxc {
  cliente: string; cliente_norm: string; vendedor: string | null
  documento: string | null; saldo: number; dias: number
}
interface Grupo {
  cliente: string; cliente_norm: string; docs: DocCxc[]; creds: DocCxc[]
  saldo: number; venc: number; cred: number; maxDias: number
}
export interface ReporteVendedor {
  vendedor: string; vendedorNorm: string; correo: string | null; cc: string | null
  totSaldo: number; totVenc: number; totCred: number
  aging: { d30: number; d60: number; d60p: number }; vence7: number
  grupos: Grupo[]
}

const m0 = (n: number) => Math.round(n).toLocaleString('es-VE')
const m2 = (n: number) => n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const esc = (s: string) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))

// ── Construir los reportes por vendedor desde pp_cxc + notas + correos ───────
export async function construirReportes(soloVendedor?: string): Promise<ReporteVendedor[]> {
  const docs = (await db('pp_cxc').select('cliente', 'cliente_norm', 'vendedor', 'documento', 'saldo', 'dias_vencido as dias')) as any[]
  const [overrides, usuarios, notasRaw] = await Promise.all([
    db('cxc_vendedor_correo').where('activo', true),
    db('users').whereIn('rol', ['vendedor', 'cxc']).andWhere('activo', true).select('nombre', 'email'),
    db('cxc_notas').orderBy('created_at', 'desc'),
  ])

  const correoDe = new Map<string, { correo: string; cc: string | null }>()
  for (const o of overrides) correoDe.set(o.vendedor_norm, { correo: o.correo, cc: o.cc ?? null })
  const usuarioCorreo = new Map<string, string>()
  for (const u of usuarios) usuarioCorreo.set(normalizarNombre(u.nombre), u.email)

  const notasDe = new Map<string, { texto: string; autor: string; fecha: string }[]>()
  for (const n of notasRaw as any[]) {
    const arr = notasDe.get(n.cliente_norm) ?? []
    if (arr.length < 3) arr.push({ texto: n.texto, autor: n.autor_nombre ?? '', fecha: n.created_at })
    notasDe.set(n.cliente_norm, arr)
  }

  // Agrupar por vendedor
  const porVen = new Map<string, DocCxc[]>()
  for (const d of docs) {
    if (!Number(d.saldo)) continue
    const ven = (d.vendedor ?? '').trim() || 'Sin vendedor'
    const arr = porVen.get(ven) ?? []
    arr.push({ ...d, saldo: Number(d.saldo), dias: Number(d.dias) })
    porVen.set(ven, arr)
  }

  const reportes: ReporteVendedor[] = []
  for (const [ven, todos] of porVen) {
    const vNorm = normalizarNombre(ven)
    if (soloVendedor && vNorm !== normalizarNombre(soloVendedor)) continue
    const conDeuda = todos.filter((x) => x.saldo > 0)
    const creds = todos.filter((x) => x.saldo < 0)
    if (!conDeuda.length && !creds.length) continue

    const aging = { d30: 0, d60: 0, d60p: 0 }
    let vence7 = 0
    for (const x of conDeuda) {
      const dd = x.dias, s = x.saldo
      if (dd > 60) aging.d60p += s
      else if (dd > 30) aging.d60 += s
      else if (dd > 0) aging.d30 += s
      else if (dd >= -7) vence7 += s
    }

    const gmap = new Map<string, Grupo>()
    const grupo = (x: DocCxc) => {
      let g = gmap.get(x.cliente_norm)
      if (!g) { g = { cliente: x.cliente, cliente_norm: x.cliente_norm, docs: [], creds: [], saldo: 0, venc: 0, cred: 0, maxDias: -99999 }; gmap.set(x.cliente_norm, g) }
      return g
    }
    for (const x of conDeuda) { const g = grupo(x); g.docs.push(x); g.saldo += x.saldo; if (x.dias > 0) g.venc += x.saldo; if (x.dias > g.maxDias) g.maxDias = x.dias }
    for (const x of creds) { const g = grupo(x); g.creds.push(x); g.cred += -x.saldo }

    const grupos = [...gmap.values()]
      .filter((g) => g.docs.length)
      .sort((a, b) => b.maxDias - a.maxDias || b.saldo - a.saldo)

    const c = correoDe.get(vNorm)
    reportes.push({
      vendedor: ven,
      vendedorNorm: vNorm,
      correo: c?.correo ?? usuarioCorreo.get(vNorm) ?? null,
      cc: c?.cc ?? null,
      totSaldo: conDeuda.reduce((s, x) => s + x.saldo, 0),
      totVenc: conDeuda.reduce((s, x) => s + (x.dias > 0 ? x.saldo : 0), 0),
      totCred: creds.reduce((s, x) => s - x.saldo, 0),
      aging, vence7,
      grupos: grupos.map((g) => ({ ...g, notas: notasDe.get(g.cliente_norm) ?? [] } as any)),
    })
  }
  // Notas se anexan como propiedad extra en grupos (para el HTML)
  return reportes.sort((a, b) => b.totVenc - a.totVenc)
}

// ── HTML del correo de un vendedor ───────────────────────────────────────────
export function htmlReporte(r: ReporteVendedor, tasaValor: number, moneda: string, hoy: string): string {
  const usd = (n: number) => (tasaValor > 0 ? ` <span style="color:#94a3b8">(≈ $${m0(n / tasaValor)})</span>` : '')
  const chip = (label: string, val: number, color: string) =>
    val > 0 ? `<span style="display:inline-block;margin:2px 6px 2px 0;padding:3px 9px;border-radius:20px;background:${color}1a;color:${color};font:700 12px system-ui">${label}: ${moneda} ${m0(val)}</span>` : ''

  const filas = r.grupos.map((g: any) => {
    const notas = (g.notas as any[]).map((n) => `<div style="color:#475569;font-size:12px;margin-top:3px">📝 ${esc(n.texto)}${n.autor ? ` <span style="color:#94a3b8">— ${esc(n.autor)}</span>` : ''}</div>`).join('')
    const cred = g.cred > 0 ? ` · <span style="color:#0369a1">a favor ${moneda} ${m0(g.cred)}</span>` : ''
    const venc = g.venc > 0 ? ` · <span style="color:#b91c1c">vencido <b>${moneda} ${m0(g.venc)}</b></span>` : ''
    return `<tr><td style="padding:9px 12px;border-top:1px solid #e2e8f0">
      <div style="font:700 14px system-ui;color:#0f172a">${esc(g.cliente)}</div>
      <div style="color:#64748b;font-size:12px">${g.docs.length} doc${g.docs.length > 1 ? 's' : ''} · total <b>${moneda} ${m0(g.saldo)}</b>${venc}${cred} · ${g.maxDias > 0 ? g.maxDias + ' días el más viejo' : 'al día'}</div>
      ${notas}
    </td></tr>`
  }).join('')

  return `<div style="max-width:640px;margin:0 auto;font-family:system-ui,Segoe UI,Arial;color:#0f172a">
    <div style="background:#0b2a5b;color:#fff;padding:16px 20px;border-radius:12px 12px 0 0">
      <div style="font:800 18px system-ui">Cuentas por Cobrar — ${esc(r.vendedor)}</div>
      <div style="color:#a9c3ec;font-size:13px">${hoy} · tu cartera para gestionar hoy</div>
    </div>
    <div style="background:#f8fafc;padding:14px 20px;border:1px solid #e2e8f0;border-top:0">
      <div style="font:800 20px system-ui">Total por cobrar: ${moneda} ${m0(r.totSaldo)}${usd(r.totSaldo)}</div>
      <div style="margin-top:8px">
        ${chip('Vence en 7 días', r.vence7, '#0369a1')}
        ${chip('1–30 días', r.aging.d30, '#ca8a04')}
        ${chip('31–60 días', r.aging.d60, '#ea580c')}
        ${chip('+60 días', r.aging.d60p, '#b91c1c')}
        ${r.totCred > 0 ? chip('A favor del cliente', r.totCred, '#0369a1') : ''}
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;overflow:hidden">
      ${filas}
    </table>
    <div style="color:#94a3b8;font-size:11px;margin-top:10px;text-align:center">Punky Partners · generado por la intranet</div>
  </div>`
}

function textoReporte(r: ReporteVendedor, moneda: string): string {
  const l = [`CxC — ${r.vendedor}`, `Total por cobrar: ${moneda} ${m2(r.totSaldo)} · vencido ${moneda} ${m2(r.totVenc)}`, '']
  for (const g of r.grupos as any[]) l.push(`- ${g.cliente}: ${moneda} ${m2(g.saldo)}${g.venc > 0 ? ` (vencido ${moneda} ${m2(g.venc)})` : ''}${g.maxDias > 0 ? ` · ${g.maxDias}d` : ''}`)
  return l.join('\n')
}

// ── Enviar (o previsualizar) el CxC diario ───────────────────────────────────
export async function enviarCxcDiario(opts: { soloVendedor?: string; dryRun?: boolean } = {}): Promise<{
  ok: boolean; total: number; enviados: number; sinCorreo: string[]; detalle: { vendedor: string; correo: string | null; estado: string; totSaldo: number }[]; previewHtml?: string
}> {
  const tasa = await obtenerTasa()
  const moneda = config.profitPlus.replica.moneda
  const hoy = new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' })
  const reportes = await construirReportes(opts.soloVendedor)

  const detalle: { vendedor: string; correo: string | null; estado: string; totSaldo: number }[] = []
  const sinCorreo: string[] = []
  let enviados = 0
  let previewHtml: string | undefined

  for (const r of reportes) {
    const html = htmlReporte(r, tasa.valor, moneda, hoy)
    if (!previewHtml) previewHtml = html
    if (!r.correo) { sinCorreo.push(r.vendedor); detalle.push({ vendedor: r.vendedor, correo: null, estado: 'sin-correo', totSaldo: r.totSaldo }); continue }
    if (opts.dryRun) { detalle.push({ vendedor: r.vendedor, correo: r.correo, estado: 'previsualizado', totSaldo: r.totSaldo }); continue }
    const to = r.cc ? `${r.correo},${r.cc}` : r.correo
    const estado = await notifier.emailHtml(to, `CxC diario — ${r.vendedor} (${hoy})`, html, textoReporte(r, moneda), { evento: 'cxc_diario', ref: r.vendedorNorm })
    if (estado !== 'error') enviados++
    detalle.push({ vendedor: r.vendedor, correo: r.correo, estado, totSaldo: r.totSaldo })
  }
  return { ok: true, total: reportes.length, enviados, sinCorreo, detalle, previewHtml }
}

// ── Scheduler diario a las 7am (hora del servidor) ───────────────────────────
export function iniciarCxcDiario(): void {
  const hora = Number(process.env.CXC_DIARIO_HORA ?? 7)
  const programar = () => {
    const ahora = new Date()
    const prox = new Date(ahora)
    prox.setHours(hora, 0, 0, 0)
    if (prox <= ahora) prox.setDate(prox.getDate() + 1)
    const ms = prox.getTime() - ahora.getTime()
    setTimeout(async () => {
      try {
        const r = await enviarCxcDiario()
        console.log(`📧 [CxC diario] ${r.enviados}/${r.total} enviados${r.sinCorreo.length ? ` · sin correo: ${r.sinCorreo.join(', ')}` : ''}`)
      } catch (err) {
        console.error('⚠️ [CxC diario] error:', err instanceof Error ? err.message : err)
      }
      programar()
    }, ms)
  }
  programar()
  console.log(`📧 [CxC diario] Programado todos los días a las ${hora}:00 (hora del servidor)`)
}
