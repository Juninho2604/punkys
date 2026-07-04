import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { fmtBs } from '../lib/format'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { usePend } from '../components/Shell'
import type { Quote, Servicio } from '../lib/types'

export const SERVICIO_NOMBRE: Record<string, string> = {
  terrestre: 'Terrestre Estándar',
  express: 'Express 24h',
  frio: 'Cadena de Frío',
  especial: 'Manejo Especial',
}

const PASOS = ['Cliente', 'Origen y destino', 'Carga y servicio', 'Precios y resumen']
// Sedes de origen de los despachos
const ORIGENES = ['Almacén Boleíta', 'Almacén Principal']
// Destino por defecto; solo se pide la ciudad si el envío va fuera de Caracas
const CIUDAD_DEFAULT = 'Caracas'
const RIF_RE = /^[VEJPG]-?\d{7,9}-?\d$/i

interface Form {
  razonSocial: string
  rif: string
  telefono: string
  contacto: string
  origen: string
  otraCiudad: boolean
  destinoCiudad: string
  destinoDireccion: string
  peso: string
  volumen: string
  bultos: string
  valor: string
  servicio: Servicio['id'] | null
}

const FORM_INICIAL: Form = {
  razonSocial: '', rif: '', telefono: '', contacto: '',
  origen: ORIGENES[0], otraCiudad: false, destinoCiudad: '', destinoDireccion: '',
  peso: '', volumen: '', bultos: '', valor: '', servicio: null,
}

const num = (s: string) => Number(s.replace(',', '.')) || 0

