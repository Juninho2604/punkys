import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Camera, Tag, Utensils, Plus, ExternalLink, Trash2 } from 'lucide-react'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'

interface VisitaResumen {
  id: number
  cliente_nombre: string
  usuario: string
  lat: number | null
  lng: number | null
  direccion: string | null
  notas: string | null
  created_at: string
  fotos: number
  competencia: number
  degustaciones: number
}
interface Competencia {
  id: number
  producto: string
  competidor: string | null
  precio: string | null
  moneda: string
  nota: string | null
}
interface Degustacion {
  id: number
  producto: string
  unidades: string | null
  notas: string | null
}
interface VisitaDetalle extends Omit<VisitaResumen, 'fotos'> {
  gps_precision: number | null
  fotos: number[] // en el detalle son ids de foto
  competencia_lista?: Competencia[]
  degustaciones_lista?: Degustacion[]
}

const fmtFecha = (s: string) =>
  new Date(s).toLocaleString('es-VE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export function Visitas() {
  const navigate = useNavigate()
  const toast = useToast()
  const [visitas, setVisitas] = useState<VisitaResumen[]>([])
  const [cargando, setCargando] = useState(true)
  const [detalle, setDetalle] = useState<VisitaDetalle | null>(null)
  const [foto, setFoto] = useState<number | null>(null)

  function cargar() {
    setCargando(true)
    api
      .get<{ visitas: VisitaResumen[] }>('/visitas')
      .then((r) => setVisitas(r.visitas))
      .catch((e) => toast(e instanceof Error ? e.message : 'No se pudieron cargar las visitas'))
      .finally(() => setCargando(false))
  }
  useEffect(cargar, [])

  async function abrir(id: number) {
    try {
      const r = await api.get<{ visita: any }>(`/visitas/${id}`)
      setDetalle({
        ...r.visita,
        competencia_lista: r.visita.competencia,
        degustaciones_lista: r.visita.degustaciones,
      })
    } catch (e) {
      toast(e instanceof Error ? e.message : 'No se pudo abrir la visita')
    }
  }

  async function eliminar(id: number) {
    if (!confirm('¿Eliminar esta visita? No se puede deshacer.')) return
    try {
      await api.del(`/visitas/${id}`)
      toast('Visita eliminada')
      setDetalle(null)
      cargar()
    } catch (e) {
      toast(e instanceof Error ? e.message : 'No se pudo eliminar')
    }
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p className="subtitle" style={{ margin: 0 }}>
          Visitas de campo registradas por los mercaderistas: anaqueles, precios de la competencia y degustaciones.
        </p>
        <button className="btn btn-cta" onClick={() => navigate('/visitas/nueva')}>
          <Plus size={16} strokeWidth={2.4} /> Nueva visita
        </button>
      </div>

      {cargando ? (
        <div className="card card-pad-lg" style={{ padding: 28 }}>
          <p className="cell-sub">Cargando…</p>
        </div>
      ) : visitas.length === 0 ? (
        <div className="card card-pad-lg" style={{ padding: 40, textAlign: 'center' }}>
          <MapPin size={34} strokeWidth={1.8} color="var(--ink-300)" />
          <h3 style={{ font: '700 18px var(--font-display)', color: 'var(--brand-900)', margin: '12px 0 4px' }}>Aún no hay visitas</h3>
          <p className="subtitle" style={{ margin: 0 }}>Registra la primera visita de campo desde el teléfono.</p>
        </div>
      ) : (
        <div className="visita-lista">
          {visitas.map((v) => (
            <button key={v.id} className="card visita-card" onClick={() => abrir(v.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <strong style={{ font: '800 15px var(--font-ui)', color: 'var(--ink-900)' }}>{v.cliente_nombre}</strong>
                {v.lat != null && <MapPin size={16} strokeWidth={2.4} color="var(--brand-800)" />}
              </div>
              <div className="caption" style={{ marginTop: 2 }}>{v.usuario} · {fmtFecha(v.created_at)}</div>
              <div style={{ display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
                <span className="visita-badge"><Camera size={14} strokeWidth={2.2} /> {v.fotos}</span>
                <span className="visita-badge"><Tag size={14} strokeWidth={2.2} /> {v.competencia}</span>
                <span className="visita-badge"><Utensils size={14} strokeWidth={2.2} /> {v.degustaciones}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {detalle && (
        <div className="modal-backdrop" onClick={() => setDetalle(null)}>
          <div className="modal-card" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <h3 style={{ margin: 0 }}>{detalle.cliente_nombre}</h3>
                <div className="caption">{detalle.usuario} · {fmtFecha(detalle.created_at)}</div>
              </div>
              <button className="inv-quitar" title="Eliminar" onClick={() => eliminar(detalle.id)}>
                <Trash2 size={16} strokeWidth={2.2} />
              </button>
            </div>

            {detalle.lat != null && detalle.lng != null && (
              <a
                className="visita-mapa"
                href={`https://www.google.com/maps?q=${detalle.lat},${detalle.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={16} strokeWidth={2.4} />
                {Number(detalle.lat).toFixed(5)}, {Number(detalle.lng).toFixed(5)}
                {detalle.gps_precision != null && <span className="caption"> · ±{Math.round(Number(detalle.gps_precision))} m</span>}
                <ExternalLink size={14} strokeWidth={2.2} style={{ marginLeft: 'auto' }} />
              </a>
            )}
            {detalle.direccion && <p className="cell-sub" style={{ margin: '8px 0 0' }}>{detalle.direccion}</p>}

            {detalle.fotos.length > 0 && (
              <div className="visita-fotos-grid" style={{ marginTop: 14 }}>
                {detalle.fotos.map((id) => (
                  <button key={id} type="button" className="visita-foto-thumb" onClick={() => setFoto(id)}>
                    <img src={`/api/visitas/foto/${id}`} alt="Foto de la visita" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {detalle.competencia_lista && detalle.competencia_lista.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4 className="visita-sub"><Tag size={15} strokeWidth={2.4} /> Precios de la competencia</h4>
                <table className="visita-tabla">
                  <tbody>
                    {detalle.competencia_lista.map((c) => (
                      <tr key={c.id}>
                        <td>{c.producto}</td>
                        <td className="cell-sub">{c.competidor || '—'}</td>
                        <td className="num">{c.precio != null ? `${c.moneda} ${Number(c.precio).toLocaleString('es-VE')}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {detalle.degustaciones_lista && detalle.degustaciones_lista.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4 className="visita-sub"><Utensils size={15} strokeWidth={2.4} /> Degustaciones</h4>
                <table className="visita-tabla">
                  <tbody>
                    {detalle.degustaciones_lista.map((d) => (
                      <tr key={d.id}>
                        <td>{d.producto}</td>
                        <td className="num">{d.unidades != null ? `${Number(d.unidades).toLocaleString('es-VE')} und` : '—'}</td>
                        <td className="cell-sub">{d.notas || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {detalle.notas && (
              <div style={{ marginTop: 16 }}>
                <h4 className="visita-sub">Notas</h4>
                <p className="cell-sub" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{detalle.notas}</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <button className="btn btn-secondary" onClick={() => setDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {foto != null && (
        <div className="modal-backdrop" style={{ zIndex: 60 }} onClick={() => setFoto(null)}>
          <img src={`/api/visitas/foto/${foto}`} alt="Foto de la visita" className="visita-foto-full" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}
