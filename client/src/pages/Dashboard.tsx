import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { fmtBs, hoyLargo } from '../lib/format'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { usePend } from '../components/Shell'
import { Badge } from '../components/Badge'
import type { DashboardData } from '../lib/types'
import { SERVICIO_NOMBRE } from './Cotizacion'

export function Dashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { refreshPend } = usePend()
  const [data, setData] = useState<DashboardData | null>(null)

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
          <div className="field-label">Envíos activos</div>
          <div className="kpi-value">{kpis.enviosActivos}</div>
          <div className="kpi-delta" style={{ color: 'var(--success-600)' }}>▲ {kpis.enviosNuevosSemana} esta semana</div>
        </div>
        <div className="card card-kpi">
          <div className="field-label">Cotizaciones del mes</div>
          <div className="kpi-value">{kpis.cotizacionesMes}</div>
          <div className="kpi-delta" style={{ color: kpis.deltaCotizaciones !== null && kpis.deltaCotizaciones < 0 ? 'var(--danger-500)' : 'var(--success-600)' }}>
            {kpis.deltaCotizaciones === null ? 'Sin mes anterior' : `${kpis.deltaCotizaciones >= 0 ? '▲' : '▼'} ${Math.abs(kpis.deltaCotizaciones)}% vs. mes anterior`}
          </div>
        </div>
        <div className="card card-kpi">
          <div className="field-label">Por aprobar</div>
          <div className="kpi-value">{kpis.porAprobar}</div>
          <div className="kpi-delta" style={{ color: 'var(--warning-600)' }}>Requieren tu decisión</div>
        </div>
        <div className="card card-kpi">
          <div className="field-label">Entregas a tiempo</div>
          <div className="kpi-value">{kpis.entregasATiempo}%</div>
          <div className="kpi-delta" style={{ color: kpis.entregasATiempo < 96 ? 'var(--danger-500)' : 'var(--success-600)' }}>
            {kpis.entregasATiempo < 96 ? '▼ Bajo la meta (96%)' : '▲ En meta'}
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header">
            <div className="h3-card">Envíos recientes</div>
            <Link to="/despacho" className="link">Ver todos →</Link>
          </div>
          <div className="table-scroll">
            <div className="table-min-560">
              <div className="table-head cols-envios">
                <span>Envío</span><span>Cliente</span><span>Ruta</span><span>Estado</span>
              </div>
              {data.recientes.length === 0 && (
                <div style={{ padding: '18px 20px' }} className="cell-sub">Aún no hay envíos. Se crean automáticamente al aprobar una cotización.</div>
              )}
              {data.recientes.map((s) => (
                <div key={s.id} className="table-row cols-envios" onClick={() => navigate(`/despacho/${s.id}`)}>
                  <span className="cell-id">{s.numero}</span>
                  <span className="cell-main">{s.cliente}</span>
                  <span className="cell-sub">{s.origen.split('—')[0].trim()} → {s.destino_ciudad}</span>
                  <span><Badge estado={s.estado} /></span>
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
