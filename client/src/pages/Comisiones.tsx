import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'
import { bs, montoDual, etiquetaTasa, useTasa } from '../lib/moneda'

interface Fila {
  vendedorNorm: string
  vendedor: string
  baseUsd: number
  docs: number
  pct: number | null
  comisionUsd: number | null
  pago: { id: number; referencia: string | null; pagadaAt: string } | null
}
interface Data {
  periodos: { inicio: string; fin: string }[]
  periodo: { inicio: string; fin: string } | null
  filas: Fila[]
  totales: { baseUsd: number; comisionUsd: number }
  actualizado: string | null
}

const usd = (n: number) => bs(n)

function periodoLabel(p: { inicio: string; fin: string }): string {
  const mes = new Date(`${p.inicio.slice(0, 7)}-01T12:00:00`).toLocaleDateString('es-VE', { month: 'short', year: 'numeric' })
  return `${Number(p.inicio.slice(8, 10))}–${Number(p.fin.slice(8, 10))} ${mes}`
}

export function Comisiones() {
  const toast = useToast()
  const tasa = useTasa()
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editando, setEditando] = useState<Fila | null>(null)
  const [pctNuevo, setPctNuevo] = useState('')
  const [pagando, setPagando] = useState<Fila | null>(null)
  const [referencia, setReferencia] = useState('')
  const [ocupado, setOcupado] = useState(false)

  const cargar = useCallback((periodo?: string) => {
    api
      .get<Data>(`/comisiones${periodo ? `?periodo=${periodo}` : ''}`)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
  }, [])

  useEffect(() => cargar(), [cargar])

  if (error) return <div className="fade-up"><p className="subtitle">{error}</p></div>
  if (!data) return null

  const vacio = !data.periodo
  const sinPct = data.filas.filter((f) => f.pct == null).length
  const cols = '1.6fr 1fr 0.6fr 1fr 1fr 1.2fr'

  const guardarPct = async () => {
    if (!editando) return
    const pct = Number(pctNuevo)
    if (Number.isNaN(pct) || pct < 0 || pct > 100) return void toast('El % debe estar entre 0 y 100')
    setOcupado(true)
    try {
      await api.put('/comisiones/config', { vendedor: editando.vendedor, pct })
      toast(`${editando.vendedor}: ${pct}% guardado ✓`)
      setEditando(null)
      cargar(data.periodo?.inicio)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo guardar')
    } finally {
      setOcupado(false)
    }
  }

  const pagar = async () => {
    if (!pagando || !data.periodo) return
    setOcupado(true)
    try {
      await api.post('/comisiones/pagar', {
        vendedorNorm: pagando.vendedorNorm,
        periodoInicio: data.periodo.inicio,
        referencia: referencia || undefined,
      })
      toast(`Comisión de ${pagando.vendedor} marcada como pagada ✓`)
      setPagando(null)
      setReferencia('')
      cargar(data.periodo.inicio)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo registrar')
    } finally {
      setOcupado(false)
    }
  }

  const deshacer = async (f: Fila) => {
    if (!f.pago || !window.confirm(`¿Deshacer el pago de ${f.vendedor}? Volverá a quedar pendiente.`)) return
    try {
      await api.del(`/comisiones/pagar/${f.pago.id}`)
      toast('Pago deshecho')
      cargar(data.periodo?.inicio)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo deshacer')
    }
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 14, justifyContent: 'space-between' }}>
        <div>
          <h1 className="h1-module">Comisiones</h1>
          <p className="subtitle">
            Sobre lo cobrado en Profit (Bs), por quincena. {data.actualizado ? `Cobranzas actualizadas ${new Date(data.actualizado).toLocaleString('es-VE')}.` : 'Sin cobranzas sincronizadas aún.'} · {etiquetaTasa(tasa)}
          </p>
        </div>
        {!vacio && (
          <div className="field" style={{ minWidth: 210 }}>
            <label className="field-label">Quincena</label>
            <select className="input-text" value={data.periodo!.inicio} onChange={(e) => cargar(e.target.value)}>
              {data.periodos.map((p) => (
                <option key={p.inicio} value={p.inicio}>{periodoLabel(p)}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {vacio ? (
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div className="cell-sub">
            No hay cobranzas sincronizadas. Se cargan por el puente de datos desde Profit con
            <code> sync_cobranzas.py</code> (ver docs/puente-datos.md).
          </div>
        </div>
      ) : (
        <>
          <div className="kpi-grid-auto">
            <div className="card card-kpi">
              <div className="field-label">Cobrado en la quincena</div>
              <div className="kpi-value" style={{ fontSize: 20 }}>{montoDual(data.totales.baseUsd, tasa)}</div>
            </div>
            <div className="card card-kpi">
              <div className="field-label">Comisiones del período</div>
              <div className="kpi-value" style={{ fontSize: 20, color: 'var(--success-600)' }}>{montoDual(data.totales.comisionUsd, tasa)}</div>
            </div>
            <div className="card card-kpi">
              <div className="field-label">Vendedores</div>
              <div className="kpi-value">{data.filas.length}</div>
            </div>
          </div>

          {sinPct > 0 && (
            <div className="card" style={{ padding: '12px 18px', borderLeft: '4px solid var(--warning-dot)', background: 'var(--warning-soft)' }}>
              <span className="cell-sub" style={{ color: 'var(--warning-600)' }}>
                {sinPct} vendedor{sinPct > 1 ? 'es' : ''} sin % configurado — su comisión no se calcula hasta que lo definas (botón «%»).
              </span>
            </div>
          )}

          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div className="h3-card">Quincena {periodoLabel(data.periodo!)}</div>
              <span className="caption">el % solo lo ve el administrador</span>
            </div>
            <div className="table-scroll">
              <div className="table-min-760">
                <div className="table-head" style={{ gridTemplateColumns: cols }}>
                  <span>Vendedor</span><span>Cobrado</span><span>%</span><span>Comisión</span><span>Estado</span><span>Acciones</span>
                </div>
                {data.filas.map((f) => (
                  <div key={f.vendedorNorm} className="table-row" style={{ gridTemplateColumns: cols, cursor: 'default' }}>
                    <span className="cell-main">
                      {f.vendedor}
                      {f.docs > 0 && <span className="cell-sub"> · {f.docs} cobro{f.docs > 1 ? 's' : ''}</span>}
                    </span>
                    <span className="cell-strong">{usd(f.baseUsd)}</span>
                    <span className="cell-strong">{f.pct != null ? `${f.pct}%` : '—'}</span>
                    <span style={{ font: '800 13.5px var(--font-ui)', color: f.comisionUsd != null ? 'var(--success-600)' : 'var(--ink-300)' }}>
                      {f.comisionUsd != null ? usd(f.comisionUsd) : 'sin %'}
                    </span>
                    <span>
                      {f.pago ? (
                        <span className="badge" style={{ background: 'var(--success-soft)', color: 'var(--success-600)' }} title={f.pago.referencia ? `Ref: ${f.pago.referencia}` : undefined}>
                          pagada {new Date(f.pago.pagadaAt).toLocaleDateString('es-VE')}
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'var(--line-soft)', color: 'var(--ink-500)' }}>pendiente</span>
                      )}
                    </span>
                    <span style={{ display: 'flex', gap: 8 }}>
                      {!f.pago && (
                        <>
                          <button className="btn btn-secondary" style={{ padding: '7px 11px', fontSize: 13 }} title="Configurar % de comisión" onClick={() => { setEditando(f); setPctNuevo(f.pct != null ? String(f.pct) : '') }}>%</button>
                          <button className="btn btn-primary" style={{ padding: '7px 12px', fontSize: 13 }} disabled={f.pct == null} onClick={() => { setPagando(f); setReferencia('') }}>Marcar pagada</button>
                        </>
                      )}
                      {f.pago && (
                        <button className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: 13 }} onClick={() => deshacer(f)}>Deshacer</button>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {editando && (
        <div className="modal-backdrop" onClick={() => setEditando(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>% de comisión · {editando.vendedor}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label className="field-label">Porcentaje sobre lo cobrado (0–100)</label>
                <input className="input-text" type="number" min={0} max={100} step={0.5} value={pctNuevo} onChange={(e) => setPctNuevo(e.target.value)} autoFocus />
              </div>
              <p className="caption">Aplica a las quincenas pendientes; los pagos ya registrados conservan el % con que se pagaron.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setEditando(null)}>Cancelar</button>
                <button className="btn btn-primary" disabled={ocupado || pctNuevo === ''} onClick={guardarPct}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {pagando && data.periodo && (
        <div className="modal-backdrop" onClick={() => setPagando(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Registrar pago · {pagando.vendedor}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p className="cell-sub">
                Quincena {periodoLabel(data.periodo)} · cobró {usd(pagando.baseUsd)} · comisión{' '}
                <strong style={{ color: 'var(--success-600)' }}>{pagando.comisionUsd != null ? usd(pagando.comisionUsd) : '—'}</strong> ({pagando.pct}%)
              </p>
              <div className="field">
                <label className="field-label">Referencia del pago (opcional)</label>
                <input className="input-text" placeholder="Nº de transferencia / pago móvil" value={referencia} onChange={(e) => setReferencia(e.target.value)} autoFocus />
              </div>
              <p className="caption">Queda registrado quién lo pagó y cuándo. El monto se congela con el % actual.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setPagando(null)}>Cancelar</button>
                <button className="btn btn-primary" disabled={ocupado} onClick={pagar}>Confirmar pago</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
