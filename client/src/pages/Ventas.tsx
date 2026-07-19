import { useEffect, useState } from 'react'
import { api } from '../lib/api'

interface Fila {
  monto: number
  margenPct: number | null
}
interface Resumen {
  hayMargen: boolean
  meses: string[]
  totalUsd: number
  totalMargenPct: number | null
  porMes: (Fila & { mes: string; unidades: number })[]
  porVendedor: (Fila & { vendedor: string })[]
  porCategoria: (Fila & { categoria: string })[]
  actualizado: string | null
}

const usd = (n: number) => `$ ${n.toLocaleString('es-VE', { maximumFractionDigits: 0 })}`
const mesLabel = (m: string) => {
  const [y, mm] = m.split('-')
  return new Date(Number(y), Number(mm) - 1, 1).toLocaleDateString('es-VE', { month: 'short', year: '2-digit' })
}

export function Ventas() {
  const [data, setData] = useState<Resumen | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get<Resumen>('/ventas/resumen').then(setData).catch((e) => setError(e instanceof Error ? e.message : 'Error'))
  }, [])

  if (error) return <div className="fade-up"><p className="subtitle">{error}</p></div>
  if (!data) return null

  const vacio = data.porMes.length === 0
  const maxMes = Math.max(1, ...data.porMes.map((m) => m.monto))
  const maxVend = Math.max(1, ...data.porVendedor.map((v) => v.monto))
  const maxCat = Math.max(1, ...data.porCategoria.map((c) => c.monto))

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 className="h1-module">Ventas Analítica</h1>
        <p className="subtitle">
          Ventas de Profit (USD){data.hayMargen ? ' con margen' : ''}. {data.actualizado ? `Actualizado ${new Date(data.actualizado).toLocaleString('es-VE')}.` : 'Sin datos sincronizados aún.'}
        </p>
      </div>

      {vacio ? (
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div className="cell-sub">No hay datos de ventas. Se cargan por el puente de datos desde Profit (ver docs/puente-datos.md).</div>
        </div>
      ) : (
        <>
          <div className="kpi-grid" style={{ gridTemplateColumns: data.hayMargen ? 'repeat(3,1fr)' : 'repeat(2,1fr)' }}>
            <div className="card card-kpi">
              <div className="field-label">Ventas del período ({data.meses.length} meses)</div>
              <div className="kpi-value" style={{ fontSize: 30 }}>{usd(data.totalUsd)}</div>
            </div>
            {data.hayMargen && (
              <div className="card card-kpi">
                <div className="field-label">Margen bruto</div>
                <div className="kpi-value" style={{ color: 'var(--success-600)' }}>{data.totalMargenPct ?? '—'}%</div>
              </div>
            )}
            <div className="card card-kpi">
              <div className="field-label">Meses con datos</div>
              <div className="kpi-value">{data.meses.length}</div>
            </div>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div className="h3-card" style={{ marginBottom: 16 }}>Ventas por mes</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 200, paddingBottom: 8 }}>
              {data.porMes.map((m) => (
                <div key={m.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ font: '700 12px var(--font-ui)', color: 'var(--ink-500)' }}>{usd(m.monto)}</span>
                  <div style={{ width: '100%', maxWidth: 70, height: `${(m.monto / maxMes) * 100}%`, minHeight: 4, background: 'linear-gradient(180deg,var(--brand-500),var(--brand-800))', borderRadius: '8px 8px 0 0' }} />
                  <span className="caption">{mesLabel(m.mes)}</span>
                  {data.hayMargen && m.margenPct != null && <span className="caption" style={{ color: 'var(--success-600)' }}>{m.margenPct}%</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="ds-2col">
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header"><div className="h3-card">Por vendedor</div></div>
              {data.porVendedor.map((v, i) => (
                <div key={i} style={{ padding: '11px 20px', borderTop: '1px solid var(--line-soft)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span className="cell-main">{v.vendedor}</span>
                    <span className="cell-strong">{usd(v.monto)}{data.hayMargen && v.margenPct != null && <span className="caption" style={{ color: 'var(--success-600)' }}> · {v.margenPct}%</span>}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--line-soft)', borderRadius: 3 }}>
                    <div style={{ width: `${(v.monto / maxVend) * 100}%`, height: '100%', background: 'var(--brand-500)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header"><div className="h3-card">Por categoría</div></div>
              {data.porCategoria.map((c, i) => (
                <div key={i} style={{ padding: '11px 20px', borderTop: '1px solid var(--line-soft)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span className="cell-main" style={{ textTransform: 'capitalize' }}>{c.categoria}</span>
                    <span className="cell-strong">{usd(c.monto)}{data.hayMargen && c.margenPct != null && <span className="caption" style={{ color: 'var(--success-600)' }}> · {c.margenPct}%</span>}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--line-soft)', borderRadius: 3 }}>
                    <div style={{ width: `${(c.monto / maxCat) * 100}%`, height: '100%', background: 'var(--accent-500)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
