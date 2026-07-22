import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { montoDual, etiquetaTasa, useTasa } from '../lib/moneda'

interface ClienteCxc {
  cliente: string
  moneda: string
  saldo: number
  vencido: number
  documentos: number
  peorDiasVencido: number
}
interface Data {
  clientes: ClienteCxc[]
  totales: { saldo: number; vencido: number }
  actualizado: string | null
}

const fmt = (n: number, m = 'USD') => `${m} ${n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function CuentasPorCobrar() {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<string | null>(null)
  const tasa = useTasa()

  useEffect(() => {
    api.get<Data>('/cxc').then(setData).catch((e) => setError(e instanceof Error ? e.message : 'Error'))
  }, [])

  if (error) return <div className="fade-up"><p className="subtitle">{error}</p></div>
  if (!data) return null

  const vacio = data.clientes.length === 0
  const cols = '2fr 1fr 1fr 0.8fr 0.8fr'

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 className="h1-module">Cuentas por Cobrar</h1>
        <p className="subtitle">
          Saldos reales de Profit por cliente. {data.actualizado ? `Actualizado ${new Date(data.actualizado).toLocaleString('es-VE')}.` : 'Sin datos sincronizados aún.'} · {etiquetaTasa(tasa)}
        </p>
      </div>

      {vacio ? (
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div className="cell-sub">
            No hay datos de Cuentas por Cobrar. Se cargan por el puente de datos desde Profit (ver docs/puente-datos.md).
          </div>
        </div>
      ) : (
        <>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="card card-kpi">
              <div className="field-label">Saldo total por cobrar</div>
              <div className="kpi-value" style={{ fontSize: 20 }}>{montoDual(data.totales.saldo, tasa)}</div>
            </div>
            <div className="card card-kpi">
              <div className="field-label">Vencido</div>
              <div className="kpi-value" style={{ fontSize: 20, color: data.totales.vencido > 0 ? 'var(--danger-500)' : 'var(--success-600)' }}>{montoDual(data.totales.vencido, tasa)}</div>
            </div>
            <div className="card card-kpi">
              <div className="field-label">Clientes con saldo</div>
              <div className="kpi-value">{data.clientes.length}</div>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header"><div className="h3-card">Por cliente</div><span className="caption">más vencido primero</span></div>
            <div className="table-scroll">
              <div className="table-min-760">
                <div className="table-head" style={{ gridTemplateColumns: cols }}>
                  <span>Cliente</span><span>Saldo</span><span>Vencido</span><span>Docs</span><span>Días</span>
                </div>
                {data.clientes.map((c, i) => (
                  <div key={i} className="table-row" style={{ gridTemplateColumns: cols, cursor: 'default' }}>
                    <span className="cell-main">{c.cliente}</span>
                    <span className="cell-strong">{fmt(c.saldo, c.moneda)}</span>
                    <span style={{ font: '700 13px var(--font-ui)', color: c.vencido > 0 ? 'var(--danger-500)' : 'var(--ink-300)' }}>
                      {c.vencido > 0 ? fmt(c.vencido, c.moneda) : '—'}
                    </span>
                    <span className="cell-sub">{c.documentos}</span>
                    <span>
                      {c.peorDiasVencido > 0 ? (
                        <span className="badge" style={{ background: 'var(--danger-soft)', color: 'var(--danger-500)' }}>{c.peorDiasVencido}d</span>
                      ) : (
                        <span className="badge" style={{ background: 'var(--success-soft)', color: 'var(--success-600)' }}>al día</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
