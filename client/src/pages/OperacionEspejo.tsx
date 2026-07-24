import { useEffect, useState } from 'react'
import { RefreshCw, Search, X } from 'lucide-react'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'

interface Resumen { pedidos: number; estados: number; logistica: number; fletes: number; contactos: number; importado: string | null; porEstado: { estado: string; n: number }[] }
interface PedidoRow { numero: string; cliente: string; vendedor: string | null; estado: string | null; fecha_pedido: string | null; monto_usd: number | string | null; origen: string | null; almacen: string | null }
interface Reng { id: number; cantidad: number | string | null; descripcion: string }
interface EstadoRow { id: number; ts: string | null; estado_anterior: string | null; estado_nuevo: string | null; usuario: string | null }
interface Detalle { pedido: Record<string, unknown>; renglones: Reng[]; estados: EstadoRow[]; logistica: Record<string, unknown> | null }

const fFecha = (s: string | null) => (s ? new Date(String(s).slice(0, 10) + 'T12:00:00').toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: '2-digit' }) : '—')
const usd = (n: number | string | null) => (n == null ? '—' : `$${Number(n).toLocaleString('es-VE', { maximumFractionDigits: 2 })}`)

export function OperacionEspejo() {
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [pedidos, setPedidos] = useState<PedidoRow[]>([])
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const [sel, setSel] = useState<Detalle | null>(null)
  const [recargando, setRecargando] = useState(false)
  const toast = useToast()

  const cargarResumen = () => api.get<Resumen>('/operacion/resumen').then(setResumen).catch(() => {})
  const cargarPedidos = () => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (estado) p.set('estado', estado)
    api.get<{ pedidos: PedidoRow[] }>(`/operacion/pedidos?${p}`).then((r) => setPedidos(r.pedidos)).catch(() => {})
  }
  useEffect(() => { void cargarResumen() }, [])
  useEffect(() => { const t = setTimeout(cargarPedidos, 250); return () => clearTimeout(t) }, [q, estado])

  async function abrir(numero: string) {
    try { setSel(await api.get<Detalle>(`/operacion/pedidos/${numero}`)) } catch (e) { toast(e instanceof Error ? e.message : 'Error') }
  }
  async function recargarSnapshot() {
    setRecargando(true)
    try {
      const r = await api.post<{ ok: boolean; pedidos: number; vacio?: boolean }>('/sync/snapshot')
      toast(r.vacio ? 'El snapshot está vacío' : `Importado ✓ (${r.pedidos} pedidos)`)
      cargarResumen(); cargarPedidos()
    } catch (e) { toast(e instanceof Error ? e.message : 'No se pudo importar') } finally { setRecargando(false) }
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <p className="subtitle" style={{ margin: 0, maxWidth: 620 }}>
          Espejo de solo lectura de la operación que el cliente lleva en sus Google Sheets (pedidos, estados, logística, fletes y contactos), copiada a nuestra base SQL.
          {resumen?.importado ? ` Última importación: ${new Date(resumen.importado).toLocaleString('es-VE')}.` : ''}
        </p>
        <button className="btn btn-secondary" onClick={recargarSnapshot} disabled={recargando}>
          <RefreshCw size={15} strokeWidth={2.4} /> {recargando ? 'Importando…' : 'Recargar snapshot'}
        </button>
      </div>

      {resumen && (
        <div className="kpi-grid-auto">
          {[['Pedidos', resumen.pedidos], ['Cambios de estado', resumen.estados], ['Logística', resumen.logistica], ['Fletes', resumen.fletes], ['Contactos', resumen.contactos]].map(([l, n]) => (
            <div key={l as string} className="card card-kpi">
              <div className="field-label">{l as string}</div>
              <div className="kpi-value">{Number(n).toLocaleString('es-VE')}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="header-search" style={{ display: 'flex' }}>
          <Search size={15} strokeWidth={2.4} color="var(--ink-300)" />
          <input placeholder="Buscar cliente, número, vendedor…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input-text" style={{ width: 'auto', padding: '8px 12px' }} value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {resumen?.porEstado.map((s) => <option key={s.estado} value={s.estado}>{s.estado} ({s.n})</option>)}
        </select>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-scroll">
          <table className="tabla-datos" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ font: '700 11px var(--font-ui)', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: 0.5, background: '#f3f8fd' }}>
                <th style={{ textAlign: 'left', padding: '9px 12px' }}># Pedido</th>
                <th style={{ textAlign: 'left', padding: '9px 8px' }}>Cliente</th>
                <th style={{ textAlign: 'left', padding: '9px 8px' }}>Vendedor</th>
                <th style={{ textAlign: 'left', padding: '9px 8px' }}>Estado</th>
                <th style={{ textAlign: 'center', padding: '9px 8px' }}>Fecha</th>
                <th style={{ textAlign: 'right', padding: '9px 12px' }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.numero} style={{ borderTop: '1px solid var(--line-soft)', cursor: 'pointer' }} onClick={() => abrir(p.numero)}>
                  <td style={{ padding: '9px 12px' }} className="cell-id">{p.numero}</td>
                  <td style={{ padding: '9px 8px' }} className="cell-main">{p.cliente}</td>
                  <td style={{ padding: '9px 8px' }} className="cell-sub">{p.vendedor ?? '—'}</td>
                  <td style={{ padding: '9px 8px' }}><span className="badge" style={{ background: 'var(--neutral-soft)', color: 'var(--ink-500)' }}>{p.estado ?? '—'}</span></td>
                  <td style={{ padding: '9px 8px', textAlign: 'center' }} className="cell-sub">{fFecha(p.fecha_pedido)}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right' }} className="cell-strong">{usd(p.monto_usd)}</td>
                </tr>
              ))}
              {pedidos.length === 0 && <tr><td colSpan={6} style={{ padding: 20 }} className="cell-sub">Sin pedidos. Si acabas de desplegar, usa "Recargar snapshot".</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {sel && <PedidoDrawer d={sel} onClose={() => setSel(null)} />}
    </div>
  )
}

