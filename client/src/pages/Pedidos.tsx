import { useCallback, useEffect, useState } from 'react'
import { ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'
import { useAuth } from '../lib/auth'

const ETAPAS = ['Recibido', 'CXC', 'Facturación', 'Logística', 'En Ruta', 'Entregado'] as const
type Etapa = (typeof ETAPAS)[number]
const norm = (s: string | null | undefined) => (s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
const idxEtapa = (estado: string | null) => ETAPAS.findIndex((e) => norm(e) === norm(estado))

interface Resumen { porEstado: { estado: string; n: number }[] }
interface Pedido { numero: string; cliente: string; vendedor: string | null; estado: string | null; fecha_pedido: string | null; monto_usd: number | string | null }

const fFecha = (s: string | null) => (s ? new Date(String(s).slice(0, 10) + 'T12:00:00').toLocaleDateString('es-VE', { day: '2-digit', month: 'short' }) : '—')
const usd = (n: number | string | null) => (n == null ? '—' : `$${Number(n).toLocaleString('es-VE', { maximumFractionDigits: 0 })}`)

export function Pedidos() {
  const { user } = useAuth()
  const toast = useToast()
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [etapa, setEtapa] = useState<Etapa | ''>('')
  const [ocupado, setOcupado] = useState('')

  const cargarResumen = useCallback(() => { api.get<Resumen>('/operacion/resumen').then(setResumen).catch(() => {}) }, [])
  const cargarPedidos = useCallback(() => {
    const p = etapa ? `?estado=${encodeURIComponent(etapa)}` : ''
    api.get<{ pedidos: Pedido[] }>(`/operacion/pedidos${p}`).then((r) => setPedidos(r.pedidos)).catch(() => {})
  }, [etapa])
  useEffect(() => { cargarResumen() }, [cargarResumen])
  useEffect(() => { cargarPedidos() }, [cargarPedidos])

  const puedeMover = user && (user.rol === 'admin' || user.rol === 'cxc' || user.rol === 'despacho')

  const conteo = (e: Etapa) => resumen?.porEstado.filter((p) => norm(p.estado) === norm(e)).reduce((s, p) => s + p.n, 0) ?? 0

  async function mover(ped: Pedido, dir: 1 | -1) {
    const i = idxEtapa(ped.estado)
    const destino = ETAPAS[i + dir]
    if (i < 0 || !destino) return
    setOcupado(ped.numero)
    try {
      await api.patch(`/operacion/pedidos/${ped.numero}/estado`, { estado: destino })
      toast(`${ped.numero}: ${destino}`)
      cargarResumen(); cargarPedidos()
    } catch (e) {
      toast(e instanceof Error ? e.message : 'No se pudo mover')
    } finally {
      setOcupado('')
    }
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <p className="subtitle" style={{ margin: 0 }}>Flujo de pedidos por etapa. Avanza cada pedido a medida que se procesa (Recibido → Entregado).</p>
        <button className="btn btn-secondary" onClick={() => { cargarResumen(); cargarPedidos() }}><RefreshCw size={15} strokeWidth={2.4} /> Actualizar</button>
      </div>

      {/* Embudo por etapa (clic para filtrar) */}
      <div className="bars-scroll">
        <div style={{ display: 'flex', gap: 8, minWidth: 620 }}>
          <button className={`btn ${etapa === '' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '8px 12px', fontSize: 12.5 }} onClick={() => setEtapa('')}>
            Todos <b>({resumen?.porEstado.reduce((s, p) => s + p.n, 0) ?? 0})</b>
          </button>
          {ETAPAS.map((e) => (
            <button key={e} className={`btn ${etapa === e ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '8px 12px', fontSize: 12.5, whiteSpace: 'nowrap' }} onClick={() => setEtapa(e)}>
              {e} <b>({conteo(e)})</b>
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-scroll">
          <table className="tabla-datos" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr style={{ font: '700 11px var(--font-ui)', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: 0.5, background: '#f3f8fd' }}>
                <th style={{ textAlign: 'left', padding: '9px 12px' }}>Pedido</th>
                <th style={{ textAlign: 'left', padding: '9px 8px' }}>Cliente</th>
                <th style={{ textAlign: 'left', padding: '9px 8px' }}>Etapa</th>
                <th style={{ textAlign: 'right', padding: '9px 8px' }}>Monto</th>
                <th style={{ textAlign: 'center', padding: '9px 12px' }}>Mover</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => {
                const i = idxEtapa(p.estado)
                return (
                  <tr key={p.numero} style={{ borderTop: '1px solid var(--line-soft)' }}>
                    <td style={{ padding: '9px 12px' }}>
                      <div className="cell-id">{p.numero}</div>
                      <div className="caption">{fFecha(p.fecha_pedido)}{p.vendedor ? ` · ${p.vendedor}` : ''}</div>
                    </td>
                    <td style={{ padding: '9px 8px' }} className="cell-main">{p.cliente}</td>
                    <td style={{ padding: '9px 8px' }}><span className="badge" style={{ background: i === 5 ? 'var(--success-soft)' : 'var(--info-soft)', color: i === 5 ? 'var(--success-600)' : 'var(--info-fg)' }}>{p.estado ?? '—'}</span></td>
                    <td style={{ padding: '9px 8px', textAlign: 'right' }} className="cell-strong">{usd(p.monto_usd)}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {puedeMover ? (
                        <>
                          <button className="btn btn-secondary" style={{ padding: '5px 8px' }} title="Retroceder" disabled={i <= 0 || ocupado === p.numero} onClick={() => mover(p, -1)}><ChevronLeft size={14} /></button>
                          <button className="btn btn-primary" style={{ padding: '5px 8px', marginLeft: 6 }} title="Avanzar" disabled={i < 0 || i >= 5 || ocupado === p.numero} onClick={() => mover(p, 1)}><ChevronRight size={14} /></button>
                        </>
                      ) : '—'}
                    </td>
                  </tr>
                )
              })}
              {pedidos.length === 0 && <tr><td colSpan={5} style={{ padding: 20 }} className="cell-sub">No hay pedidos en esta etapa.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
