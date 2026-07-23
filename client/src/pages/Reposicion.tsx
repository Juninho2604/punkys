import { useEffect, useState } from 'react'
import { PackageSearch, Settings2, AlertTriangle, RefreshCw } from 'lucide-react'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'

interface RepoConfig { cobertura_objetivo_sem: number; lead_total_sem: number; semanas_analisis: number; nivel_servicio_pct: number }
type Estado = 'urgente' | 'pronto' | 'ok' | 'exceso' | 'sin_demanda'
interface Fila {
  codigo: string; nombre: string; stock: number; demandaSemanal: number; sigma: number
  coberturaSem: number | null; stockSeguridad: number; puntoPedido: number; sugeridoPedir: number
  fechaQuiebre: string | null; pedirAntesDe: string | null; estado: Estado
}
interface Resumen { config: RepoConfig; actualizado: string | null; filas: Fila[]; urgentes: number; sinDatos: boolean }

const nf = new Intl.NumberFormat('es-VE', { maximumFractionDigits: 0 })
const nf1 = new Intl.NumberFormat('es-VE', { maximumFractionDigits: 1 })
const fFecha = (s: string | null) => (s ? new Date(String(s).slice(0, 10) + 'T12:00:00').toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: '2-digit' }) : '—')

const ESTADO: Record<Estado, { label: string; c: string; b: string }> = {
  urgente: { label: 'Pedir ya', c: 'var(--danger-500)', b: 'var(--danger-soft)' },
  pronto: { label: 'Pedir pronto', c: 'var(--warning-600)', b: 'var(--warning-soft)' },
  ok: { label: 'OK', c: 'var(--success-600)', b: 'var(--success-soft)' },
  exceso: { label: 'Exceso', c: 'var(--info-fg)', b: 'var(--info-soft)' },
  sin_demanda: { label: 'Sin venta', c: 'var(--ink-500)', b: 'var(--neutral-soft)' },
}

