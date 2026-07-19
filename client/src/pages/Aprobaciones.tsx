import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import { fmtBs, fmtFecha } from '../lib/format'
import { useToast } from '../lib/toast'
import { usePend } from '../components/Shell'
import type { Quote } from '../lib/types'
import { SERVICIO_NOMBRE } from './Cotizacion'

const COLUMNAS = [
  { estado: 'pendiente', titulo: 'Pendiente', dot: 'var(--warning-dot)' },
  { estado: 'aprobada', titulo: 'Aprobado', dot: 'var(--success-600)' },
  { estado: 'rechazada', titulo: 'Rechazado', dot: 'var(--danger-500)' },
] as const

export function Aprobaciones() {
  const toast = useToast()
  const { refreshPend } = usePend()
  const [quotes, setQuotes] = useState<Quote[]>([])

  const cargar = useCallback(() => {
    api.get<{ quotes: Quote[] }>('/quotes').then((r) => setQuotes(r.quotes)).catch(console.error)
  }, [])

  useEffect(cargar, [cargar])

  async function accion(q: Quote, ruta: 'approve' | 'reject' | 'reopen') {
    try {
      await api.post(`/quotes/${q.id}/${ruta}`)
      toast(
        ruta === 'approve' ? `${q.numero} aprobada ✓` : ruta === 'reject' ? `${q.numero} rechazada` : `${q.numero} devuelta a pendiente`,
      )
      cargar()
      refreshPend()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo procesar')
    }
  }

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 18 }}>
        <h1 className="h1-module">Tablero de aprobaciones</h1>
        <p className="subtitle">Cotizaciones pendientes de decisión de Cuentas por Cobrar.</p>
      </div>
      <div className="kanban-grid">
        {COLUMNAS.map((col) => {
          const items = quotes.filter((q) =>
            col.estado === 'aprobada' ? q.estado === 'aprobada' || q.estado === 'facturada' : q.estado === col.estado,
          )
          return (
            <div key={col.estado} className="kanban-col">
              <div className="kanban-col-head">
                <span className="kanban-dot" style={{ background: col.dot }} />
                <span style={{ font: '700 14px var(--font-display)', color: 'var(--brand-900)' }}>{col.titulo}</span>
                <span className="kanban-count">{items.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((q) => (
                  <div key={q.id} className="kanban-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="cell-id">{q.numero}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="caption">{fmtFecha(q.created_at)}</span>
                        <button
                          title="Imprimir cotización"
                          onClick={() => window.open(`/cotizaciones/${q.id}/imprimir`, '_blank')}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-300)', padding: 2, fontSize: 15, lineHeight: 1 }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-800)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-300)')}
                        >
                          🖨
                        </button>
                      </span>
                    </div>
                    <div style={{ font: '800 14.5px var(--font-ui)', color: 'var(--ink-900)' }}>{q.razon_social}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ background: 'var(--sky-50)', color: 'var(--brand-800)', font: '700 11.5px var(--font-ui)', padding: '3px 9px', borderRadius: 999 }}>
                        {q.resumen ?? SERVICIO_NOMBRE[q.servicio ?? ''] ?? '—'}
                      </span>
                      <span style={{ font: '800 14px var(--font-ui)', color: 'var(--brand-900)' }}>{fmtBs(q.total)}</span>
                    </div>
                    {q.estado === 'pendiente' && q.cxc && q.cxc.saldo > 0 && (
                      <div
                        className="caption"
                        style={{
                          padding: '5px 9px',
                          borderRadius: 8,
                          background: q.cxc.vencido > 0 ? 'var(--danger-soft)' : 'var(--warning-soft)',
                          color: q.cxc.vencido > 0 ? 'var(--danger-500)' : 'var(--warning-600)',
                          fontWeight: 700,
                        }}
                        title="Saldo por cobrar del cliente en Profit"
                      >
                        {q.cxc.vencido > 0 ? '⚠️' : '💳'} Debe {q.cxc.moneda} {q.cxc.saldo.toLocaleString('es-VE', { maximumFractionDigits: 0 })}
                        {q.cxc.vencido > 0 && ` · ${q.cxc.moneda} ${q.cxc.vencido.toLocaleString('es-VE', { maximumFractionDigits: 0 })} vencido (${q.cxc.peorDiasVencido}d)`}
                      </div>
                    )}
                    {q.estado === 'rechazada' && q.motivo_rechazo && (
                      <div className="caption" style={{ color: 'var(--danger-500)' }}>{q.motivo_rechazo}</div>
                    )}
                    {q.estado === 'facturada' ? (
                      <span className="caption">🧾 Factura Nº {q.factura_numero} · en despacho</span>
                    ) : q.estado === 'pendiente' ? (
                      <div style={{ display: 'flex', gap: 8, marginTop: 4, paddingTop: 10, borderTop: '1px solid var(--line-soft)' }}>
                        <button className="btn-approve-soft" onClick={() => accion(q, 'approve')}>✓ Aprobar</button>
                        <button className="btn-reject-soft" onClick={() => accion(q, 'reject')}>✕ Rechazar</button>
                      </div>
                    ) : (
                      <a className="kanban-revert" onClick={() => accion(q, 'reopen')}>↩ Devolver a pendiente</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
