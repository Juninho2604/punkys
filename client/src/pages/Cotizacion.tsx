import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, Plus, Minus, X } from 'lucide-react'
import { api } from '../lib/api'
import { fmtBs } from '../lib/format'
import { useTasa, usdEq } from '../lib/moneda'
import { useToast } from '../lib/toast'
import { usePend } from '../components/Shell'
import type { Producto, Quote } from '../lib/types'

// Nombres de los servicios del modelo viejo (solo para mostrar cotizaciones históricas)
export const SERVICIO_NOMBRE: Record<string, string> = {
  terrestre: 'Terrestre Estándar',
  express: 'Express 24h',
  frio: 'Cadena de Frío',
  especial: 'Manejo Especial',
}

const PASOS = ['Cliente', 'Origen y destino', 'Productos', 'Resumen']
const ORIGENES = ['Almacén Boleíta', 'Almacén Principal']
const CIUDAD_DEFAULT = 'Caracas'
const RIF_RE = /^[VEJPG]-?\d{7,9}-?\d$/i
const IVA_RATE = 0.16

interface Form {
  razonSocial: string
  rif: string
  telefono: string
  contacto: string
  origen: string
  otraCiudad: boolean
  destinoCiudad: string
  destinoDireccion: string
}

const FORM_INICIAL: Form = {
  razonSocial: '', rif: '', telefono: '', contacto: '',
  origen: ORIGENES[0], otraCiudad: false, destinoCiudad: '', destinoDireccion: '',
}

interface Renglon {
  codigo: string
  nombre: string
  precio: number
  cantidad: number
  stock: number // disponible en la sede de origen al momento de agregar
}

