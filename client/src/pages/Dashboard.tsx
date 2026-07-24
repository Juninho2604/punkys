import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { fmtBs, hoyLargo } from '../lib/format'
import { bs, bsUsd, etiquetaTasa, useTasa } from '../lib/moneda'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { usePend } from '../components/Shell'
import type { DashboardData } from '../lib/types'
import { SERVICIO_NOMBRE } from './Cotizacion'

export function Dashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { refreshPend } = usePend()
  const [data, setData] = useState<DashboardData | null>(null)
  const tasa = useTasa()

  const cargar = useCallback(() => {
    api.get<DashboardData>('/dashboard').then(setData).catch(console.error)
  }, [])

  useEffect(cargar, [cargar])

  if (!user || !data) return null
  const { kpis } = data
  const puedeDecidir = user.rol === 'cxc' || user.rol === 'admin'
  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'

  async function decidir(id: number, accion: 'approve' | 'reject', numero: string) {
    try {
      await api.post(`/quotes/${id}/${accion}`)
      toast(accion === 'approve' ? `${numero} aprobada ✓` : `${numero} rechazada`)
      cargar()
      refreshPend()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo procesar')
    }
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 className="h1">¡{saludo}, {user.nombre.split(' ')[0]}!</h1>
        <p className="subtitle">Resumen operativo · {hoyLargo()}</p>
      </div>

      <div className="kpi-grid">
        <div className="card card-kpi">
          <div className="field-label">Ventas del mes</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>{bsUsd(kpis.ventasMesBs, kpis.ventasMesUsd)}</div>
          <div className="kpi-delta" style={{ color: 'var(--ink-500)' }}>{etiquetaTasa(tasa)}</div>
        </div>
        <div className="card card-kpi">
          <div className="field-label">Cartera por cobrar</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>{bsUsd(kpis.carteraBs, kpis.carteraUsd)}</div>
          <div className="kpi-delta" style={{ color: kpis.vencidoBs > 0 ? 'var(--danger-500)' : 'var(--success-600)' }}>
            {kpis.vencidoBs > 0 ? `Vencido: ${bs(kpis.vencidoBs)}` : 'Sin vencido'}
          </div>
        </div>
        <div className="card card-kpi">
          <div className="field-label">Pedidos activos</div>
          <div className="kpi-value">{kpis.pedidosActivos}</div>
          <div className="kpi-delta" style={{ color: 'var(--ink-500)' }}>En proceso (Recibido → En ruta)</div>
        </div>
        <div className="card card-kpi">
          <div className="field-label">Por aprobar (CxC)</div>
          <div className="kpi-value">{kpis.porAprobar}</div>
          <div className="kpi-delta" style={{ color: kpis.porAprobar > 0 ? 'var(--warning-600)' : 'var(--success-600)' }}>
            {kpis.porAprobar > 0 ? 'Requieren decisión' : 'Al día'}
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header">
            <div className="h3-card">Pedidos recientes</div>
            <Link to="/operacion-espejo" className="link">Ver todos →</Link>
          </div>
          <div className="table-scroll">
            <div className="table-min-560">
              <div className="table-head cols-envios">
                <span>Pedido</span><span>Cliente</span><span>Estado</span><span>Monto</span>
              </div>
              {data.recientes.length === 0 && (
                <div style={{ padding: '18px 20px' }} className="cell-sub">Aún no hay pedidos. Aparecen al importar la operación del cliente o al cotizar en la intranet.</div>
              )}
              {data.recientes.map((r) => (
                <div key={r.numero} className="table-row cols-envios" onClick={() => navigate('/operacion-espejo')}>
                  <span className="cell-id">{r.numero}</span>
                  <span className="cell-main">{r.cliente}</span>
                  <span><span className="badge" style={{ background: 'var(--neutral-soft)', color: 'var(--ink-500)' }}>{r.estado ?? '—'}</span></span>
                  <span className="cell-strong">{r.monto_usd != null ? `$${Number(r.monto_usd).toLocaleString('es-VE', { maximumFractionDigits: 0 })}` : '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header">
            <div className="h3-card">Por aprobar</div>
            {puedeDecidir && <Link to="/aprobaciones" className="link">Ver tablero →</Link>}
          </div>
          {data.pendientes.length === 0 && (
            <div style={{ padding: '18px 20px' }} className="cell-sub">No hay cotizaciones pendientes. 🐾</div>
          )}
          {data.pendientes.map((q) => (
            <div key={q.id} style={{ padding: '14px 20px', borderTop: '1px solid var(--line-soft)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="cell-id">{q.numero}</span>
                <span style={{ font: '800 13.5px var(--font-ui)', color: 'var(--ink-900)' }}>{fmtBs(q.total)}</span>
              </div>
              <div className="cell-sub">{q.razon_social} · {q.resumen ?? SERVICIO_NOMBRE[q.servicio ?? ''] ?? '—'}</div>
              {puedeDecidir && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-approve-soft" onClick={() => decidir(q.id, 'approve', q.numero)}>Aprobar</button>
                  <button className="btn-reject-soft" onClick={() => decidir(q.id, 'reject', q.numero)}>Rechazar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
