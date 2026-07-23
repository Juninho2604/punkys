import { useEffect, useState } from 'react'
import { Building2, Plus, TrendingUp, AlertTriangle, CheckCircle2, Wallet, CalendarClock } from 'lucide-react'
import { api } from '../lib/api'
import { bs, bsUsd, etiquetaTasa, useTasa } from '../lib/moneda'
import { useToast } from '../lib/toast'

interface Banco { id: number; nombre: string; moneda: string; numero: string | null; activo: boolean }
interface SaldoBanco { id: number; nombre: string; moneda: string; numero: string | null; saldo: number; saldoBs: number; saldoUsd: number; movimientos: number }
interface Posicion { tasa: number; bancos: SaldoBanco[]; totalBs: number; totalUsd: number; totalEnBancosBs: number; totalEnBancosUsd: number }
interface Semana { semana: number; desde: string; hasta: string; entradasBs: number; entradasUsd: number; salidasBs: number; salidasUsd: number; saldoFinalBs: number; saldoFinalUsd: number; negativo: boolean }
interface Proyeccion { tasa: number; inicioBs: number; inicioUsd: number; semanas: Semana[]; entradasTotalBs: number; salidasTotalBs: number; primeraSemanaNegativa: number | null }
interface Resumen { posicion: Posicion; proyeccion: Proyeccion }
interface Compromiso { id: number; proveedor: string; descripcion: string | null; monto: number; moneda: string; fecha_venc: string; prioridad: string; pagado: boolean }

const hoyISO = () => new Date().toISOString().slice(0, 10)
const fFecha = (s: string) => new Date(String(s).slice(0, 10) + 'T12:00:00').toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })
const PRIO: Record<string, { c: string; b: string }> = {
  alta: { c: 'var(--danger-500)', b: 'var(--danger-soft)' },
  media: { c: 'var(--warning-600)', b: 'var(--warning-soft)' },
  baja: { c: 'var(--ink-500)', b: 'var(--neutral-soft)' },
}