function PedidoDrawer({ d, onClose }: { d: Detalle; onClose: () => void }) {
  const p = d.pedido as Record<string, any>
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560, maxHeight: '86vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Pedido {p.numero}</h3>
          <button className="header-logout" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="caption" style={{ marginBottom: 12 }}>{p.cliente} · {p.vendedor ?? '—'} · {p.estado ?? '—'} · {usd(p.monto_usd)}</div>

        <div style={{ font: '800 13px var(--font-display)', color: 'var(--brand-900)', margin: '6px 0' }}>Renglones</div>
        {d.renglones.length ? d.renglones.map((r) => (
          <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--line-soft)', fontSize: 13 }}>
            <span>{r.descripcion}</span><span className="cell-strong">{r.cantidad ?? '—'}</span>
          </div>
        )) : <div className="cell-sub">{p.productos ?? 'Sin renglones'}</div>}

        <div style={{ font: '800 13px var(--font-display)', color: 'var(--brand-900)', margin: '14px 0 6px' }}>Historial de estados</div>
        {d.estados.length ? d.estados.map((e) => (
          <div key={e.id} style={{ fontSize: 12.5, padding: '3px 0', color: 'var(--ink-500)' }}>
            <b style={{ color: 'var(--ink-900)' }}>{e.estado_anterior ?? '—'} → {e.estado_nuevo ?? '—'}</b> · {e.ts ?? ''} {e.usuario ? `· ${e.usuario}` : ''}
          </div>
        )) : <div className="cell-sub">Sin historial.</div>}

        {d.logistica && (
          <>
            <div style={{ font: '800 13px var(--font-display)', color: 'var(--brand-900)', margin: '14px 0 6px' }}>Logística</div>
            <div className="caption" style={{ lineHeight: 1.7 }}>
              Destino: {String(d.logistica.destino ?? '—')} ({String(d.logistica.ciudad_destino ?? '—')}) · Transporte: {String(d.logistica.tipo_transporte ?? d.logistica.transporte ?? '—')} · Ruta: {String(d.logistica.ruta ?? '—')}<br />
              Kilos: {String(d.logistica.kilos ?? '—')} · Und PP/Fable: {String(d.logistica.unidades_pp ?? '—')}/{String(d.logistica.unidades_fable ?? '—')} · Estado: {String(d.logistica.estado_despacho ?? '—')}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
