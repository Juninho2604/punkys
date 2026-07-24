import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FileText, Map, AlertTriangle, ChevronRight, Pencil } from 'lucide-react'
import { api } from '../lib/api'
import { fmtFechaHora } from '../lib/format'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { Badge } from '../components/Badge'
import type { Milestone, Shipment, ShipmentDoc } from '../lib/types'

export function DespachoDetalle() {
  const { id } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [docs, setDocs] = useState<ShipmentDoc[]>([])
  const [editando, setEditando] = useState(false)
  const [transportista, setTransportista] = useState('')
  const [placa, setPlaca] = useState('')
  const [logEdit, setLogEdit] = useState(false)
  const [log, setLog] = useState<Record<string, string>>({})

  const cargar = useCallback(() => {
    api
      .get<{ shipment: Shipment; milestones: Milestone[]; docs: ShipmentDoc[] }>(`/shipments/${id}`)
      .then((r) => {
        setShipment(r.shipment)
        setMilestones(r.milestones)
        setDocs(r.docs)
        setTransportista(r.shipment.transportista)
        setPlaca(r.shipment.placa ?? '')
        const s = r.shipment
        const v = (x: unknown) => (x == null ? '' : String(x))
        setLog({
          nroNota: v(s.nro_nota), tipoTransporte: v(s.tipo_transporte), ruta: v(s.ruta), devolucion: v(s.devolucion),
          kilos: v(s.kilos), unidadesFable: v(s.unidades_fable), unidadesPp: v(s.unidades_pp),
          montoFable: v(s.monto_fable), montoPp: v(s.monto_pp),
          promesaEntrega: v(s.promesa_entrega).slice(0, 10), compromisoLogistica: v(s.compromiso_logistica).slice(0, 10),
          incidenciaDetalle: v(s.incidencia_detalle), comentarioLogistica: v(s.comentario_logistica),
        })
      })
      .catch(console.error)
  }, [id])

  useEffect(cargar, [cargar])

  if (!shipment || !user) return null
  const gestiona = user.rol === 'despacho' || user.rol === 'admin'
  const ruta = `${shipment.origen.split('—')[0].trim()} → ${shipment.destino_ciudad}`

  async function avanzar() {
    try {
      const r = await api.post<{ shipment: Shipment }>(`/shipments/${shipment!.id}/advance`)
      toast(`${r.shipment.numero}: ${r.shipment.estado}`)
      cargar()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo avanzar')
    }
  }

  async function incidencia() {
    try {
      await api.post(`/shipments/${shipment!.id}/incidencia`, { on: !shipment!.incidencia })
      toast(shipment!.incidencia ? 'Incidencia resuelta' : `${shipment!.numero}: incidencia reportada`)
      cargar()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo actualizar')
    }
  }

  async function guardarTransporte() {
    try {
      await api.patch(`/shipments/${shipment!.id}`, { transportista, placa })
      toast('Transportista actualizado ✓')
      setEditando(false)
      cargar()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo guardar')
    }
  }

  async function guardarLogistica() {
    try {
      await api.patch(`/shipments/${shipment!.id}/logistica`, log)
      toast('Logística actualizada ✓')
      setLogEdit(false)
      cargar()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo guardar')
    }
  }

  return (
    <div className="fade-up">
      <Link to="/despacho" className="link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '800 13.5px var(--font-ui)', marginBottom: 14 }}>
        ← Volver al listado
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
        <h1 className="h1-module">{shipment.numero}</h1>
        <Badge estado={shipment.estado} lg />
        <span className="cell-sub">ETA {shipment.eta}</span>
        {gestiona && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" style={{ padding: '9px 16px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, color: shipment.incidencia ? 'var(--success-600)' : 'var(--danger-500)' }} onClick={incidencia}>
              <AlertTriangle size={15} strokeWidth={2.4} />
              {shipment.incidencia ? 'Resolver incidencia' : 'Reportar incidencia'}
            </button>
            {shipment.done < 5 && (
              <button className="btn btn-primary" style={{ padding: '9px 18px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={avanzar}>
                Avanzar etapa <ChevronRight size={15} strokeWidth={2.6} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="detail-grid">
        {/* timeline-shipment */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div className="h3-card" style={{ marginBottom: 18 }}>Cronología del envío</div>
          {milestones.map((m, i) => {
            const done = i < shipment.done
            const current = i === shipment.done
            return (
              <div key={m.id} style={{ display: 'flex', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className={`tl-dot ${done ? 'done' : current ? 'current' : 'future'}`} />
                  {i < milestones.length - 1 && <div className={`tl-line${done ? ' done' : ''}`} />}
                </div>
                <div style={{ paddingBottom: 18 }}>
                  <div style={{ font: '800 13.5px var(--font-ui)', color: done || current ? 'var(--ink-900)' : 'var(--ink-300)' }}>{m.titulo}</div>
                  <div className="caption">{done && m.at ? fmtFechaHora(m.at) : current ? 'En curso' : 'Pendiente'}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div className="h3-card">Detalle del envío</div>
              {gestiona && (
                <button className="header-logout" title="Editar transportista" onClick={() => setEditando((e) => !e)}>
                  <Pencil size={15} strokeWidth={2.4} />
                </button>
              )}
            </div>
            <div className="detail-datos">
              <Dato label="Cliente" valor={shipment.cliente} />
              {editando ? (
                <div className="field">
                  <label className="field-label" style={{ color: 'var(--ink-300)', fontSize: 11.5 }}>Transportista · Placa</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="input-text" style={{ padding: '8px 10px', fontSize: 13 }} value={transportista} onChange={(e) => setTransportista(e.target.value)} placeholder="Transportista" />
                    <input className="input-text" style={{ padding: '8px 10px', fontSize: 13, width: 110 }} value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="Placa" />
                    <button className="btn btn-primary" style={{ padding: '8px 12px', fontSize: 12.5 }} onClick={guardarTransporte}>OK</button>
                  </div>
                </div>
              ) : (
                <Dato label="Transportista" valor={`${shipment.transportista}${shipment.placa ? ` · ${shipment.placa}` : ''}`} />
              )}
              <Dato label="Origen" valor={shipment.origen} />
              <Dato label="Destino" valor={shipment.destino_direccion} />
              <div style={{ gridColumn: '1/-1' }}>
                <Dato label="Carga" valor={shipment.carga ?? '—'} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div className="h3-card">Logística y despacho</div>
              {gestiona && (
                <button className="header-logout" title="Editar logística" onClick={() => setLogEdit((e) => !e)}>
                  <Pencil size={15} strokeWidth={2.4} />
                </button>
              )}
            </div>
            {logEdit ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <LogInput label="Nº Nota entrega" k="nroNota" log={log} setLog={setLog} />
                <LogInput label="Tipo transporte" k="tipoTransporte" log={log} setLog={setLog} ph="Moto, Camión…" />
                <LogInput label="Ruta" k="ruta" log={log} setLog={setLog} />
                <LogInput label="Kilos aprox." k="kilos" log={log} setLog={setLog} num />
                <LogInput label="Unidades Fable" k="unidadesFable" log={log} setLog={setLog} num />
                <LogInput label="Unidades PP" k="unidadesPp" log={log} setLog={setLog} num />
                <LogInput label="Monto Fable" k="montoFable" log={log} setLog={setLog} num />
                <LogInput label="Monto PP" k="montoPp" log={log} setLog={setLog} num />
                <LogInput label="Promesa entrega" k="promesaEntrega" log={log} setLog={setLog} date />
                <LogInput label="Compromiso logística" k="compromisoLogistica" log={log} setLog={setLog} date />
                <LogInput label="Devolución" k="devolucion" log={log} setLog={setLog} />
                <LogInput label="Incidencia (detalle)" k="incidenciaDetalle" log={log} setLog={setLog} />
                <div style={{ gridColumn: '1/-1' }}><LogInput label="Comentario logística" k="comentarioLogistica" log={log} setLog={setLog} /></div>
                <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={() => setLogEdit(false)}>Cancelar</button>
                  <button className="btn btn-primary" onClick={guardarLogistica}>Guardar</button>
                </div>
              </div>
            ) : (
              <div className="detail-datos">
                {[
                  ['Nº Nota', log.nroNota], ['Transporte', log.tipoTransporte], ['Ruta', log.ruta],
                  ['Kilos', log.kilos], ['Und. Fable', log.unidadesFable], ['Und. PP', log.unidadesPp],
                  ['Monto Fable', log.montoFable], ['Monto PP', log.montoPp],
                  ['Promesa', log.promesaEntrega], ['Compromiso', log.compromisoLogistica],
                  ['Devolución', log.devolucion], ['Incidencia', log.incidenciaDetalle], ['Comentario', log.comentarioLogistica],
                ].filter(([, v]) => v).map(([l, v]) => <Dato key={l} label={l as string} valor={v as string} />)}
                {![log.nroNota, log.tipoTransporte, log.ruta, log.kilos, log.unidadesFable, log.unidadesPp, log.montoFable, log.montoPp, log.promesaEntrega, log.compromisoLogistica, log.devolucion, log.incidenciaDetalle, log.comentarioLogistica].some(Boolean) && (
                  <div className="cell-sub" style={{ gridColumn: '1/-1' }}>Sin datos de logística. {gestiona ? 'Toca el lápiz para agregarlos.' : ''}</div>
                )}
              </div>
            )}
          </div>

          <div className="docs-map-grid">
            <div style={{ background: '#fff', border: '2px dashed var(--sky-200)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 28, minHeight: 150 }}>
              <Map size={28} strokeWidth={2} color="var(--ink-300)" />
              <span style={{ font: '700 13px var(--font-ui)', color: 'var(--ink-300)' }}>Mapa de ruta (placeholder)</span>
              <span style={{ font: '600 12px var(--font-ui)', color: '#BCC9DE' }}>{ruta}</span>
            </div>
            <div className="card" style={{ padding: '18px 20px' }}>
              <div style={{ font: '700 15px var(--font-display)', color: 'var(--brand-900)', marginBottom: 10 }}>Documentos</div>
              {docs.map((d) => (
                <a key={d.id} className="doc-item" onClick={(e) => e.preventDefault()} href="#">
                  <FileText size={17} strokeWidth={2} color="var(--danger-500)" style={{ flex: 'none' }} />
                  <span style={{ font: '700 13px var(--font-ui)', color: 'var(--ink-900)', flex: 1 }}>{d.nombre}</span>
                  <span style={{ font: '600 11.5px var(--font-ui)', color: 'var(--ink-300)' }}>{d.tamano}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LogInput({ label, k, log, setLog, ph, num, date }: { label: string; k: string; log: Record<string, string>; setLog: (f: (s: Record<string, string>) => Record<string, string>) => void; ph?: string; num?: boolean; date?: boolean }) {
  return (
    <div className="field">
      <label className="field-label" style={{ color: 'var(--ink-300)', fontSize: 11.5 }}>{label}</label>
      <input
        className="input-text"
        style={{ padding: '8px 10px', fontSize: 13 }}
        type={date ? 'date' : num ? 'number' : 'text'}
        inputMode={num ? 'decimal' : undefined}
        placeholder={ph}
        value={log[k] ?? ''}
        onChange={(e) => setLog((s) => ({ ...s, [k]: e.target.value }))}
      />
    </div>
  )
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <div style={{ font: '700 11.5px var(--font-ui)', letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--ink-300)' }}>{label}</div>
      <div style={{ font: '700 14px var(--font-ui)', color: 'var(--ink-900)', marginTop: 2 }}>{valor}</div>
    </div>
  )
}