export function Cotizacion() {
  const toast = useToast()
  const { refreshPend } = usePend()
  const tasa = useTasa()
  const [paso, setPaso] = useState(0)
  const [form, setForm] = useState<Form>(FORM_INICIAL)
  const [items, setItems] = useState<Renglon[]>([])
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [generada, setGenerada] = useState<Quote | null>(null)
  const [ocupado, setOcupado] = useState(false)

  // Buscador de inventario
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState<Producto[]>([])
  const [buscando, setBuscando] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (paso !== 2) return
    setBuscando(true)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => {
      api
        .get<{ productos: Producto[] }>(`/inventario/search?q=${encodeURIComponent(busqueda)}`)
        .then((r) => setResultados(r.productos))
        .catch(() => setResultados([]))
        .finally(() => setBuscando(false))
    }, 300)
    return () => clearTimeout(debounce.current)
  }, [busqueda, paso])

  // El stock depende de la sede: si cambia el origen, la lista se invalida
  const origenPrevio = useRef(form.origen)
  useEffect(() => {
    if (form.origen !== origenPrevio.current) {
      origenPrevio.current = form.origen
      if (items.length > 0) {
        setItems([])
        toast('Cambiaste la sede de origen: la lista de productos se vació (el stock es por sede)')
      }
    }
  }, [form.origen, items.length, toast])

  const set = (k: keyof Form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrores((e) => ({ ...e, [k]: '' }))
  }

  const totales = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
    const iva = subtotal * IVA_RATE
    return { subtotal, iva, total: subtotal + iva }
  }, [items])

  const unidades = items.reduce((s, i) => s + i.cantidad, 0)

  function stockDe(p: Producto): number {
    return p.stock[form.origen] ?? 0
  }

  function agregar(p: Producto) {
    const disponible = stockDe(p)
    setItems((prev) => {
      const ya = prev.find((i) => i.codigo === p.codigo)
      if (ya) {
        if (ya.cantidad >= disponible) {
          toast(`Solo quedan ${disponible} de "${p.nombre}" en ${form.origen}`)
          return prev
        }
        return prev.map((i) => (i.codigo === p.codigo ? { ...i, cantidad: i.cantidad + 1 } : i))
      }
      return [...prev, { codigo: p.codigo, nombre: p.nombre, precio: p.precio, cantidad: 1, stock: disponible }]
    })
    setErrores((e) => ({ ...e, items: '' }))
  }

  function cambiarCantidad(codigo: string, delta: number) {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.codigo !== codigo) return i
          const cantidad = i.cantidad + delta
          if (cantidad > i.stock) {
            toast(`Solo quedan ${i.stock} en ${form.origen}`)
            return i
          }
          return { ...i, cantidad }
        })
        .filter((i) => i.cantidad > 0),
    )
  }

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
      if (items.length === 0) e.items = 'Agrega al menos un producto del inventario'
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
        items: items.map((i) => ({ codigo: i.codigo, cantidad: i.cantidad })),
      })
      setGenerada(r.quote)
      refreshPend()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo generar el pedido')
    } finally {
      setOcupado(false)
    }
  }

  function reset() {
    setForm(FORM_INICIAL)
    setItems([])
    setPaso(0)
    setGenerada(null)
    setErrores({})
    setBusqueda('')
  }

  const input = (k: keyof Form, label: string, props: { placeholder?: string; full?: boolean } = {}) => (
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
          <h2 style={{ font: '700 24px var(--font-display)', color: 'var(--brand-900)', margin: '0 0 6px' }}>¡Pedido recibido!</h2>
          <p className="subtitle" style={{ margin: '0 0 6px' }}>
            Número <b style={{ color: 'var(--brand-800)' }}>{generada.numero}</b> · {generada.razon_social}
          </p>
          <p className="subtitle" style={{ margin: '0 0 4px', color: 'var(--success-600)', fontWeight: 700 }}>
            Ya está en Cuentas por Cobrar ✓
          </p>
          <div style={{ margin: '14px 0 26px' }}>
            <div style={{ font: '700 30px var(--font-display)', color: 'var(--brand-900)' }}>{fmtBs(generada.total)}</div>
            {usdEq(Number(generada.total), tasa) && (
              <div style={{ font: '700 14px var(--font-ui)', color: 'var(--ink-500)', marginTop: 2 }}>{usdEq(Number(generada.total), tasa)}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={reset}>Nuevo pedido</button>
            <button className="btn btn-secondary" onClick={() => window.open(`/cotizaciones/${generada.id}/imprimir`, '_blank')}>
              🖨 Imprimir
            </button>
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
            <h2 className="h2">Productos</h2>
            <p className="subtitle" style={{ margin: '0 0 16px' }}>
              Busca en el inventario y agrega renglones. Stock mostrado: <b>{form.origen}</b>.
            </p>

            <div className="inv-search" style={{ marginBottom: 14 }}>
              <Search size={15} strokeWidth={2.4} color="var(--ink-300)" />
              <input
                placeholder="Buscar producto por nombre o código…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="inv-resultados">
              {buscando && <div className="cell-sub" style={{ padding: 10 }}>Buscando…</div>}
              {!buscando && resultados.length === 0 && (
                <div className="cell-sub" style={{ padding: 10 }}>Sin resultados para “{busqueda}”.</div>
              )}
              {!buscando &&
                resultados.map((p) => {
                  const disp = stockDe(p)
                  const enLista = items.find((i) => i.codigo === p.codigo)
                  const agotado = disp === 0
                  const alTope = enLista ? enLista.cantidad >= disp : false
                  return (
                    <div key={p.codigo} className={`inv-item${agotado ? ' agotado' : ''}`}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ font: '800 13.5px var(--font-ui)', color: 'var(--ink-900)' }}>{p.nombre}</div>
                        <div className="caption">{p.codigo} · {fmtBs(p.precio)}</div>
                      </div>
                      <span className={`inv-stock ${agotado ? 'rojo' : disp <= 10 ? 'ambar' : 'verde'}`}>
                        {agotado ? 'Sin stock' : `${disp} disp.`}
                      </span>
                      <button
                        className="btn btn-primary inv-add"
                        disabled={agotado || alTope}
                        onClick={() => agregar(p)}
                        title={agotado ? `Sin existencia en ${form.origen}` : 'Agregar'}
                      >
                        <Plus size={16} strokeWidth={2.6} />
                      </button>
                    </div>
                  )
                })}
            </div>

            {errores.items && <div className="field-error" style={{ marginTop: 10 }}>{errores.items}</div>}

            {items.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <label className="field-label">Renglones de la cotización</label>
                <div className="inv-carrito">
                  {items.map((i) => (
                    <div key={i.codigo} className="inv-renglon">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ font: '800 13.5px var(--font-ui)', color: 'var(--ink-900)' }}>{i.nombre}</div>
                        <div className="caption">{fmtBs(i.precio)} c/u · quedan {i.stock}</div>
                      </div>
                      <div className="inv-qty">
                        <button onClick={() => cambiarCantidad(i.codigo, -1)}><Minus size={14} strokeWidth={2.6} /></button>
                        <span>{i.cantidad}</span>
                        <button onClick={() => cambiarCantidad(i.codigo, +1)} disabled={i.cantidad >= i.stock}><Plus size={14} strokeWidth={2.6} /></button>
                      </div>
                      <div style={{ font: '800 13.5px var(--font-ui)', color: 'var(--ink-900)', width: 110, textAlign: 'right' }}>
                        {fmtBs(i.precio * i.cantidad)}
                      </div>
                      <button className="inv-quitar" title="Quitar" onClick={() => setItems((prev) => prev.filter((x) => x.codigo !== i.codigo))}>
                        <X size={15} strokeWidth={2.6} />
                      </button>
                    </div>
                  ))}
                  <div className="inv-total-linea">
                    <span>{items.length} producto{items.length === 1 ? '' : 's'} · {unidades} unidad{unidades === 1 ? '' : 'es'}</span>
                    <span>Subtotal: <b>{fmtBs(totales.subtotal)}</b></span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {paso === 3 && (
          <>
            <h2 className="h2">Resumen</h2>
            <p className="subtitle" style={{ margin: '0 0 22px' }}>Revisa los renglones antes de generar la cotización.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              <span className="chip">{form.razonSocial} · {form.rif.toUpperCase()}</span>
              <span className="chip">{form.origen} → {form.otraCiudad ? form.destinoCiudad : CIUDAD_DEFAULT}</span>
              <span className="chip">{items.length} producto{items.length === 1 ? '' : 's'} · {unidades} und</span>
            </div>
            <div className="pricing-table">
              <div className="pricing-head"><span>Producto</span><span>Cantidad × precio</span><span style={{ textAlign: 'right' }}>Monto</span></div>
              {items.map((i) => (
                <div key={i.codigo} className="pricing-row">
                  <span style={{ font: '700 13.5px var(--font-ui)', color: 'var(--ink-900)' }}>{i.nombre}</span>
                  <span className="cell-sub">{i.cantidad} × {fmtBs(i.precio)}</span>
                  <span style={{ font: '700 13.5px var(--font-ui)', color: 'var(--ink-900)', textAlign: 'right' }}>{fmtBs(i.precio * i.cantidad)}</span>
                </div>
              ))}
              <div className="pricing-row">
                <span style={{ font: '700 13.5px var(--font-ui)', color: 'var(--ink-900)' }}>Subtotal</span>
                <span />
                <span style={{ font: '700 13.5px var(--font-ui)', color: 'var(--ink-900)', textAlign: 'right' }}>{fmtBs(totales.subtotal)}</span>
              </div>
              <div className="pricing-row">
                <span style={{ font: '700 13.5px var(--font-ui)', color: 'var(--ink-900)' }}>IVA</span>
                <span className="cell-sub">16% sobre subtotal</span>
                <span style={{ font: '700 13.5px var(--font-ui)', color: 'var(--ink-900)', textAlign: 'right' }}>{fmtBs(totales.iva)}</span>
              </div>
              <div className="pricing-total">
                <span style={{ font: '700 15px var(--font-display)', color: '#fff' }}>Total cotización</span>
                <span style={{ textAlign: 'right' }}>
                  <span style={{ font: '700 20px var(--font-display)', color: '#fff', display: 'block' }}>{fmtBs(totales.total)}</span>
                  {usdEq(totales.total, tasa) && (
                    <span style={{ font: '700 12px var(--font-ui)', color: 'rgba(255,255,255,0.82)' }}>{usdEq(totales.total, tasa)}</span>
                  )}
                </span>
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