export function Reposicion() {
  const [data, setData] = useState<Resumen | null>(null)
  const [cargando, setCargando] = useState(true)
  const [editandoConfig, setEditandoConfig] = useState(false)

  function cargar() {
    setCargando(true)
    api.get<Resumen>('/reposicion/resumen').then(setData).catch(() => {}).finally(() => setCargando(false))
  }
  useEffect(cargar, [])

  const cfg = data?.config

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 className="h1-module">Reposición · Compras</h1>
          <p className="subtitle">
            Pronóstico de demanda por producto, punto de pedido y fecha límite de compra.
            {data?.actualizado ? ` Datos al ${new Date(data.actualizado).toLocaleString('es-VE')}.` : ' Requiere la réplica de Profit sincronizada.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => setEditandoConfig(true)}><Settings2 size={15} strokeWidth={2.4} /> Parámetros</button>
          <button className="btn btn-secondary" onClick={cargar} disabled={cargando}><RefreshCw size={15} strokeWidth={2.4} /> Recalcular</button>
        </div>
      </div>

      {/* Parámetros vigentes */}
      {cfg && (
        <div className="card" style={{ padding: '12px 18px', display: 'flex', gap: 22, flexWrap: 'wrap', font: '600 12.5px var(--font-ui)', color: 'var(--ink-500)' }}>
          <span>Cobertura objetivo: <b style={{ color: 'var(--ink-900)' }}>{cfg.cobertura_objetivo_sem} sem</b></span>
          <span>Lead total (prod.+tránsito): <b style={{ color: 'var(--ink-900)' }}>{cfg.lead_total_sem} sem</b></span>
          <span>Ventana de análisis: <b style={{ color: 'var(--ink-900)' }}>{cfg.semanas_analisis} sem</b></span>
          <span>Nivel de servicio: <b style={{ color: 'var(--ink-900)' }}>{cfg.nivel_servicio_pct}%</b></span>
        </div>
      )}

      {!data ? (
        <div className="card" style={{ padding: 28, textAlign: 'center' }}><div className="cell-sub">{cargando ? 'Calculando…' : 'Sin datos.'}</div></div>
      ) : data.sinDatos || data.filas.length === 0 ? (
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div className="cell-sub">
            Aún no hay historia de ventas por producto. Se materializa desde la réplica de Profit
            (<code>pp_ventas_sku</code>) en modo réplica; verifica que el sync haya corrido.
          </div>
        </div>
      ) : (
        <>
          <div className="kpi-grid-auto">
            <div className="card card-kpi">
              <div className="field-label">Para pedir ya</div>
              <div className="kpi-value" style={{ color: data.urgentes > 0 ? 'var(--danger-500)' : 'var(--success-600)' }}>{data.urgentes}</div>
            </div>
            <div className="card card-kpi">
              <div className="field-label">Productos analizados</div>
              <div className="kpi-value">{data.filas.filter((f) => f.estado !== 'sin_demanda').length}</div>
            </div>
            <div className="card card-kpi">
              <div className="field-label">Pedir pronto</div>
              <div className="kpi-value" style={{ color: 'var(--warning-600)' }}>{data.filas.filter((f) => f.estado === 'pronto').length}</div>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div className="h3-card" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><PackageSearch size={16} strokeWidth={2.4} /> Plan de reposición</div>
              <span className="caption">lo más urgente primero</span>
            </div>
            <div className="table-scroll">
              <table className="tabla-datos" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                <thead>
                  <tr style={{ font: '700 11px var(--font-ui)', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: 0.5, background: '#f3f8fd' }}>
                    <th style={{ textAlign: 'left', padding: '9px 12px' }}>Producto</th>
                    <th style={{ textAlign: 'right', padding: '9px 8px' }}>Stock</th>
                    <th style={{ textAlign: 'right', padding: '9px 8px' }}>Demanda/sem</th>
                    <th style={{ textAlign: 'right', padding: '9px 8px' }}>Cobertura</th>
                    <th style={{ textAlign: 'right', padding: '9px 8px' }}>Sugerido</th>
                    <th style={{ textAlign: 'center', padding: '9px 8px' }}>Pedir antes</th>
                    <th style={{ textAlign: 'center', padding: '9px 12px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.filas.filter((f) => f.estado !== 'sin_demanda').map((f) => (
                    <tr key={f.codigo} style={{ borderTop: '1px solid var(--line-soft)' }}>
                      <td style={{ padding: '9px 12px' }}>
                        <div className="cell-main">{f.nombre}</div>
                        <div className="caption" style={{ fontFamily: 'monospace' }}>{f.codigo}</div>
                      </td>
                      <td style={{ padding: '9px 8px', textAlign: 'right' }} className="cell-sub">{nf.format(f.stock)}</td>
                      <td style={{ padding: '9px 8px', textAlign: 'right' }} className="cell-sub">{nf1.format(f.demandaSemanal)}</td>
                      <td style={{ padding: '9px 8px', textAlign: 'right', font: '700 12.5px var(--font-ui)', color: f.estado === 'urgente' ? 'var(--danger-500)' : 'var(--ink-900)' }}>
                        {f.coberturaSem != null ? `${nf1.format(f.coberturaSem)} sem` : '—'}
                      </td>
                      <td style={{ padding: '9px 8px', textAlign: 'right', font: '800 12.5px var(--font-ui)', color: f.sugeridoPedir > 0 ? 'var(--brand-900)' : 'var(--ink-300)' }}>
                        {f.sugeridoPedir > 0 ? nf.format(f.sugeridoPedir) : '—'}
                      </td>
                      <td style={{ padding: '9px 8px', textAlign: 'center' }} className="cell-sub">{fFecha(f.pedirAntesDe)}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                        <span className="badge" style={{ background: ESTADO[f.estado].b, color: ESTADO[f.estado].c }}>{ESTADO[f.estado].label}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="caption" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <AlertTriangle size={14} style={{ flex: 'none', marginTop: 2 }} />
            Estimación con promedio de las últimas ~13 semanas (con censura de quiebre) y stock de seguridad por nivel de servicio.
            El lead y la cobertura son parámetros globales editables; para afinar por proveedor/origen haría falta sumar el tránsito real por SKU.
          </p>
        </>
      )}

      {editandoConfig && cfg && <ConfigModal config={cfg} onClose={() => setEditandoConfig(false)} onDone={() => { setEditandoConfig(false); cargar() }} />}
    </div>
  )
}

function ConfigModal({ config, onClose, onDone }: { config: RepoConfig; onClose: () => void; onDone: () => void }) {
  const [f, setF] = useState(config)
  const [ocupado, setOcupado] = useState(false)
  const toast = useToast()
  const set = (k: keyof RepoConfig, v: number) => setF((s) => ({ ...s, [k]: v }))
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Parámetros de reposición</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="field"><label className="field-label">Cobertura objetivo por pedido (semanas)</label><input className="input-text" type="number" value={f.cobertura_objetivo_sem} onChange={(e) => set('cobertura_objetivo_sem', Number(e.target.value))} /></div>
          <div className="field"><label className="field-label">Lead total: producción + tránsito (semanas)</label><input className="input-text" type="number" value={f.lead_total_sem} onChange={(e) => set('lead_total_sem', Number(e.target.value))} /></div>
          <div className="field"><label className="field-label">Ventana de análisis (semanas de historia)</label><input className="input-text" type="number" value={f.semanas_analisis} onChange={(e) => set('semanas_analisis', Number(e.target.value))} /></div>
          <div className="field"><label className="field-label">Nivel de servicio (%)</label><input className="input-text" type="number" step="1" value={f.nivel_servicio_pct} onChange={(e) => set('nivel_servicio_pct', Number(e.target.value))} /></div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" disabled={ocupado} onClick={async () => {
              setOcupado(true)
              try { await api.put('/reposicion/config', f); toast('Parámetros guardados ✓'); onDone() }
              catch (err) { toast(err instanceof Error ? err.message : 'Error'); setOcupado(false) }
            }}>Guardar y recalcular</button>
          </div>
        </div>
      </div>
    </div>
  )
}
