import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { montoDual, etiquetaTasa, useTasa } from '../lib/moneda'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'

interface ClienteCxc {
  cliente: string
  moneda: string
  saldo: number
  vencido: number
  documentos: number
  peorDiasVencido: number
}
interface Data {
  clientes: ClienteCxc[]
  totales: { saldo: number; vencido: number }
  actualizado: string | null
}
interface Nota { id: number; cliente: string; texto: string; autor_nombre: string | null; created_at: string }
interface PreviewResp {
  total: number; enviados: number; sinCorreo: string[]
  detalle: { vendedor: string; correo: string | null; estado: string; totSaldo: number }[]
  previewHtml?: string
}

const fmt = (n: number, m = 'Bs') => `${m} ${n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function CuentasPorCobrar() {
  const { user } = useAuth()
  const toast = useToast()
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<string | null>(null)
  const tasa = useTasa()

  const [notasDe, setNotasDe] = useState<ClienteCxc | null>(null)
  const [notas, setNotas] = useState<Nota[]>([])
  const [nuevaNota, setNuevaNota] = useState('')
  const [diario, setDiario] = useState<PreviewResp | null>(null)
  const [ocupado, setOcupado] = useState(false)

  useEffect(() => {
    api.get<Data>('/cxc').then(setData).catch((e) => setError(e instanceof Error ? e.message : 'Error'))
  }, [])

  const abrirNotas = async (c: ClienteCxc) => {
    setNotasDe(c); setNotas([]); setNuevaNota('')
    try {
      const r = await api.get<{ notas: Nota[] }>(`/cxc/notas?cliente=${encodeURIComponent(c.cliente)}`)
      setNotas(r.notas)
    } catch { /* vacío */ }
  }
  const agregarNota = async () => {
    if (!notasDe || !nuevaNota.trim()) return
    setOcupado(true)
    try {
      const r = await api.post<{ nota: Nota }>('/cxc/notas', { cliente: notasDe.cliente, texto: nuevaNota.trim() })
      setNotas([r.nota, ...notas]); setNuevaNota('')
    } catch (err) { toast(err instanceof Error ? err.message : 'No se pudo') } finally { setOcupado(false) }
  }
  const previewDiario = async () => {
    setOcupado(true)
    try { setDiario(await api.get<PreviewResp>('/cxc/diario/preview')) }
    catch (err) { toast(err instanceof Error ? err.message : 'Error') } finally { setOcupado(false) }
  }
  const enviarDiario = async () => {
    if (!window.confirm('¿Enviar el CxC diario a todos los vendedores con correo configurado?')) return
    setOcupado(true)
    try {
      const r = await api.post<PreviewResp>('/cxc/diario/enviar')
      toast(`Enviados ${r.enviados}/${r.total}${r.sinCorreo.length ? ` · sin correo: ${r.sinCorreo.length}` : ''}`)
      setDiario(r)
    } catch (err) { toast(err instanceof Error ? err.message : 'Error') } finally { setOcupado(false) }
  }

  if (error) return <div className="fade-up"><p className="subtitle">{error}</p></div>
  if (!data) return null

  const vacio = data.clientes.length === 0
  const cols = '2fr 1fr 1fr 0.7fr 0.7fr 0.8fr'
  const esAdmin = user?.rol === 'admin'

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="h1-module">Cuentas por Cobrar</h1>
          <p className="subtitle">
            Saldos reales de Profit por cliente. {data.actualizado ? `Actualizado ${new Date(data.actualizado).toLocaleString('es-VE')}.` : 'Sin datos sincronizados aún.'} · {etiquetaTasa(tasa)}
          </p>
        </div>
        {esAdmin && !vacio && (
          <button className="btn btn-secondary" disabled={ocupado} onClick={previewDiario}>Correo diario CxC</button>
        )}
      </div>

      {vacio ? (
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div className="cell-sub">
            No hay datos de Cuentas por Cobrar. Se cargan de Profit por la réplica (ver docs/conexion-profit.md).
          </div>
        </div>
      ) : (
        <>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="card card-kpi">
              <div className="field-label">Saldo total por cobrar</div>
              <div className="kpi-value" style={{ fontSize: 20 }}>{montoDual(data.totales.saldo, tasa)}</div>
            </div>
            <div className="card card-kpi">
              <div className="field-label">Vencido</div>
              <div className="kpi-value" style={{ fontSize: 20, color: data.totales.vencido > 0 ? 'var(--danger-500)' : 'var(--success-600)' }}>{montoDual(data.totales.vencido, tasa)}</div>
            </div>
            <div className="card card-kpi">
              <div className="field-label">Clientes con saldo</div>
              <div className="kpi-value">{data.clientes.length}</div>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header"><div className="h3-card">Por cliente</div><span className="caption">más vencido primero · toca un cliente para sus notas</span></div>
            <div className="table-scroll">
              <div className="table-min-760">
                <div className="table-head" style={{ gridTemplateColumns: cols }}>
                  <span>Cliente</span><span>Saldo</span><span>Vencido</span><span>Docs</span><span>Días</span><span>Notas</span>
                </div>
                {data.clientes.map((c, i) => (
                  <div key={i} className="table-row" style={{ gridTemplateColumns: cols, cursor: 'pointer' }} onClick={() => abrirNotas(c)}>
                    <span className="cell-main">{c.cliente}</span>
                    <span className="cell-strong">{fmt(c.saldo, c.moneda)}</span>
                    <span style={{ font: '700 13px var(--font-ui)', color: c.vencido > 0 ? 'var(--danger-500)' : 'var(--ink-300)' }}>
                      {c.vencido > 0 ? fmt(c.vencido, c.moneda) : '—'}
                    </span>
                    <span className="cell-sub">{c.documentos}</span>
                    <span>
                      {c.peorDiasVencido > 0 ? (
                        <span className="badge" style={{ background: 'var(--danger-soft)', color: 'var(--danger-500)' }}>{c.peorDiasVencido}d</span>
                      ) : (
                        <span className="badge" style={{ background: 'var(--success-soft)', color: 'var(--success-600)' }}>al día</span>
                      )}
                    </span>
                    <span className="cell-sub" style={{ color: 'var(--brand-500)' }}>📝 ver</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notas de cobranza por cliente */}
      {notasDe && (
        <div className="modal-backdrop" onClick={() => setNotasDe(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <h3>Notas · {notasDe.cliente}</h3>
            <div className="field">
              <textarea className="input-text" rows={2} placeholder="Escribe una nota de cobranza (la ve el equipo y va en el correo diario)…" value={nuevaNota} onChange={(e) => setNuevaNota(e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn btn-primary" disabled={ocupado || !nuevaNota.trim()} onClick={agregarNota}>Agregar nota</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10, maxHeight: 300, overflowY: 'auto' }}>
              {notas.length === 0 && <div className="cell-sub">Sin notas todavía.</div>}
              {notas.map((n) => (
                <div key={n.id} style={{ borderLeft: '3px solid var(--brand-500)', padding: '4px 10px', background: 'var(--line-soft)', borderRadius: 6 }}>
                  <div className="cell-main" style={{ fontWeight: 600 }}>{n.texto}</div>
                  <div className="caption">{n.autor_nombre ?? '—'} · {new Date(n.created_at).toLocaleString('es-VE')}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn btn-secondary" onClick={() => setNotasDe(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Vista previa / envío del correo diario (admin) */}
      {diario && (
        <div className="modal-backdrop" onClick={() => setDiario(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720, maxHeight: '88vh', overflowY: 'auto' }}>
            <h3>Correo diario de CxC</h3>
            <p className="cell-sub">
              {diario.total} vendedor{diario.total === 1 ? '' : 'es'} con cartera.{' '}
              {diario.sinCorreo.length > 0 && <span style={{ color: 'var(--warning-600)' }}>Sin correo configurado: {diario.sinCorreo.join(', ')}. </span>}
              Así se ve el correo de cada vendedor (ejemplo del primero):
            </p>
            {diario.previewHtml && (
              <div style={{ border: '1px solid var(--line-soft)', borderRadius: 10, padding: 10, background: '#eef2f7' }}
                   dangerouslySetInnerHTML={{ __html: diario.previewHtml }} />
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
              <button className="btn btn-secondary" onClick={() => setDiario(null)}>Cerrar</button>
              <button className="btn btn-primary" disabled={ocupado} onClick={enviarDiario}>Enviar ahora a los vendedores</button>
            </div>
            <p className="caption" style={{ marginTop: 8 }}>
              Se envía solo/programado cada día a las 7am. El envío real requiere el correo configurado (SMTP); en modo consola queda registrado sin salir.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
