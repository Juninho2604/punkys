import { useEffect, useState } from 'react'
import { Sparkles, Mail, RefreshCw } from 'lucide-react'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'

interface Reporte {
  ok: boolean
  conIA: boolean
  titulo: string
  texto: string
  html: string
  enviadoA?: string[]
}
interface Estado {
  habilitado: boolean
  modelo: string
  horaDiario: number
}

export function Reportes() {
  const toast = useToast()
  const [estado, setEstado] = useState<Estado | null>(null)
  const [reporte, setReporte] = useState<Reporte | null>(null)
  const [generando, setGenerando] = useState(false)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    api.get<Estado>('/reportes/estado').then(setEstado).catch(() => {})
  }, [])

  async function generar() {
    setGenerando(true)
    try {
      setReporte(await api.get<Reporte>('/reportes/preview'))
    } catch (e) {
      toast(e instanceof Error ? e.message : 'No se pudo generar el reporte')
    } finally {
      setGenerando(false)
    }
  }

  async function enviar() {
    if (!window.confirm('¿Enviar el reporte por correo a los administradores?')) return
    setEnviando(true)
    try {
      const r = await api.post<Reporte>('/reportes/enviar')
      setReporte(r)
      toast(`Reporte enviado a ${r.enviadoA?.length ?? 0} destinatario(s) ✓`)
    } catch (e) {
      toast(e instanceof Error ? e.message : 'No se pudo enviar')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
      <p className="subtitle" style={{ margin: 0 }}>
        Reporte ejecutivo del negocio (ventas, cobranzas, cartera, compras y pedidos) con KPIs, tendencias y alertas automáticas, a partir de los datos de Profit y la intranet.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-cta" onClick={generar} disabled={generando}>
          <Sparkles size={16} strokeWidth={2.4} /> {generando ? 'Generando…' : 'Generar reporte'}
        </button>
        {reporte && (
          <>
            <button className="btn btn-secondary" onClick={generar} disabled={generando} title="Volver a generar">
              <RefreshCw size={15} strokeWidth={2.4} />
            </button>
            <button className="btn btn-primary" onClick={enviar} disabled={enviando}>
              <Mail size={16} strokeWidth={2.4} /> {enviando ? 'Enviando…' : 'Enviar por correo'}
            </button>
          </>
        )}
      </div>

      {reporte && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--line-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ font: '800 13px var(--font-ui)', color: 'var(--ink-900)' }}>{reporte.titulo}</span>
            <span className="caption">{reporte.conIA ? '🧠 Con narrativa IA' : 'Reporte determinista'}</span>
          </div>
          <div style={{ padding: 18 }} dangerouslySetInnerHTML={{ __html: reporte.html }} />
        </div>
      )}

      {estado && (
        <p className="caption">
          Se envía automáticamente cada día a las {estado.horaDiario}:00 (hora de Venezuela) a los administradores.
          {estado.habilitado ? ` Incluye narrativa redactada por IA (${estado.modelo}).` : ' Reporte determinista, sin costo de API.'}
        </p>
      )}
    </div>
  )
}
