import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'

interface Linea {
  id: number
  numero: string
  operadora: string | null
  departamento: string | null
  asignado_a: string | null
  plan: string | null
  monto: number | string | null
  moneda: string
  fecha_corte: string | null
  activo: boolean
  nota: string | null
}

const fFecha = (s: string | null) => (s ? new Date(String(s).slice(0, 10) + 'T12:00:00').toLocaleDateString('es-VE', { day: '2-digit', month: 'short' }) : '—')
const fMonto = (m: number | string | null, moneda: string) => (m == null || Number(m) === 0 ? '—' : `${moneda} ${Number(m).toLocaleString('es-VE', { maximumFractionDigits: 2 })}`)

export function Lineas() {
  const [lineas, setLineas] = useState<Linea[]>([])
  const [editar, setEditar] = useState<Linea | 'nueva' | null>(null)
  const toast = useToast()

  function cargar() {
    api.get<{ lineas: Linea[] }>('/lineas').then((r) => setLineas(r.lineas)).catch(() => {})
  }
  useEffect(cargar, [])

  async function borrar(l: Linea) {
    if (!window.confirm(`¿Eliminar la línea ${l.numero}?`)) return
    try {
      await api.del(`/lineas/${l.id}`)
      toast('Línea eliminada')
      cargar()
    } catch (e) {
      toast(e instanceof Error ? e.message : 'No se pudo eliminar')
    }
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <p className="subtitle" style={{ margin: 0, maxWidth: 560 }}>
          Control de líneas telefónicas por departamento: operadora, plan, fecha de corte y a quién está asignada.
        </p>
        <button className="btn btn-primary" onClick={() => setEditar('nueva')}><Plus size={15} strokeWidth={2.4} /> Nueva línea</button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {lineas.length === 0 ? (
          <div style={{ padding: 24 }} className="cell-sub">Aún no hay líneas registradas.</div>
        ) : (
          <div className="table-scroll">
            <table className="tabla-datos" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr style={{ font: '700 11px var(--font-ui)', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: 0.5, background: '#f3f8fd' }}>
                  <th style={{ textAlign: 'left', padding: '9px 12px' }}>Número</th>
                  <th style={{ textAlign: 'left', padding: '9px 8px' }}>Operadora</th>
                  <th style={{ textAlign: 'left', padding: '9px 8px' }}>Departamento</th>
                  <th style={{ textAlign: 'left', padding: '9px 8px' }}>Asignada a</th>
                  <th style={{ textAlign: 'left', padding: '9px 8px' }}>Plan</th>
                  <th style={{ textAlign: 'right', padding: '9px 8px' }}>Monto</th>
                  <th style={{ textAlign: 'center', padding: '9px 8px' }}>Corte</th>
                  <th style={{ padding: '9px 12px' }} />
                </tr>
              </thead>
              <tbody>
                {lineas.map((l) => (
                  <tr key={l.id} style={{ borderTop: '1px solid var(--line-soft)', opacity: l.activo ? 1 : 0.5 }}>
                    <td style={{ padding: '9px 12px' }} className="cell-strong">{l.numero}</td>
                    <td style={{ padding: '9px 8px' }} className="cell-sub">{l.operadora ?? '—'}</td>
                    <td style={{ padding: '9px 8px' }} className="cell-sub">{l.departamento ?? '—'}</td>
                    <td style={{ padding: '9px 8px' }} className="cell-sub">{l.asignado_a ?? '—'}</td>
                    <td style={{ padding: '9px 8px' }} className="cell-sub">{l.plan ?? '—'}</td>
                    <td style={{ padding: '9px 8px', textAlign: 'right' }} className="cell-sub">{fMonto(l.monto, l.moneda)}</td>
                    <td style={{ padding: '9px 8px', textAlign: 'center' }} className="cell-sub">{fFecha(l.fecha_corte)}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button className="btn btn-secondary" style={{ padding: '5px 8px' }} onClick={() => setEditar(l)}><Pencil size={14} strokeWidth={2.4} /></button>
                      <button className="btn btn-secondary" style={{ padding: '5px 8px', marginLeft: 6 }} onClick={() => borrar(l)}><Trash2 size={14} strokeWidth={2.4} color="var(--danger-500)" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editar && <LineaModal linea={editar === 'nueva' ? null : editar} onClose={() => setEditar(null)} onDone={() => { setEditar(null); cargar() }} />}
    </div>
  )
}

function LineaModal({ linea, onClose, onDone }: { linea: Linea | null; onClose: () => void; onDone: () => void }) {
  const [f, setF] = useState({
    numero: linea?.numero ?? '',
    operadora: linea?.operadora ?? '',
    departamento: linea?.departamento ?? '',
    asignado_a: linea?.asignado_a ?? '',
    plan: linea?.plan ?? '',
    monto: linea?.monto != null ? String(linea.monto) : '',
    moneda: linea?.moneda ?? 'USD',
    fecha_corte: linea?.fecha_corte ? String(linea.fecha_corte).slice(0, 10) : '',
    activo: linea?.activo ?? true,
    nota: linea?.nota ?? '',
  })
  const [ocupado, setOcupado] = useState(false)
  const toast = useToast()
  const set = (k: keyof typeof f, v: string | boolean) => setF((s) => ({ ...s, [k]: v }))

  async function guardar() {
    setOcupado(true)
    const payload = {
      numero: f.numero.trim(),
      operadora: f.operadora.trim() || null,
      departamento: f.departamento.trim() || null,
      asignado_a: f.asignado_a.trim() || null,
      plan: f.plan.trim() || null,
      monto: f.monto ? Number(f.monto) : null,
      moneda: f.moneda,
      fecha_corte: f.fecha_corte || null,
      activo: f.activo,
      nota: f.nota.trim() || null,
    }
    try {
      if (linea) await api.patch(`/lineas/${linea.id}`, payload)
      else await api.post('/lineas', payload)
      toast('Línea guardada ✓')
      onDone()
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Error')
      setOcupado(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{linea ? 'Editar línea' : 'Nueva línea'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label className="field-label">Número</label><input className="input-text" value={f.numero} onChange={(e) => set('numero', e.target.value)} placeholder="0412-1234567" /></div>
            <div className="field"><label className="field-label">Operadora</label>
              <select className="input-text" value={f.operadora} onChange={(e) => set('operadora', e.target.value)}>
                <option value="">—</option><option>Digitel</option><option>Movistar</option><option>Movilnet</option>
              </select>
            </div>
          </div>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label className="field-label">Departamento</label><input className="input-text" value={f.departamento} onChange={(e) => set('departamento', e.target.value)} placeholder="Ventas, Logística…" /></div>
            <div className="field"><label className="field-label">Asignada a</label><input className="input-text" value={f.asignado_a} onChange={(e) => set('asignado_a', e.target.value)} /></div>
          </div>
          <div className="field"><label className="field-label">Plan</label><input className="input-text" value={f.plan} onChange={(e) => set('plan', e.target.value)} placeholder="Plan de datos, minutos…" /></div>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 0.7fr 1fr', gap: 12 }}>
            <div className="field"><label className="field-label">Monto</label><input className="input-text" type="number" inputMode="decimal" value={f.monto} onChange={(e) => set('monto', e.target.value)} /></div>
            <div className="field"><label className="field-label">Moneda</label>
              <select className="input-text" value={f.moneda} onChange={(e) => set('moneda', e.target.value)}><option>USD</option><option>Bs</option></select>
            </div>
            <div className="field"><label className="field-label">Fecha de corte</label><input className="input-text" type="date" value={f.fecha_corte} onChange={(e) => set('fecha_corte', e.target.value)} /></div>
          </div>
          <div className="field"><label className="field-label">Nota</label><input className="input-text" value={f.nota} onChange={(e) => set('nota', e.target.value)} /></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, font: '600 13px var(--font-ui)', color: 'var(--ink-900)' }}>
            <input type="checkbox" checked={f.activo} onChange={(e) => set('activo', e.target.checked)} /> Activa
          </label>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" disabled={ocupado || !f.numero.trim()} onClick={guardar}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
