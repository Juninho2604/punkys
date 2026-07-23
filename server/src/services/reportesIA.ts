import Anthropic from '@anthropic-ai/sdk'
import { db } from '../db/knex.js'
import { config } from '../config.js'
import { obtenerTasa } from './tasaCambio.js'
import { notifier } from '../notifications/index.js'

// Reportes ejecutivos redactados por IA (Claude). Reúne los números clave de
// Profit (ventas, cobranzas, cartera) + los pedidos de la intranet, y le pide a
// Claude un resumen ejecutivo en español, claro y accionable, para el dueño.
// Sin ANTHROPIC_API_KEY el módulo queda deshabilitado (los datos igual se ven).

interface Metricas {
  generadoISO: string
  tasaBcv: number
  ventasPorMes: { mes: string; bs: number; usd: number }[]
  topVendedores: { vendedor: string; bs: number }[]
  cxc: { saldoBs: number; vencidoBs: number; saldoUsd: number }
  cobranzas15d: { bs: number; documentos: number }
  pedidosSemana: { estado: string; n: number }[]
  comprasMesBs: number
  deudaProveedoresBs: number
}

// Fecha "hoy" sin depender de new Date() dentro de queries (se pasa a Postgres).
async function reunirMetricas(): Promise<Metricas> {
  const tasa = (await obtenerTasa()).valor || 0

  const ventas = await db('pp_ventas')
    .select('mes')
    .sum({ bs: 'monto_usd' })
    .sum({ usd: 'monto_usd_real' })
    .groupBy('mes')
    .orderBy('mes', 'desc')
    .limit(6)

  const vendedores = await db('pp_ventas')
    .select('vendedor')
    .sum({ bs: 'monto_usd' })
    .whereNotNull('vendedor')
    .groupBy('vendedor')
    .orderBy('bs', 'desc')
    .limit(5)

  const [cxc] = await db('pp_cxc')
    .sum({ saldoBs: 'saldo' })
    .sum({ saldoUsd: 'saldo_usd' })
    .sum({ vencidoBs: db.raw('case when dias_vencido > 0 and saldo > 0 then saldo else 0 end') })

  const [cob] = await db('pp_cobranzas')
    .sum({ bs: 'monto_usd' })
    .count({ documentos: 'id' })
    .where('fecha', '>=', db.raw("current_date - interval '15 days'"))

  const pedidos = await db('quotes')
    .select('estado')
    .count({ n: 'id' })
    .where('created_at', '>=', db.raw("current_date - interval '7 days'"))
    .groupBy('estado')

  const [compras] = await db('pp_compras')
    .sum({ bs: 'monto_usd' })
    .where('fecha', '>=', db.raw("date_trunc('month', current_date)"))

  const [cxp] = await db('pp_cxp').sum({ bs: 'saldo' })

  return {
    generadoISO: new Date().toISOString(),
    tasaBcv: tasa,
    ventasPorMes: ventas.map((v: any) => ({ mes: v.mes, bs: Number(v.bs ?? 0), usd: Number(v.usd ?? 0) })).reverse(),
    topVendedores: vendedores.map((v: any) => ({ vendedor: v.vendedor, bs: Number(v.bs ?? 0) })),
    cxc: {
      saldoBs: Number(cxc?.saldoBs ?? 0),
      vencidoBs: Number(cxc?.vencidoBs ?? 0),
      saldoUsd: Number(cxc?.saldoUsd ?? 0),
    },
    cobranzas15d: { bs: Number(cob?.bs ?? 0), documentos: Number(cob?.documentos ?? 0) },
    pedidosSemana: pedidos.map((p: any) => ({ estado: p.estado, n: Number(p.n) })),
    comprasMesBs: Number(compras?.bs ?? 0),
    deudaProveedoresBs: Number(cxp?.bs ?? 0),
  }
}

const SYSTEM = `Eres el analista financiero de Punky Partners, una distribuidora de productos para mascotas en Venezuela. Recibes métricas reales del ERP (Profit) y de la intranet. Escribe un RESUMEN EJECUTIVO en español (Venezuela) para el dueño del negocio.

Reglas:
- Los montos vienen en bolívares (Bs); la moneda contable es el Bs. Cuando ayude, agrega el equivalente en dólares dividiendo entre la tasa BCV que se te da.
- Sé concreto y accionable: destaca lo importante, señala riesgos (cartera vencida, caídas de ventas) y oportunidades. No inventes datos que no estén en las métricas.
- Estructura breve: (1) un párrafo de titular con lo más relevante; (2) viñetas de ventas, cobranzas y cartera; (3) 2-3 alertas o recomendaciones.
- Tono profesional pero cercano, directo, sin relleno. Máximo ~250 palabras. No uses tablas ni Markdown de encabezados; usa texto y viñetas simples con "•".`