export function Cotizacion() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { refreshPend } = usePend()
  const [paso, setPaso] = useState(0)
  const [form, setForm] = useState<Form>(FORM_INICIAL)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [rates, setRates] = useState({ ivaRate: 0.16, seguroRate: 0.02 })
  const [generada, setGenerada] = useState<Quote | null>(null)
  const [ocupado, setOcupado] = useState(false)

  useEffect(() => {
    api.get<{ servicios: Servicio[]; ivaRate: number; seguroRate: number }>('/quotes/services').then((r) => {
      setServicios(r.servicios)
      setRates({ ivaRate: r.ivaRate, seguroRate: r.seguroRate })
    })
  }, [])

  const set = (k: keyof Form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrores((e) => ({ ...e, [k]: '' }))
  }

  // Desglose en vivo (el servidor recalcula al generar)
  const desglose = useMemo(() => {
    const sv = servicios.find((s) => s.id === form.servicio)
    if (!sv) return null
    const fleteBase = sv.base
    const cargoPeso = num(form.peso) * sv.porKg
    const seguro = num(form.valor) * rates.seguroRate
    const subtotal = fleteBase + cargoPeso + seguro
    const iva = subtotal * rates.ivaRate
    return { sv, fleteBase, cargoPeso, seguro, subtotal, iva, total: subtotal + iva }
  }, [form.servicio, form.peso, form.valor, servicios, rates])

  function validar(p: number): boolean {
    const e: Record<string, string> = {}
    if (p === 0) {
      if (form.razonSocial.trim().length < 2) e.razonSocial = 'Indica la razón social del cliente'
      if (!RIF_RE.test(form.rif.trim())) e.rif = 'RIF inválido. Formato: J-00000000-0'
    }
    if (p === 1) {
      if (form.otraCiudad && form.destinoCiudad.trim().length < 2) e.destinoCiudad = 'Indica la ciudad destino'
      if (form.destinoDireccion.trim().length < 5) e.destinoDireccion = 'Indica la dirección de entrega'
    }
    if (p === 2) {
      if (num(form.peso) <= 0) e.peso = 'El peso debe ser mayor que 0'
      if (!form.servicio) e.servicio = 'Selecciona un tipo de servicio'
    }
    setErrores(e)
    return Object.keys(e).length === 0
  }

  async function generar() {
    if (!validar(2)) { setPaso(2); return }
    setOcupado(true)
    try {
      const r = await api.post<{ quote: Quote }>('/quotes', {
        razonSocial: form.razonSocial.trim(),
        rif: form.rif.trim().toUpperCase(),
        telefono: form.telefono.trim(),
        contacto: form.contacto.trim(),
        origen: form.origen,
        destinoCiudad: form.otraCiudad ? form.destinoCiudad.trim() : CIUDAD_DEFAULT,
        destinoDireccion: form.destinoDireccion.trim(),
        pesoKg: num(form.peso),
        volumenM3: num(form.volumen),
        bultos: Math.max(1, Math.round(num(form.bultos))),
        valorDeclarado: num(form.valor),
        servicio: form.servicio,
      })
      setGenerada(r.quote)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo generar la cotización')
    } finally {
      setOcupado(false)
    }
  }

  async function enviarAprobacion() {
    if (!generada) return
    setOcupado(true)
    try {
      await api.post(`/quotes/${generada.id}/submit`)
      toast(`${generada.numero} enviada a aprobación ✓`)
      refreshPend()
      navigate(user?.rol === 'vendedor' ? '/' : '/aprobaciones')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo enviar')
      setOcupado(false)
    }
  }

  function reset() {
    setForm(FORM_INICIAL)
    setPaso(0)
    setGenerada(null)
    setErrores({})
  }

  const input = (k: keyof Form, label: string, props: { placeholder?: string; full?: boolean; type?: string } = {}) => (
    <div className={`field${props.full ? ' full' : ''}`}>
      <label className="field-label">{label}</label>
      <input
        className={`input-text${errores[k] ? ' error' : ''}`}
        placeholder={props.placeholder}
        value={String(form[k] ?? '')}
        onChange={(e) => set(k)(e.target.value)}
      />
      {errores[k] && <div className="field-error">{errores[k]}</div>}
    </div>
  )

  if (generada) {
    return (
      <div className="fade-up" style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="card success-card" style={{ borderRadius: 16, padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--success-600)" strokeWidth="2.6"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </div>
          <h2 style={{ font: '700 24px var(--font-display)', color: 'var(--brand-900)', margin: '0 0 6px' }}>¡Cotización generada!</h2>
          <p className="subtitle" style={{ margin: '0 0 6px' }}>
            Número <b style={{ color: 'var(--brand-800)' }}>{generada.numero}</b> · {generada.razon_social}
          </p>
          <div style={{ font: '700 30px var(--font-display)', color: 'var(--brand-900)', margin: '14px 0 26px' }}>{fmtBs(generada.total)}</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={reset}>Nueva cotización</button>
            <button className="btn btn-secondary" onClick={() => window.open(`/cotizaciones/${generada.id}/imprimir`, '_blank')}>
              🖨 Imprimir
            </button>
            <button className="btn btn-primary" onClick={enviarAprobacion} disabled={ocupado}>Enviar a aprobación →</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-up" style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* stepper-quote */}
      <div className="card stepper">
        {PASOS.map((label, i) => {
          const done = i < paso
          const active = i === paso
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < PASOS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
                <div className={`step-circle ${done ? 'done' : active ? 'active' : 'future'}`}>{done ? '✓' : i + 1}</div>
                <span className="step-label" style={{ font: '800 13px var(--font-ui)', color: active || done ? 'var(--ink-900)' : 'var(--ink-500)', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < PASOS.length - 1 && <div className={`step-line${done ? ' done' : ''}`} />}
            </div>
          )
        })}
      </div>

      <div className="card card-pad-lg" style={{ padding: 28 }}>
        {paso === 0 && (
          <>
            <h2 className="h2">Datos del cliente</h2>
            <p className="subtitle" style={{ margin: '0 0 22px' }}>Identifica a quién va dirigida la cotización.</p>
            <div className="form-grid-2">
              {input('razonSocial', 'Razón social', { placeholder: 'Ej: Farmatodo C.A.', full: true })}
              {input('rif', 'RIF', { placeholder: 'J-00000000-0' })}
              {input('telefono', 'Teléfono', { placeholder: '+58 412 000 0000' })}
              {input('contacto', 'Persona de contacto', { placeholder: 'Nombre y apellido', full: true })}
            </div>
          </>
        )}

        {paso === 1 && (
          <>
            <h2 className="h2">Origen y destino</h2>
            <p className="subtitle" style={{ margin: '0 0 22px' }}>Define la ruta del envío. Las entregas son en Caracas salvo que indiques otra ciudad.</p>
            <div className="form-grid-2">
              <div className="field">
                <label className="field-label">Sede de origen</label>
                <select className="input-text" value={form.origen} onChange={(e) => set('origen')(e.target.value)}>
                  {ORIGENES.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Ciudad destino</label>
                <label
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                    border: '1.5px solid var(--line-100)', borderRadius: 10, background: '#fbfdff',
                    font: '600 14px var(--font-ui)', color: 'var(--ink-900)', cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.otraCiudad}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, otraCiudad: e.target.checked, destinoCiudad: '' }))
                      setErrores((er) => ({ ...er, destinoCiudad: '' }))
                    }}
                    style={{ width: 16, height: 16, accentColor: 'var(--brand-800)', flex: 'none' }}
                  />
                  {form.otraCiudad ? '¿Va a otra ciudad? Sí' : `${CIUDAD_DEFAULT} · ¿Va a otra ciudad?`}
                </label>
              </div>
              {form.otraCiudad && input('destinoCiudad', '¿A qué ciudad va?', { placeholder: 'Ej: Maracaibo', full: true })}
              {input('destinoDireccion', 'Dirección de entrega', { placeholder: 'Av., calle, local, punto de referencia', full: true })}
            </div>
          </>
        )}

        {paso === 2 && (
          <>
            <h2 className="h2">Carga y servicio</h2>
            <p className="subtitle" style={{ margin: '0 0 22px' }}>Describe la mercancía y elige el tipo de servicio.</p>
            <div className="form-grid-4">
              {input('peso', 'Peso (kg)', { placeholder: '240' })}
              {input('volumen', 'Volumen (m³)', { placeholder: '1.8' })}
              {input('bultos', 'Bultos', { placeholder: '18' })}
              {input('valor', 'Valor declarado (Bs.)', { placeholder: '85.000' })}
            </div>
            <label className="field-label">Tipo de servicio</label>
            <div className="service-grid">
              {servicios.map((sv) => (
                <div
                  key={sv.id}
                  className={`service-card${form.servicio === sv.id ? ' selected' : ''}`}
                  onClick={() => { setForm((f) => ({ ...f, servicio: sv.id })); setErrores((e) => ({ ...e, servicio: '' })) }}
                >
                  <div className="service-dot" />
                  <div style={{ flex: 1 }}>
                    <div style={{ font: '800 14px var(--font-ui)', color: 'var(--ink-900)' }}>{sv.nombre}</div>
                    <div style={{ font: '600 12.5px var(--font-ui)', color: 'var(--ink-500)' }}>{sv.detalle}</div>
                  </div>
                  <div style={{ font: '800 13px var(--font-ui)', color: 'var(--brand-800)', whiteSpace: 'nowrap' }}>
                    Bs. {sv.base.toLocaleString('es-VE')} + Bs. {sv.porKg}/kg
                  </div>
                </div>
              ))}
            </div>
            {errores.servicio && <div className="field-error" style={{ marginTop: 8 }}>{errores.servicio}</div>}
          </>
        )}

        {paso === 3 && desglose && (
          <>
            <h2 className="h2">Precios y resumen</h2>
            <p className="subtitle" style={{ margin: '0 0 22px' }}>Revisa el desglose antes de generar la cotización.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              <span className="chip">{form.razonSocial} · {form.rif.toUpperCase()}</span>
              <span className="chip">{form.origen} → {form.otraCiudad ? form.destinoCiudad : CIUDAD_DEFAULT}</span>
              <span className="chip">{num(form.peso).toLocaleString('es-VE')} kg · {Math.max(1, Math.round(num(form.bultos)))} bultos</span>
              <span className="chip">{desglose.sv.nombre}</span>
            </div>
            <div className="pricing-table">
              <div className="pricing-head"><span>Concepto</span><span>Detalle</span><span style={{ textAlign: 'right' }}>Monto</span></div>
              {[
                { c: 'Flete base', d: desglose.sv.nombre, m: desglose.fleteBase },
                { c: 'Cargo por peso', d: `${num(form.peso).toLocaleString('es-VE')} kg × Bs. ${desglose.sv.porKg}/kg`, m: desglose.cargoPeso },
                { c: 'Seguro de mercancía', d: `2% del valor declarado (${fmtBs(num(form.valor))})`, m: desglose.seguro },
                { c: 'IVA', d: '16% sobre subtotal', m: desglose.iva },
              ].map((r) => (
                <div key={r.c} className="pricing-row">
                  <span style={{ font: '700 13.5px var(--font-ui)', color: 'var(--ink-900)' }}>{r.c}</span>
                  <span className="cell-sub">{r.d}</span>
                  <span style={{ font: '700 13.5px var(--font-ui)', color: 'var(--ink-900)', textAlign: 'right' }}>{fmtBs(r.m)}</span>
                </div>
              ))}
              <div className="pricing-total">
                <span style={{ font: '700 15px var(--font-display)', color: '#fff' }}>Total cotización</span>
                <span style={{ font: '700 20px var(--font-display)', color: '#fff', textAlign: 'right' }}>{fmtBs(desglose.total)}</span>
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 26, paddingTop: 20, borderTop: '1px solid var(--line-100)' }}>
          <button
            className="btn btn-secondary"
            style={{ visibility: paso === 0 ? 'hidden' : 'visible' }}
            onClick={() => setPaso((p) => Math.max(0, p - 1))}
          >
            ← Anterior
          </button>
          {paso < 3 ? (
            <button className="btn btn-primary" onClick={() => { if (validar(paso)) setPaso((p) => p + 1) }}>
              Siguiente →
            </button>
          ) : (
            <button className="btn btn-cta" onClick={generar} disabled={ocupado}>
              {ocupado ? 'Generando…' : 'Generar Cotización'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