export function Tesoreria() {
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [bancos, setBancos] = useState<Banco[]>([])
  const [compromisos, setCompromisos] = useState<Compromiso[]>([])
  const [modal, setModal] = useState<null | 'banco' | 'mov' | 'compromiso'>(null)
  const tasa = useTasa()
  const toast = useToast()

  function cargar() {
    api.get<Resumen>('/tesoreria/resumen').then(setResumen).catch(() => {})
    api.get<{ bancos: Banco[] }>('/tesoreria/bancos').then((r) => setBancos(r.bancos)).catch(() => {})
    api.get<{ compromisos: Compromiso[] }>('/tesoreria/compromisos').then((r) => setCompromisos(r.compromisos)).catch(() => {})
  }
  useEffect(cargar, [])

  async function marcarPagado(c: Compromiso) {
    const bancosMoneda = bancos.filter((b) => b.moneda === c.moneda && b.activo)
    const banco_id = bancosMoneda[0]?.id
    try {
      await api.patch(`/tesoreria/compromisos/${c.id}`, { pagado: true, banco_id })
      toast(`Pago a ${c.proveedor} registrado ✓`)
      cargar()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo marcar')
    }
  }

  const pos = resumen?.posicion
  const proy = resumen?.proyeccion

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 className="h1-module">Tesorería · Flujo de Caja</h1>
          <p className="subtitle">
            Posición de caja consolidada (Bs y USD) y proyección semanal con la cartera real. · {etiquetaTasa(tasa)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setModal('banco')}><Building2 size={15} strokeWidth={2.4} /> Banco</button>
          <button className="btn btn-secondary" onClick={() => setModal('compromiso')}><CalendarClock size={15} strokeWidth={2.4} /> Compromiso</button>
          <button className="btn btn-primary" onClick={() => setModal('mov')}><Plus size={15} strokeWidth={2.4} /> Movimiento</button>
        </div>
      </div>

      {/* KPIs de posición */}
      <div className="kpi-grid-auto">
        <div className="card card-kpi">
          <div className="field-label">Posición total</div>
          <div className="kpi-value" style={{ fontSize: 26 }}>{pos ? bsUsd(pos.totalBs, pos.totalUsd) : '—'}</div>
        </div>
        <div className="card card-kpi">
          <div className="field-label">En cuentas Bs</div>
          <div className="kpi-value">{pos ? bs(pos.totalEnBancosBs) : '—'}</div>
        </div>
        <div className="card card-kpi">
          <div className="field-label">En cuentas USD</div>
          <div className="kpi-value">{pos ? bs(pos.totalEnBancosUsd, 'USD') : '—'}</div>
        </div>
      </div>

      {/* Alerta de proyección negativa */}
      {proy && proy.primeraSemanaNegativa != null && (
        <div className="card" style={{ padding: 16, display: 'flex', gap: 10, alignItems: 'center', background: 'var(--danger-soft)', border: '1px solid var(--danger-500)' }}>
          <AlertTriangle size={20} color="var(--danger-500)" />
          <span style={{ font: '700 13.5px var(--font-ui)', color: 'var(--danger-500)' }}>
            La caja se pone en rojo en la semana del {proy.semanas[proy.primeraSemanaNegativa] ? fFecha(proy.semanas[proy.primeraSemanaNegativa].desde) : '—'}. Revisa cobranzas y prioriza pagos.
          </span>
        </div>
      )}

      {/* Proyección de caja semanal */}
      {proy && proy.semanas.length > 0 && (
        <div className="card" style={{ padding: 22 }}>
          <div className="h3-card" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <TrendingUp size={17} strokeWidth={2.4} /> Proyección de caja ({proy.semanas.length} semanas)
          </div>
          <p className="caption" style={{ marginBottom: 14 }}>
            Entradas = cobranza esperada de la cartera (por vencimiento) · Salidas = compromisos de pago. Arranca de la posición de hoy.
          </p>
          <div className="table-scroll">
            <table className="tabla-datos" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr style={{ font: '700 11.5px var(--font-ui)', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <th style={{ textAlign: 'left', padding: '6px 8px' }}>Semana</th>
                  <th style={{ textAlign: 'right', padding: '6px 8px' }}>Entradas</th>
                  <th style={{ textAlign: 'right', padding: '6px 8px' }}>Salidas</th>
                  <th style={{ textAlign: 'right', padding: '6px 8px' }}>Saldo final</th>
                </tr>
              </thead>
              <tbody>
                {proy.semanas.map((s) => (
                  <tr key={s.semana} style={{ borderTop: '1px solid var(--line-soft)', background: s.negativo ? 'var(--danger-soft)' : undefined }}>
                    <td style={{ padding: '8px', font: '700 12.5px var(--font-ui)', color: 'var(--ink-900)' }}>{fFecha(s.desde)}–{fFecha(s.hasta)}</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: 'var(--success-600)' }}>{s.entradasBs > 0 ? bs(s.entradasBs) : '—'}</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: 'var(--danger-500)' }}>{s.salidasBs > 0 ? bs(s.salidasBs) : '—'}</td>
                    <td style={{ padding: '8px', textAlign: 'right', font: '800 13px var(--font-ui)', color: s.negativo ? 'var(--danger-500)' : 'var(--ink-900)' }}>{bs(s.saldoFinalBs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="ds-2col">
        {/* Saldos por banco */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header"><div className="h3-card" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Wallet size={16} strokeWidth={2.4} /> Saldos por cuenta</div></div>
          {!pos || pos.bancos.length === 0 ? (
            <div style={{ padding: '18px 20px' }} className="cell-sub">Aún no hay cuentas. Agrega un banco y registra sus movimientos.</div>
          ) : (
            pos.bancos.map((b) => (
              <div key={b.id} style={{ padding: '12px 20px', borderTop: '1px solid var(--line-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="cell-main">{b.nombre} <span className="caption">· {b.moneda}{b.numero ? ` ·••${b.numero}` : ''}</span></div>
                  <div className="caption">{b.movimientos} movimiento{b.movimientos === 1 ? '' : 's'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="cell-strong">{bs(b.saldo, b.moneda)}</div>
                  {b.moneda === 'Bs' ? <div className="caption">≈ $ {new Intl.NumberFormat('es-VE', { maximumFractionDigits: 0 }).format(b.saldoUsd)}</div> : <div className="caption">≈ {bs(b.saldoBs)}</div>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Compromisos de pago */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header"><div className="h3-card" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CalendarClock size={16} strokeWidth={2.4} /> Por pagar (compromisos)</div></div>
          {compromisos.length === 0 ? (
            <div style={{ padding: '18px 20px' }} className="cell-sub">Sin compromisos pendientes. Registra pagos programados a proveedores.</div>
          ) : (
            compromisos.map((c) => (
              <div key={c.id} style={{ padding: '12px 20px', borderTop: '1px solid var(--line-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div className="cell-main" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {c.proveedor}
                    <span className="badge" style={{ background: PRIO[c.prioridad]?.b, color: PRIO[c.prioridad]?.c, fontSize: 10 }}>{c.prioridad}</span>
                  </div>
                  <div className="caption">Vence {fFecha(c.fecha_venc)}{c.descripcion ? ` · ${c.descripcion}` : ''}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="cell-strong">{bs(c.monto, c.moneda)}</span>
                  <button className="btn btn-secondary" style={{ padding: '5px 9px' }} title="Marcar pagado" onClick={() => marcarPagado(c)}>
                    <CheckCircle2 size={15} strokeWidth={2.4} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {modal === 'banco' && <BancoModal onClose={() => setModal(null)} onDone={() => { setModal(null); cargar() }} />}
      {modal === 'mov' && <MovimientoModal bancos={bancos.filter((b) => b.activo)} onClose={() => setModal(null)} onDone={() => { setModal(null); cargar() }} />}
      {modal === 'compromiso' && <CompromisoModal onClose={() => setModal(null)} onDone={() => { setModal(null); cargar() }} />}
    </div>
  )
}

// ── Modales ──────────────────────────────────────────────────────────────────

function BancoModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [nombre, setNombre] = useState('')
  const [moneda, setMoneda] = useState('Bs')
  const [numero, setNumero] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const toast = useToast()
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Nueva cuenta / banco</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="field"><label className="field-label">Nombre</label><input className="input-text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Banesco Bs, Zelle, Caja chica…" /></div>
          <div className="field"><label className="field-label">Moneda</label>
            <select className="input-text" value={moneda} onChange={(e) => setMoneda(e.target.value)}><option value="Bs">Bs</option><option value="USD">USD</option></select>
          </div>
          <div className="field"><label className="field-label">Identificador visible (opcional)</label><input className="input-text" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="últimos 4 dígitos" /></div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" disabled={ocupado || !nombre.trim()} onClick={async () => {
              setOcupado(true)
              try { await api.post('/tesoreria/bancos', { nombre: nombre.trim(), moneda, numero: numero.trim() || null }); toast('Cuenta creada ✓'); onDone() }
              catch (err) { toast(err instanceof Error ? err.message : 'Error'); setOcupado(false) }
            }}>Crear</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MovimientoModal({ bancos, onClose, onDone }: { bancos: Banco[]; onClose: () => void; onDone: () => void }) {
  const [bancoId, setBancoId] = useState(bancos[0]?.id ?? 0)
  const [tipo, setTipo] = useState<'ingreso' | 'egreso'>('ingreso')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(hoyISO())
  const [concepto, setConcepto] = useState('')
  const [referencia, setReferencia] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const toast = useToast()
  const banco = bancos.find((b) => b.id === bancoId)

  if (bancos.length === 0) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <h3>Nuevo movimiento</h3>
          <p className="cell-sub">Primero crea una cuenta / banco.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn btn-primary" onClick={onClose}>Entendido</button></div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Nuevo movimiento</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="field"><label className="field-label">Cuenta</label>
            <select className="input-text" value={bancoId} onChange={(e) => setBancoId(Number(e.target.value))}>
              {bancos.map((b) => <option key={b.id} value={b.id}>{b.nombre} ({b.moneda})</option>)}
            </select>
          </div>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label className="field-label">Tipo</label>
              <select className="input-text" value={tipo} onChange={(e) => setTipo(e.target.value as 'ingreso' | 'egreso')}><option value="ingreso">Ingreso</option><option value="egreso">Egreso</option></select>
            </div>
            <div className="field"><label className="field-label">Monto ({banco?.moneda})</label><input className="input-text" type="number" inputMode="decimal" value={monto} onChange={(e) => setMonto(e.target.value)} /></div>
          </div>
          <div className="field"><label className="field-label">Fecha</label><input className="input-text" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
          <div className="field"><label className="field-label">Concepto</label><input className="input-text" value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Cobro cliente X, pago nómina…" /></div>
          <div className="field"><label className="field-label">Referencia (opcional)</label><input className="input-text" value={referencia} onChange={(e) => setReferencia(e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" disabled={ocupado || !concepto.trim() || !(Number(monto) > 0)} onClick={async () => {
              setOcupado(true)
              try {
                await api.post('/tesoreria/movimientos', { banco_id: bancoId, fecha, tipo, monto: Number(monto), moneda: banco?.moneda ?? 'Bs', concepto: concepto.trim(), referencia: referencia.trim() || null })
                toast('Movimiento registrado ✓'); onDone()
              } catch (err) { toast(err instanceof Error ? err.message : 'Error'); setOcupado(false) }
            }}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompromisoModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [proveedor, setProveedor] = useState('')
  const [monto, setMonto] = useState('')
  const [moneda, setMoneda] = useState('Bs')
  const [fecha, setFecha] = useState(hoyISO())
  const [prioridad, setPrioridad] = useState('media')
  const [descripcion, setDescripcion] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const toast = useToast()
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Nuevo compromiso de pago</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="field"><label className="field-label">Proveedor</label><input className="input-text" value={proveedor} onChange={(e) => setProveedor(e.target.value)} /></div>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label className="field-label">Monto</label><input className="input-text" type="number" inputMode="decimal" value={monto} onChange={(e) => setMonto(e.target.value)} /></div>
            <div className="field"><label className="field-label">Moneda</label>
              <select className="input-text" value={moneda} onChange={(e) => setMoneda(e.target.value)}><option value="Bs">Bs</option><option value="USD">USD</option></select>
            </div>
          </div>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label className="field-label">Vence</label><input className="input-text" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
            <div className="field"><label className="field-label">Prioridad</label>
              <select className="input-text" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select>
            </div>
          </div>
          <div className="field"><label className="field-label">Descripción (opcional)</label><input className="input-text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" disabled={ocupado || !proveedor.trim() || !(Number(monto) > 0)} onClick={async () => {
              setOcupado(true)
              try {
                await api.post('/tesoreria/compromisos', { proveedor: proveedor.trim(), monto: Number(monto), moneda, fecha_venc: fecha, prioridad, descripcion: descripcion.trim() || null })
                toast('Compromiso registrado ✓'); onDone()
              } catch (err) { toast(err instanceof Error ? err.message : 'Error'); setOcupado(false) }
            }}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
