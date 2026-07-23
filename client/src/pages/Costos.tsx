import { useEffect, useState } from 'react'
import { Truck, Pencil, TrendingUp, TrendingDown } from 'lucide-react'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'
import { useTasa, bs, usdEq } from '../lib/moneda'

interface Despacho {
  id: number
  numero: string
  cliente: string
  estado: string
  created_at: string
  venta: number
  costoFlete: number
  costoCombustible: number
  costoPeaje: number
  costoOtros: number
  costoNota: string
  costo: number
  tieneCostos: boolean
  margen: number | null
  margenPct: number | null
}
interface Totales {
  venta: number
  costo: number
  margen: number
  despachos: number
  sinCostos: number
}

const fmtFecha = (s: string) => new Date(s).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })

export function Costos() {
  const toast = useToast()
  const tasa = useTasa()
  const [despachos, setDespachos] = useState<Despacho[]>([])
  const [totales, setTotales] = useState<Totales | null>(null)
  const [cargando, setCargando] = useState(true)
  const [editar, setEditar] = useState<Despacho | null>(null)
  const [form, setForm] = useState({ flete: '', combustible: '', peaje: '', otros: '', nota: '' })
  const [guardando, setGuardando] = useState(false)

  function cargar() {
    setCargando(true)
    api
      .get<{ despachos: Despacho[]; totales: Totales }>('/shipments/costos')
      .then((r) => {
        setDespachos(r.despachos)
        setTotales(r.totales)
      })
      .catch((e) => toast(e instanceof Error ? e.message : 'No se pudieron cargar los costos'))
      .finally(() => setCargando(false))
  }
  useEffect(cargar, [])

  function abrir(d: Despacho) {
    setForm({
      flete: d.costoFlete ? String(d.costoFlete) : '',
      combustible: d.costoCombustible ? String(d.costoCombustible) : '',
      peaje: d.costoPeaje ? String(d.costoPeaje) : '',
      otros: d.costoOtros ? String(d.costoOtros) : '',
      nota: d.costoNota ?? '',
    })
    setEditar(d)
  }

  async function guardar() {
    if (!editar) return
    setGuardando(true)
    try {
      await api.patch(`/shipments/${editar.id}/costos`, {
        costoFlete: form.flete ? Number(form.flete) : 0,
        costoCombustible: form.combustible ? Number(form.combustible) : 0,
        costoPeaje: form.peaje ? Number(form.peaje) : 0,
        costoOtros: form.otros ? Number(form.otros) : 0,
        costoNota: form.nota.trim(),
      })
      toast('Costos guardados ✓')
      setEditar(null)
      cargar()
    } catch (e) {
      toast(e instanceof Error ? e.message : 'No se pudo guardar')
    } finally {
      setGuardando(false)
    }
  }

  const margenPositivo = (totales?.margen ?? 0) >= 0

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="subtitle" style={{ margin: 0 }}>
        Rentabilidad real por despacho: venta del pedido menos los costos logísticos. Montos en Bs, referencia en USD (tasa BCV).
      </p>

      {/* KPIs */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <div className="card card-kpi" style={{ padding: 18 }}>
          <div className="caption">VENTA (despachos con costo)</div>
          <div style={{ font: '800 22px var(--font-display)', color: 'var(--brand-900)' }}>{bs(totales?.venta ?? 0)}</div>
          <div className="caption">{usdEq(totales?.venta ?? 0, tasa)}</div>
        </div>
        <div className="card card-kpi" style={{ padding: 18 }}>
          <div className="caption">COSTO LOGÍSTICO</div>
          <div style={{ font: '800 22px var(--font-display)', color: 'var(--ink-900)' }}>{bs(totales?.costo ?? 0)}</div>
          <div className="caption">{usdEq(totales?.costo ?? 0, tasa)}</div>
        </div>
        <div className="card card-kpi" style={{ padding: 18 }}>
          <div className="caption">MARGEN</div>
          <div style={{ font: '800 22px var(--font-display)', color: margenPositivo ? 'var(--success-600)' : 'var(--danger-600, #c0392b)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {margenPositivo ? <TrendingUp size={20} strokeWidth={2.4} /> : <TrendingDown size={20} strokeWidth={2.4} />}
            {bs(totales?.margen ?? 0)}
          </div>
          <div className="caption">
            {usdEq(totales?.margen ?? 0, tasa)}
            {totales && totales.venta > 0 ? ` · ${Math.round((totales.margen / totales.venta) * 1000) / 10}%` : ''}
          </div>
        </div>
      </div>

      {totales && totales.sinCostos > 0 && (
        <div className="caption" style={{ color: 'var(--ink-500)' }}>
          {totales.sinCostos} despacho{totales.sinCostos === 1 ? '' : 's'} sin costos cargados todavía.
        </div>
      )}

      {/* Tabla */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="tabla-datos" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Despacho</th>
                <th style={{ textAlign: 'left' }}>Cliente</th>
                <th style={{ textAlign: 'right' }}>Venta</th>
                <th style={{ textAlign: 'right' }}>Costo</th>
                <th style={{ textAlign: 'right' }}>Margen</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan={6} className="cell-sub" style={{ padding: 16 }}>Cargando…</td></tr>
              ) : despachos.length === 0 ? (
                <tr><td colSpan={6} className="cell-sub" style={{ padding: 16 }}>Aún no hay despachos.</td></tr>
              ) : (
                despachos.map((d) => (
                  <tr key={d.id} style={{ borderTop: '1px solid var(--line-100)' }}>
                    <td>
                      <div style={{ font: '700 13px var(--font-ui)', color: 'var(--ink-900)' }}>{d.numero}</div>
                      <div className="caption">{fmtFecha(d.created_at)}</div>
                    </td>
                    <td className="cell-sub">{d.cliente}</td>
                    <td style={{ textAlign: 'right' }}>{bs(d.venta)}</td>
                    <td style={{ textAlign: 'right' }}>{d.tieneCostos ? bs(d.costo) : <span className="caption">—</span>}</td>
                    <td style={{ textAlign: 'right' }}>
                      {d.margen == null ? (
                        <span className="caption">sin costos</span>
                      ) : (
                        <span style={{ font: '700 13px var(--font-ui)', color: d.margen >= 0 ? 'var(--success-600)' : 'var(--danger-600, #c0392b)' }}>
                          {bs(d.margen)}{d.margenPct != null ? ` · ${d.margenPct}%` : ''}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => abrir(d)} style={{ padding: '6px 10px' }}>
                        <Pencil size={14} strokeWidth={2.4} /> {d.tieneCostos ? 'Editar' : 'Cargar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editar && (
        <div className="modal-backdrop" onClick={() => setEditar(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 2px' }}>
              <Truck size={18} strokeWidth={2.4} /> Costos · {editar.numero}
            </h3>
            <div className="caption" style={{ marginBottom: 12 }}>{editar.cliente} · Venta {bs(editar.venta)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {([
                ['flete', 'Flete'],
                ['combustible', 'Combustible'],
                ['peaje', 'Peaje'],
                ['otros', 'Otros'],
              ] as const).map(([k, label]) => (
                <div className="field" key={k}>
                  <label className="field-label">{label} (Bs)</label>
                  <input
                    className="input-text"
                    inputMode="decimal"
                    value={form[k]}
                    onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label className="field-label">Nota (opcional)</label>
              <input className="input-text" value={form.nota} onChange={(e) => setForm((f) => ({ ...f, nota: e.target.value }))} placeholder="Detalle del costo…" />
            </div>
            {(() => {
              const costo = ['flete', 'combustible', 'peaje', 'otros'].reduce((s, k) => s + (Number(form[k as keyof typeof form]) || 0), 0)
              const margen = editar.venta - costo
              return (
                <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: '#f4f8ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="caption">Margen estimado</span>
                  <strong style={{ font: '800 16px var(--font-display)', color: margen >= 0 ? 'var(--success-600)' : 'var(--danger-600, #c0392b)' }}>
                    {bs(margen)}{editar.venta > 0 ? ` · ${Math.round((margen / editar.venta) * 1000) / 10}%` : ''}
                  </strong>
                </div>
              )
            })()}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
              <button className="btn btn-secondary" onClick={() => setEditar(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardar} disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar costos'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
