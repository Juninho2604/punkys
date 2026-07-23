import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { fmtBs } from '../lib/format'
import { useTasa, usdEq } from '../lib/moneda'
import type { Quote } from '../lib/types'
import { SERVICIO_NOMBRE } from './Cotizacion'

// Hoja formal imprimible de la cotización (tamaño carta, blanco y negro).
// Espacios de firma: Director y Gerente de Cuentas por Cobrar.

interface EventoEstado {
  estado_anterior: string | null
  estado_nuevo: string
  usuario_nombre: string | null
  nota: string | null
  created_at: string
}
interface QuoteConVendedor extends Quote {
  vendedor?: string
  decidido_por?: string
  historial?: EventoEstado[]
}

const ESTADO_LABEL: Record<string, string> = {
  generada: 'Pedido creado', pendiente: 'En Cuentas por Cobrar', aprobada: 'Aprobado',
  rechazada: 'Rechazado', facturada: 'Facturado',
}

const fmtNum = (n: string | number, dec = 2) =>
  Number(n).toLocaleString('es-VE', { minimumFractionDigits: dec, maximumFractionDigits: dec })

export function ImprimirCotizacion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const tasa = useTasa()
  const [quote, setQuote] = useState<QuoteConVendedor | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<{ quote: QuoteConVendedor }>(`/quotes/${id}`)
      .then((r) => setQuote(r.quote))
      .catch((e) => setError(e instanceof Error ? e.message : 'No se pudo cargar'))
  }, [id])

  // Lanza el diálogo de impresión al cargar los datos
  useEffect(() => {
    if (quote) {
      const t = setTimeout(() => window.print(), 400)
      return () => clearTimeout(t)
    }
  }, [quote])

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: 'var(--font-ui)' }}>
        {error} — <a href="/" style={{ color: 'var(--brand-800)' }}>volver</a>
      </div>
    )
  }
  if (!quote) return null

  const items = quote.items ?? []
  const emitida = new Date(quote.created_at).toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div className="print-page">
      {/* Barra solo visible en pantalla */}
      <div className="print-toolbar no-print">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Volver</button>
        <span style={{ font: '700 14px var(--font-ui)', color: 'var(--ink-500)' }}>
          Vista de impresión · {quote.numero}
        </span>
        <button className="btn btn-primary" onClick={() => window.print()}>🖨 Imprimir</button>
      </div>

      <div className="print-sheet">
        {/* Membrete */}
        <header className="ps-head">
          <img src="/logo-letters.png" alt="Punky Partners" className="ps-logo" />
          <div className="ps-empresa">
            <div className="ps-empresa-nombre">Punky Partners</div>
            <div>Logística corporativa</div>
            <div>Caracas, Venezuela</div>
          </div>
        </header>

        <div className="ps-titulo">
          <h1>COTIZACIÓN DE SERVICIO DE TRANSPORTE</h1>
          <table className="ps-meta">
            <tbody>
              <tr><td>Nº de cotización:</td><td><strong>{quote.numero}</strong></td></tr>
              <tr><td>Fecha de emisión:</td><td>{emitida}</td></tr>
              <tr><td>Vendedor:</td><td>{quote.vendedor ?? '—'}</td></tr>
              {quote.factura_numero && (
                <tr><td>Nº de factura:</td><td><strong>{quote.factura_numero}</strong></td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cliente */}
        <section className="ps-seccion">
          <h2>Datos del cliente</h2>
          <table className="ps-datos">
            <tbody>
              <tr>
                <td className="k">Razón social</td><td>{quote.razon_social}</td>
                <td className="k">RIF</td><td>{quote.rif}</td>
              </tr>
              <tr>
                <td className="k">Persona de contacto</td><td>{quote.contacto || '—'}</td>
                <td className="k">Teléfono</td><td>{quote.telefono || '—'}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Entrega */}
        <section className="ps-seccion">
          <h2>Datos de entrega</h2>
          <table className="ps-datos">
            <tbody>
              <tr>
                <td className="k">Sede de origen</td><td>{quote.origen}</td>
                <td className="k">Ciudad destino</td><td>{quote.destino_ciudad}</td>
              </tr>
              <tr>
                <td className="k">Dirección de entrega</td><td colSpan={3}>{quote.destino_direccion}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Renglones */}
        <section className="ps-seccion">
          <h2>Detalle de la cotización</h2>
          {items.length > 0 ? (
            <table className="ps-precios">
              <thead>
                <tr>
                  <th>Código</th><th>Descripción</th><th className="num">Cant.</th>
                  <th className="num">Precio unit.</th><th className="num">Monto</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.codigo}</td>
                    <td>{i.nombre}</td>
                    <td className="num">{i.cantidad}</td>
                    <td className="num">{fmtBs(i.precio_unit)}</td>
                    <td className="num">{fmtBs(i.total)}</td>
                  </tr>
                ))}
                <tr className="sub">
                  <td colSpan={4}>Subtotal</td>
                  <td className="num">{fmtBs(quote.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={4}>IVA (16%)</td>
                  <td className="num">{fmtBs(quote.iva)}</td>
                </tr>
                <tr className="total">
                  <td colSpan={4}>TOTAL</td>
                  <td className="num">
                    {fmtBs(quote.total)}
                    {usdEq(Number(quote.total), tasa) && <div className="ps-usd">{usdEq(Number(quote.total), tasa)}</div>}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            // Cotizaciones históricas (modelo de transporte por peso/servicio)
            <table className="ps-precios">
              <thead>
                <tr><th>Concepto</th><th>Detalle</th><th className="num">Monto</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Flete base</td>
                  <td>{SERVICIO_NOMBRE[quote.servicio ?? ''] ?? quote.servicio ?? '—'}</td>
                  <td className="num">{quote.flete_base ? fmtBs(quote.flete_base) : '—'}</td>
                </tr>
                <tr>
                  <td>Cargo por peso</td>
                  <td>{quote.peso_kg ? `${fmtNum(quote.peso_kg)} kg` : '—'}</td>
                  <td className="num">{quote.cargo_peso ? fmtBs(quote.cargo_peso) : '—'}</td>
                </tr>
                <tr>
                  <td>Seguro de mercancía</td>
                  <td>2% del valor declarado</td>
                  <td className="num">{quote.seguro ? fmtBs(quote.seguro) : '—'}</td>
                </tr>
                <tr className="sub">
                  <td colSpan={2}>Subtotal</td>
                  <td className="num">{fmtBs(quote.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={2}>IVA (16%)</td>
                  <td className="num">{fmtBs(quote.iva)}</td>
                </tr>
                <tr className="total">
                  <td colSpan={2}>TOTAL</td>
                  <td className="num">
                    {fmtBs(quote.total)}
                    {usdEq(Number(quote.total), tasa) && <div className="ps-usd">{usdEq(Number(quote.total), tasa)}</div>}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </section>

        <p className="ps-nota">
          Montos expresados en bolívares (Bs.). Cotización sujeta a aprobación por el área de
          Cuentas por Cobrar. Referencia ERP: {quote.pp_external_ref ?? 'pendiente de sincronización'}.
        </p>

        {/* Bitácora de estados del pedido */}
        {quote.historial && quote.historial.length > 0 && (
          <section className="ps-historial">
            <h3 className="ps-h3">Historial del pedido</h3>
            <ul>
              {quote.historial.map((h, i) => (
                <li key={i}>
                  <strong>{ESTADO_LABEL[h.estado_nuevo] ?? h.estado_nuevo}</strong>
                  {h.usuario_nombre ? ` · ${h.usuario_nombre}` : ''}
                  {' · '}{new Date(h.created_at).toLocaleString('es-VE')}
                  {h.nota ? ` — ${h.nota}` : ''}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Firmas */}
        <footer className="ps-firmas">
          <div className="firma">
            <div className="linea" />
            <div className="cargo">Director</div>
          </div>
          <div className="firma">
            <div className="linea" />
            <div className="cargo">Gerente de Cuentas por Cobrar</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
