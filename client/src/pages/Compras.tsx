import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { bs, bsUsd, etiquetaTasa, useTasa } from '../lib/moneda'

interface Resumen {
  porMes: { mes: string; monto: number; montoUsd: number; docs: number }[]
  porProveedor: { proveedor: string; monto: number; montoUsd: number; docs: number }[]
  porCategoria: { categoria: string; monto: number }[]
  ultimas: { fecha: string; documento: string | null; proveedor: string; categoria: string | null; montoUsd: number; montoUsdReal: number; moneda: string }[]
  cxp: {
    proveedores: { proveedor: string; moneda: string; saldo: number; saldoUsd: number; vencido: number; vencidoUsd: number; peorDiasVencido: number; documentos: number }[]
    totales: { saldo: number; saldoUsd: number; vencido: number; vencidoUsd: number }
  }
  actualizadoCompras: string | null
  actualizadoCxp: string | null
}

const usd = (n: number) => bs(n)
const usd2 = (n: number, m = 'Bs') => bs(n, m)
const mesLabel = (m: string) => {
  const [y, mm] = m.split('-')
  return new Date(Number(y), Number(mm) - 1, 1).toLocaleDateString('es-VE', { month: 'short', year: '2-digit' })
}

export function Compras() {
  const [data, setData] = useState<Resumen | null>(null)
  const [error, setError] = useState<string | null>(null)
  const tasa = useTasa()

  useEffect(() => {
    api.get<Resumen>('/compras/resumen').then(setData).catch((e) => setError(e instanceof Error ? e.message : 'Error'))
  }, [])

  if (error) return <div className="fade-up"><p className="subtitle">{error}</p></div>
  if (!data) return null

  const sinCompras = data.porMes.length === 0
  const sinCxp = data.cxp.proveedores.length === 0
  const totalCompras = data.porMes.reduce((s, m) => s + m.monto, 0)
  const totalComprasUsd = data.porMes.reduce((s, m) => s + (m.montoUsd ?? 0), 0)
  const maxMes = Math.max(1, ...data.porMes.map((m) => m.monto))
  const maxProv = Math.max(1, ...data.porProveedor.map((p) => p.monto))
  const colsCxp = '2fr 1fr 1fr 0.8fr 0.8fr'
  const colsUlt = '0.9fr 1fr 2fr 1fr'

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 className="h1-module">Compras &amp; Por Pagar</h1>
        <p className="subtitle">
          El lado del gasto, desde Profit (Bs).{' '}
          {data.actualizadoCompras ? `Compras actualizadas ${new Date(data.actualizadoCompras).toLocaleString('es-VE')}.` : 'Sin compras sincronizadas aún.'} · {etiquetaTasa(tasa)}
        </p>
      </div>

      {sinCompras && sinCxp ? (
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div className="cell-sub">
            No hay datos de compras ni de Cuentas por Pagar. Se cargan por el puente de datos desde Profit
            con <code>sync_compras.py</code> y <code>sync_cxp.py</code> (ver docs/puente-datos.md).
          </div>
        </div>
      ) : (
        <>
          <div className="kpi-grid-auto">
            <div className="card card-kpi">
              <div className="field-label">Compras del período ({data.porMes.length} meses)</div>
              <div className="kpi-value" style={{ fontSize: 17 }}>{bsUsd(totalCompras, totalComprasUsd)}</div>
            </div>
            <div className="card card-kpi">
              <div className="field-label">Por pagar a proveedores</div>
              <div className="kpi-value" style={{ fontSize: 17 }}>{bsUsd(data.cxp.totales.saldo, data.cxp.totales.saldoUsd)}</div>
            </div>
            <div className="card card-kpi">
              <div className="field-label">Vencido con proveedores</div>
              <div className="kpi-value" style={{ fontSize: 17, color: data.cxp.totales.vencido > 0 ? 'var(--danger-500)' : 'var(--success-600)' }}>
                {bsUsd(data.cxp.totales.vencido, data.cxp.totales.vencidoUsd)}
              </div>
            </div>
          </div>

          {!sinCompras && (
            <div className="card" style={{ padding: 22 }}>
              <div className="h3-card" style={{ marginBottom: 16 }}>Compras por mes</div>
              <div className="bars-scroll">
                <div className="bars" style={{ minWidth: data.porMes.length * 56 }}>
                  {data.porMes.map((m) => (
                    <div key={m.mes} className="bar-col">
                      <span className="bar-val">{usd(m.monto)}</span>
                      <div className="bar-fill" style={{ height: `${(m.monto / maxMes) * 100}%`, background: 'linear-gradient(180deg,var(--accent-500),var(--brand-800))' }} />
                      <span className="caption">{mesLabel(m.mes)}</span>
                      <span className="caption">{m.docs} doc{m.docs === 1 ? '' : 's'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!sinCompras && (
            <div className="ds-2col">
              <div className="card" style={{ overflow: 'hidden' }}>
                <div className="card-header"><div className="h3-card">Top proveedores</div><span className="caption">por monto comprado</span></div>
                {data.porProveedor.map((p, i) => (
                  <div key={i} style={{ padding: '11px 20px', borderTop: '1px solid var(--line-soft)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span className="cell-main">{p.proveedor}</span>
                      <span className="cell-strong">{usd(p.monto)}<span className="caption"> · {p.docs} doc{p.docs === 1 ? '' : 's'}</span></span>
                    </div>
                    <div style={{ height: 6, background: 'var(--line-soft)', borderRadius: 3 }}>
                      <div style={{ width: `${(p.monto / maxProv) * 100}%`, height: '100%', background: 'var(--accent-500)', borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ overflow: 'hidden' }}>
                <div className="card-header"><div className="h3-card">Últimas compras</div></div>
                <div className="table-scroll">
                  <div>
                    <div className="table-head" style={{ gridTemplateColumns: colsUlt }}>
                      <span>Fecha</span><span>Documento</span><span>Proveedor</span><span>Monto</span>
                    </div>
                    {data.ultimas.map((u, i) => (
                      <div key={i} className="table-row" style={{ gridTemplateColumns: colsUlt, cursor: 'default' }}>
                        <span className="cell-sub">{new Date(u.fecha).toLocaleDateString('es-VE')}</span>
                        <span className="cell-sub">{u.documento ?? '—'}</span>
                        <span className="cell-main">{u.proveedor}</span>
                        <span className="cell-strong">{usd2(u.montoUsd, u.moneda)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!sinCxp && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header">
                <div className="h3-card">Cuentas por Pagar por proveedor</div>
                <span className="caption">
                  más vencido primero{data.actualizadoCxp ? ` · actualizado ${new Date(data.actualizadoCxp).toLocaleString('es-VE')}` : ''}
                </span>
              </div>
              <div className="table-scroll">
                <div className="table-min-760">
                  <div className="table-head" style={{ gridTemplateColumns: colsCxp }}>
                    <span>Proveedor</span><span>Saldo</span><span>Vencido</span><span>Docs</span><span>Días</span>
                  </div>
                  {data.cxp.proveedores.map((p, i) => (
                    <div key={i} className="table-row" style={{ gridTemplateColumns: colsCxp, cursor: 'default' }}>
                      <span className="cell-main">{p.proveedor}</span>
                      <span className="cell-strong">{usd2(p.saldo, p.moneda)}</span>
                      <span style={{ font: '700 13px var(--font-ui)', color: p.vencido > 0 ? 'var(--danger-500)' : 'var(--ink-300)' }}>
                        {p.vencido > 0 ? usd2(p.vencido, p.moneda) : '—'}
                      </span>
                      <span className="cell-sub">{p.documentos}</span>
                      <span>
                        {p.peorDiasVencido > 0 ? (
                          <span className="badge" style={{ background: 'var(--danger-soft)', color: 'var(--danger-500)' }}>{p.peorDiasVencido}d</span>
                        ) : (
                          <span className="badge" style={{ background: 'var(--success-soft)', color: 'var(--success-600)' }}>al día</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
