import Anthropic from '@anthropic-ai/sdk'
import { db } from '../db/knex.js'
import { config } from '../config.js'
import { obtenerTasa } from './tasaCambio.js'
import { notifier } from '../notifications/index.js'

// Reporte ejecutivo del negocio para el dueño (Owner). Reúne los números clave
// de Profit (ventas, cobranzas, cartera, compras) + los pedidos de la intranet
// y arma un reporte DETERMINISTA (KPIs, tendencia, alertas) — sin depender de
// ningún servicio de pago. Si además hay ANTHROPIC_API_KEY, se le agrega arriba
// una narrativa redactada por IA, pero es opcional: el reporte vale por sí solo.

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

// ── Análisis determinista (sin IA): titular, variación y alertas por reglas ───
type Nivel = 'alta' | 'media' | 'info'
interface Analisis {
  titular: string
  variacionVentasPct: number | null
  carteraVencidaPct: number
  alertas: { nivel: Nivel; texto: string }[]
}

const bs0 = (n: number) => 'Bs ' + n.toLocaleString('es-VE', { maximumFractionDigits: 0 })
const usd0 = (n: number) => '$' + n.toLocaleString('es-VE', { maximumFractionDigits: 0 })
const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(0)}%`

function analizar(m: Metricas): Analisis {
  const n = m.ventasPorMes.length
  const ult = m.ventasPorMes[n - 1]
  const prev = n >= 2 ? m.ventasPorMes[n - 2] : undefined
  const variacionVentasPct = prev && prev.bs > 0 ? ((ult.bs - prev.bs) / prev.bs) * 100 : null
  const carteraVencidaPct = m.cxc.saldoBs > 0 ? (m.cxc.vencidoBs / m.cxc.saldoBs) * 100 : 0
  const pendientes = m.pedidosSemana.find((p) => p.estado === 'pendiente')?.n ?? 0

  const alertas: { nivel: Nivel; texto: string }[] = []
  if (carteraVencidaPct >= 30)
    alertas.push({ nivel: 'alta', texto: `Cartera vencida alta: ${carteraVencidaPct.toFixed(0)}% de la cartera (${bs0(m.cxc.vencidoBs)}) está vencida. Priorizar cobranza.` })
  else if (carteraVencidaPct >= 15)
    alertas.push({ nivel: 'media', texto: `Cartera vencida en ${carteraVencidaPct.toFixed(0)}% (${bs0(m.cxc.vencidoBs)}). Vigilar de cerca.` })

  if (variacionVentasPct != null && variacionVentasPct <= -15)
    alertas.push({ nivel: 'alta', texto: `Las ventas cayeron ${pct(variacionVentasPct)} respecto al mes anterior.` })
  else if (variacionVentasPct != null && variacionVentasPct >= 15)
    alertas.push({ nivel: 'info', texto: `Buen mes: las ventas crecieron ${pct(variacionVentasPct)} respecto al mes anterior.` })

  if (m.comprasMesBs > 0 && m.deudaProveedoresBs > m.comprasMesBs * 1.5)
    alertas.push({ nivel: 'media', texto: `La deuda a proveedores (${bs0(m.deudaProveedoresBs)}) supera 1.5× las compras del mes. Revisar el calendario de pagos.` })

  if (pendientes > 0)
    alertas.push({ nivel: 'info', texto: `Hay ${pendientes} pedido(s) pendiente(s) de aprobación esta semana.` })

  if (!alertas.length) alertas.push({ nivel: 'info', texto: 'Sin alertas: los indicadores están dentro de rango normal.' })

  const titularVentas = variacionVentasPct != null ? ` (${pct(variacionVentasPct)} vs. mes anterior)` : ''
  const titular = `Ventas del último mes: ${bs0(ult?.bs ?? 0)}${titularVentas}. Cartera por cobrar ${bs0(m.cxc.saldoBs)}, de la cual ${carteraVencidaPct.toFixed(0)}% está vencida.`

  return { titular, variacionVentasPct, carteraVencidaPct, alertas }
}

// Texto plano (para el cuerpo alterno del correo y vista sin formato)
function textoReporte(m: Metricas, a: Analisis): string {
  const eqUsd = (bs: number) => (m.tasaBcv > 0 ? ` (≈ ${usd0(bs / m.tasaBcv)})` : '')
  return [
    a.titular,
    '',
    `• Cartera por cobrar: ${bs0(m.cxc.saldoBs)}${eqUsd(m.cxc.saldoBs)} · vencida: ${bs0(m.cxc.vencidoBs)} (${a.carteraVencidaPct.toFixed(0)}%)`,
    `• Cobranzas últimos 15 días: ${bs0(m.cobranzas15d.bs)} (${m.cobranzas15d.documentos} docs)`,
    `• Compras del mes: ${bs0(m.comprasMesBs)} · deuda a proveedores: ${bs0(m.deudaProveedoresBs)}`,
    `• Pedidos de la semana: ${m.pedidosSemana.map((p) => `${p.estado}: ${p.n}`).join(' · ') || 'ninguno'}`,
    '',
    'Alertas:',
    ...a.alertas.map((al) => `• ${al.texto}`),
  ].join('\n')
}

// ── HTML del correo (compatible con clientes de correo: tablas + estilos inline) ─
const AZUL = '#153C87'
const NIVEL_COLOR: Record<Nivel, { fg: string; bg: string }> = {
  alta: { fg: '#c0392b', bg: '#fbe9e8' },
  media: { fg: '#8a6d1a', bg: '#fbf1dd' },
  info: { fg: '#1a3f8f', bg: '#e9f1fc' },
}

function kpiCell(label: string, valor: string, sub?: string): string {
  return `<td style="padding:10px 12px;border:1px solid #e2e8f0;vertical-align:top">
    <div style="font:700 11px Arial;color:#64748b;text-transform:uppercase;letter-spacing:.4px">${label}</div>
    <div style="font:800 18px Arial;color:${AZUL};margin-top:3px">${valor}</div>
    ${sub ? `<div style="font:600 11px Arial;color:#94a3b8;margin-top:1px">${sub}</div>` : ''}
  </td>`
}

function htmlReporte(m: Metricas, a: Analisis, narrativa?: string): string {
  const fecha = new Date(m.generadoISO).toLocaleString('es-VE')
  const eqUsd = (bs: number) => (m.tasaBcv > 0 ? usd0(bs / m.tasaBcv) : '')
  const ult = m.ventasPorMes[m.ventasPorMes.length - 1]

  const maxVenta = Math.max(1, ...m.ventasPorMes.map((v) => v.bs))
  const filasVentas = m.ventasPorMes
    .map((v) => {
      const w = Math.round((v.bs / maxVenta) * 150)
      return `<tr>
        <td style="padding:4px 8px;font:600 12px Arial;color:#334155">${v.mes}</td>
        <td style="padding:4px 8px;font:700 12px Arial;color:#0f172a;text-align:right;white-space:nowrap">${bs0(v.bs)}</td>
        <td style="padding:4px 8px;width:160px"><div style="height:10px;width:${w}px;background:${AZUL};border-radius:3px"></div></td>
      </tr>`
    })
    .join('')

  const filasVend = m.topVendedores
    .map(
      (v) => `<tr>
        <td style="padding:4px 8px;font:600 12px Arial;color:#334155">${v.vendedor}</td>
        <td style="padding:4px 8px;font:700 12px Arial;color:#0f172a;text-align:right">${bs0(v.bs)}</td>
      </tr>`,
    )
    .join('')

  const alertasHtml = a.alertas
    .map((al) => {
      const c = NIVEL_COLOR[al.nivel]
      return `<div style="background:${c.bg};color:${c.fg};border-radius:8px;padding:8px 12px;margin:0 0 6px;font:600 13px Arial">${al.texto.replace(/</g, '&lt;')}</div>`
    })
    .join('')

  const narrativaHtml = narrativa
    ? `<div style="background:#f8fafc;border-left:3px solid ${AZUL};padding:10px 14px;margin:0 0 16px">
        ${narrativa
          .split('\n')
          .map((l) => (l.trim() ? `<p style="margin:0 0 6px;font:15px/1.5 Arial;color:#0f172a">${l.replace(/</g, '&lt;')}</p>` : ''))
          .join('')}
      </div>`
    : `<p style="font:15px/1.5 Arial;color:#0f172a;margin:0 0 16px">${a.titular}</p>`

  return `<div style="font-family:Arial,sans-serif;color:#0f172a;max-width:660px">
    <div style="font:800 19px Arial;color:${AZUL}">Reporte ejecutivo · Punky Partners</div>
    <div style="color:#64748b;font-size:12px;margin:2px 0 16px">Generado ${fecha}${m.tasaBcv > 0 ? ` · Tasa BCV ${m.tasaBcv.toLocaleString('es-VE')} Bs/$` : ''}</div>

    ${narrativaHtml}

    <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;margin:0 0 18px">
      <tr>
        ${kpiCell('Ventas último mes', bs0(ult?.bs ?? 0), (m.tasaBcv > 0 ? '≈ ' + eqUsd(ult?.bs ?? 0) : '') + (a.variacionVentasPct != null ? ` · ${pct(a.variacionVentasPct)}` : ''))}
        ${kpiCell('Cartera por cobrar', bs0(m.cxc.saldoBs), `vencida ${a.carteraVencidaPct.toFixed(0)}%`)}
      </tr>
      <tr>
        ${kpiCell('Cobranzas 15 días', bs0(m.cobranzas15d.bs), `${m.cobranzas15d.documentos} documentos`)}
        ${kpiCell('Vencido con clientes', bs0(m.cxc.vencidoBs))}
      </tr>
      <tr>
        ${kpiCell('Compras del mes', bs0(m.comprasMesBs))}
        ${kpiCell('Deuda a proveedores', bs0(m.deudaProveedoresBs))}
      </tr>
    </table>

    <div style="font:800 14px Arial;color:${AZUL};margin:0 0 6px">Ventas por mes</div>
    <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;margin:0 0 18px">${filasVentas}</table>

    ${
      filasVend
        ? `<div style="font:800 14px Arial;color:${AZUL};margin:0 0 6px">Top vendedores</div>
    <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;margin:0 0 18px">${filasVend}</table>`
        : ''
    }

    <div style="font:800 14px Arial;color:${AZUL};margin:0 0 8px">Alertas y recomendaciones</div>
    ${alertasHtml}

    <div style="color:#94a3b8;font-size:11px;margin-top:18px;border-top:1px solid #e2e8f0;padding-top:8px">
      Generado automáticamente a partir de los datos de Profit y la intranet.${narrativa ? ' Incluye narrativa redactada por IA.' : ''}
    </div>
  </div>`
}

const SYSTEM = `Eres el analista financiero de Punky Partners, una distribuidora de productos para mascotas en Venezuela. Recibes métricas reales del ERP (Profit) y de la intranet. Escribe un RESUMEN EJECUTIVO en español (Venezuela) para el dueño del negocio.