async function redactarConIA(m: Metricas): Promise<string> {
  const client = new Anthropic({ apiKey: config.ia.apiKey })
  const resp = await client.messages.create({
    model: config.ia.model,
    max_tokens: 1500,
    system: SYSTEM,
    messages: [{ role: 'user', content: `Métricas del negocio (JSON):\n${JSON.stringify(m, null, 2)}` }],
  })
  return resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()
}

// Resumen de respaldo (sin IA): números crudos, por si no hay API key.
function resumenPlano(m: Metricas): string {
  const bs = (n: number) => 'Bs ' + n.toLocaleString('es-VE', { maximumFractionDigits: 0 })
  const ult = m.ventasPorMes[m.ventasPorMes.length - 1]
  return [
    `Resumen (sin IA — configura ANTHROPIC_API_KEY para el análisis redactado):`,
    `• Ventas último mes (${ult?.mes ?? '—'}): ${bs(ult?.bs ?? 0)}`,
    `• Cartera por cobrar: ${bs(m.cxc.saldoBs)} · vencida: ${bs(m.cxc.vencidoBs)}`,
    `• Cobranzas últimos 15 días: ${bs(m.cobranzas15d.bs)} (${m.cobranzas15d.documentos} docs)`,
    `• Compras del mes: ${bs(m.comprasMesBs)} · deuda a proveedores: ${bs(m.deudaProveedoresBs)}`,
    `• Pedidos de la semana: ${m.pedidosSemana.map((p) => `${p.estado}: ${p.n}`).join(' · ') || 'ninguno'}`,
  ].join('\n')
}

function htmlReporte(texto: string, m: Metricas): string {
  const fecha = new Date(m.generadoISO).toLocaleString('es-VE')
  const cuerpo = texto
    .split('\n')
    .map((l) => (l.trim() ? `<p style="margin:0 0 8px">${l.replace(/</g, '&lt;')}</p>` : ''))
    .join('')
  return `<div style="font:15px/1.5 system-ui,Segoe UI,Arial;color:#0f172a;max-width:640px">
    <div style="font:800 18px system-ui;color:#0b2a5b">Reporte ejecutivo — Punky Partners</div>
    <div style="color:#64748b;font-size:12px;margin:2px 0 14px">Generado ${fecha} · Tasa BCV ${m.tasaBcv.toLocaleString('es-VE')} Bs/$</div>
    ${cuerpo}
    <div style="color:#94a3b8;font-size:11px;margin-top:16px;border-top:1px solid #e2e8f0;padding-top:8px">Redactado automáticamente a partir de los datos de Profit y la intranet.</div>
  </div>`
}

export interface ReporteResultado {
  ok: boolean
  conIA: boolean
  titulo: string
  texto: string
  html: string
  metricas: Metricas
  enviadoA?: string[]
  error?: string
}

export async function generarReporte(): Promise<ReporteResultado> {
  const metricas = await reunirMetricas()
  let texto: string
  let conIA = false
  if (config.ia.habilitado) {
    try {
      texto = await redactarConIA(metricas)
      conIA = true
    } catch (err) {
      console.error('⚠️ [Reportes IA] Error al redactar con Claude:', err instanceof Error ? err.message : err)
      texto = resumenPlano(metricas)
    }
  } else {
    texto = resumenPlano(metricas)
  }
  const titulo = `Reporte ejecutivo Punky · ${new Date(metricas.generadoISO).toLocaleDateString('es-VE')}`
  return { ok: true, conIA, titulo, texto, html: htmlReporte(texto, metricas), metricas }
}

// Genera y envía el reporte por correo a los administradores (Owner).
export async function enviarReporte(dryRun = false): Promise<ReporteResultado> {
  const r = await generarReporte()
  if (dryRun) return r
  const admins = await db('users').where({ rol: 'admin', activo: true }).select('email')
  const destinos = admins.map((a) => a.email).filter(Boolean)
  for (const to of destinos) {
    await notifier.emailHtml(to, r.titulo, r.html, r.texto, { evento: 'reporte_ejecutivo' })
  }
  return { ...r, enviadoA: destinos }
}

// Programa el reporte diario a la hora configurada (revisa cada hora).
export function iniciarReportesIA(): void {
  let ultimoDia = ''
  setInterval(() => {
    const ahora = new Date()
    const dia = ahora.toISOString().slice(0, 10)
    if (ahora.getHours() === config.ia.reporteDiarioHora && dia !== ultimoDia) {
      ultimoDia = dia
      void enviarReporte().catch((e) => console.error('⚠️ [Reportes IA]', e))
    }
  }, 60 * 60 * 1000)
  console.log(
    `🧠 [Reportes IA] ${config.ia.habilitado ? 'Activo' : 'Sin API key (solo resumen plano)'} · diario a las ${config.ia.reporteDiarioHora}:00`,
  )
}
