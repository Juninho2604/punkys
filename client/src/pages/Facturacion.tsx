import { useCallback, useEffect, useState } from 'react'
import { Printer, ReceiptText } from 'lucide-react'
import { api } from '../lib/api'
import { fmtBs, fmtFecha } from '../lib/format'
import { useToast } from '../lib/toast'
import { usePend } from '../components/Shell'
import { Badge } from '../components/Badge'
import type { Quote } from '../lib/types'

// Cola de Facturación (flujo real: CxC aprueba → Facturación emite la factura
// en Profit y registra aquí el número → nace la orden de despacho).

export function Facturacion() {
  const toast = useToast()
  const { refreshPend } = usePend()
  const [porFacturar, setPorFacturar] = useState<Quote[]>([])
  const [facturadas, setFacturadas] = useState<Quote[]>([])
  const [registrando, setRegistrando] = useState<Quote | null>(null)
  const [numero, setNumero] = useState('')
  const [ocupado, setOcupado] = useState(false)

  const cargar = useCallback(() => {
    api.get<{ quotes: Quote[] }>('/quotes?estado=aprobada').then((r) => setPorFacturar([...r.quotes].reverse())).catch(console.error)
    api.get<{ quotes: Quote[] }>('/quotes?estado=facturada').then((r) => setFacturadas(r.quotes.slice(0, 10))).catch(console.error)
  }, [])
  useEffect(cargar, [cargar])

  async function facturar() {
    if (!registrando) return
    setOcupado(true)
    try {
      await api.post(`/quotes/${registrando.id}/facturar`, { facturaNumero: numero.trim() })
      toast(`${registrando.numero} facturada (Nº ${numero.trim()}) → orden de despacho creada ✓`)
      setRegistrando(null)
      setNumero('')
      cargar()
      refreshPend()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo registrar')
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 className="h1-module">Facturación</h1>
        <p className="subtitle">Cotizaciones aprobadas por CxC. Emite la factura en Profit y registra aquí el número: eso crea la orden de despacho.</p>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header">
          <div className="h3-card">Por facturar</div>
          <span className="caption">{porFacturar.length} en cola · las más antiguas primero</span>
        </div>
        {porFacturar.length === 0 && (
          <div style={{ padding: '18px 20px' }} className="cell-sub">Cola vacía. Nada pendiente por facturar. ✓</div>
        )}
        {porFacturar.map((q) => (
          <div key={q.id} style={{ padding: '14px 20px', borderTop: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span className="cell-id">{q.numero}</span>
                <span className="caption">aprobada {fmtFecha(q.created_at)}</span>
              </div>
              <div className="cell-sub">{q.razon_social} · {q.resumen ?? ''}</div>
            </div>
            <span style={{ font: '800 14.5px var(--font-ui)', color: 'var(--ink-900)' }}>{fmtBs(q.total)}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '8px 12px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                onClick={() => window.open(`/cotizaciones/${q.id}/imprimir`, '_blank')}
              >
                <Printer size={14} strokeWidth={2.4} /> Ver
              </button>
              <button
                className="btn btn-primary"
                style={{ padding: '8px 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                onClick={() => { setRegistrando(q); setNumero('') }}
              >
                <ReceiptText size={14} strokeWidth={2.4} /> Registrar factura
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header">
          <div className="h3-card">Facturadas recientes</div>
        </div>
        {facturadas.length === 0 && (
          <div style={{ padding: '18px 20px' }} className="cell-sub">Aún no hay facturas registradas.</div>
        )}
        {facturadas.map((q) => (
          <div key={q.id} style={{ padding: '13px 20px', borderTop: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span className="cell-id">{q.numero}</span>
            <span className="cell-main" style={{ flex: 1, minWidth: 160 }}>{q.razon_social}</span>
            <span className="cell-sub">Nº {q.factura_numero}</span>
            <Badge estado="Facturada" />
            <span style={{ font: '800 13.5px var(--font-ui)', color: 'var(--ink-900)' }}>{fmtBs(q.total)}</span>
          </div>
        ))}
      </div>

      {registrando && (
        <div className="modal-backdrop" onClick={() => setRegistrando(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Registrar factura</h3>
            <p className="subtitle" style={{ margin: '0 0 14px' }}>
              {registrando.numero} · {registrando.razon_social} · {fmtBs(registrando.total)}
            </p>
            <div className="field">
              <label className="field-label">Nº de factura (emitida en Profit)</label>
              <input
                className="input-text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ej: 00012345"
                autoFocus
              />
            </div>
            <p className="caption" style={{ marginTop: 10 }}>
              Al registrar: se crea la orden de despacho y se notifica al cliente y al equipo de despacho.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={() => setRegistrando(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={facturar} disabled={ocupado || numero.trim().length === 0}>
                Registrar y crear despacho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