Reglas:
- Los montos vienen en bolívares (Bs); la moneda contable es el Bs. Cuando ayude, agrega el equivalente en dólares dividiendo entre la tasa BCV que se te da.
- Sé concreto y accionable: destaca lo importante, señala riesgos (cartera vencida, caídas de ventas) y oportunidades. No inventes datos que no estén en las métricas.
- Estructura breve: 2-3 párrafos cortos. No repitas las cifras una por una (ya van en tarjetas aparte); interpreta y prioriza.
- Tono profesional pero cercano, directo, sin relleno. Máximo ~180 palabras. No uses tablas ni Markdown de encabezados.`

async function redactarConIA(m: Metricas): Promise<string> {
  const client = new Anthropic({ apiKey: config.ia.apiKey })
  const resp = await client.messages.create({
    model: config.ia.model,
    max_tokens: 1200,
    system: SYSTEM,
    messages: [{ role: 'user', content: `Métricas del negocio (JSON):\n${JSON.stringify(m, null, 2)}` }],
  })
  return resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()
}

export interface ReporteResultado {
  ok: boolean
  conIA: boolean
  titulo: string
  texto: string
  html: string
  metricas: Metricas
  alertas: { nivel: Nivel; texto: string }[]
  enviadoA?: string[]
  error?: string
}

export async function generarReporte(): Promise<ReporteResultado> {
  const metricas = await reunirMetricas()
  const analisis = analizar(metricas)

  let narrativa: string | undefined
  let conIA = false
  if (config.ia.habilitado) {
    try {
      narrativa = await redactarConIA(metricas)
      conIA = true
    } catch (err) {
      console.error('⚠️ [Reporte] IA no disponible, sigo con el reporte determinista:', err instanceof Error ? err.message : err)
    }
  }

  const titulo = `Reporte ejecutivo Punky · ${new Date(metricas.generadoISO).toLocaleDateString('es-VE')}`
  return {
    ok: true,
    conIA,
    titulo,
    texto: textoReporte(metricas, analisis),
    html: htmlReporte(metricas, analisis, narrativa),
    metricas,
    alertas: analisis.alertas,
  }
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
      void enviarReporte().catch((e) => console.error('⚠️ [Reporte]', e))
    }
  }, 60 * 60 * 1000)
  console.log(
    `📊 [Reporte] Reporte ejecutivo diario a las ${config.ia.reporteDiarioHora}:00${config.ia.habilitado ? ' · con narrativa IA' : ' · determinista (sin IA)'}`,
  )
}
