import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Camera, X, Plus, Trash2, LocateFixed, Store } from 'lucide-react'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'

// Registro de una visita de campo desde el teléfono: cliente, GPS, fotos del
// anaquel, precios de la competencia y degustaciones.

interface ClienteOpc {
  id: number
  razon_social: string
  rif: string
}
interface FilaComp {
  producto: string
  competidor: string
  precio: string
  moneda: string
}
interface FilaDeg {
  producto: string
  unidades: string
  notas: string
}

// Comprime y reescala la foto en el teléfono antes de subirla (ahorra datos).
async function comprimirImagen(file: File, maxLado = 1280, calidad = 0.6): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result as string)
    fr.onerror = () => reject(new Error('No se pudo leer la imagen'))
    fr.readAsDataURL(file)
  })
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = () => reject(new Error('Imagen inválida'))
    i.src = dataUrl
  })
  let { width, height } = img
  if (width > maxLado || height > maxLado) {
    const escala = maxLado / Math.max(width, height)
    width = Math.round(width * escala)
    height = Math.round(height * escala)
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', calidad)
}

export function VisitaNueva() {
  const navigate = useNavigate()
  const toast = useToast()

  const [clienteNombre, setClienteNombre] = useState('')
  const [clienteId, setClienteId] = useState<number | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [opciones, setOpciones] = useState<ClienteOpc[]>([])
  const [mostrarOpc, setMostrarOpc] = useState(false)

  const [gps, setGps] = useState<{ lat: number; lng: number; prec: number } | null>(null)
  const [ubicando, setUbicando] = useState(false)
  const [direccion, setDireccion] = useState('')
  const [notas, setNotas] = useState('')
  const [fotos, setFotos] = useState<string[]>([])
  const [competencia, setCompetencia] = useState<FilaComp[]>([])
  const [degustaciones, setDegustaciones] = useState<FilaDeg[]>([])
  const [guardando, setGuardando] = useState(false)
  const [procesandoFoto, setProcesandoFoto] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Buscador de clientes (con pequeño retardo)
  useEffect(() => {
    if (busqueda.trim().length < 2) {
      setOpciones([])
      return
    }
    const t = setTimeout(() => {
      api
        .get<{ clientes: ClienteOpc[] }>(`/visitas/clientes?q=${encodeURIComponent(busqueda.trim())}`)
        .then((r) => {
          setOpciones(r.clientes)
          setMostrarOpc(true)
        })
        .catch(() => {})
    }, 300)
    return () => clearTimeout(t)
  }, [busqueda])

  function usarUbicacion() {
    if (!navigator.geolocation) {
      toast('Tu dispositivo no permite ubicación')
      return
    }
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, prec: pos.coords.accuracy })
        setUbicando(false)
      },
      (err) => {
        setUbicando(false)
        toast(err.code === 1 ? 'Permiso de ubicación denegado' : 'No se pudo obtener la ubicación')
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    )
  }

  async function agregarFotos(files: FileList | null) {
    if (!files || !files.length) return
    setProcesandoFoto(true)
    try {
      const nuevas: string[] = []
      for (const f of Array.from(files)) {
        if (fotos.length + nuevas.length >= 8) break
        if (!f.type.startsWith('image/')) continue
        nuevas.push(await comprimirImagen(f))
      }
      setFotos((prev) => [...prev, ...nuevas].slice(0, 8))
    } catch {
      toast('No se pudo procesar alguna foto')
    } finally {
      setProcesandoFoto(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function guardar() {
    if (clienteNombre.trim().length < 2) {
      toast('Indica el cliente o punto de venta')
      return
    }
    setGuardando(true)
    try {
      await api.post('/visitas', {
        clienteId: clienteId ?? undefined,
        clienteNombre: clienteNombre.trim(),
        lat: gps?.lat,
        lng: gps?.lng,
        gpsPrecision: gps?.prec,
        direccion: direccion.trim(),
        notas: notas.trim(),
        fotos,
        competencia: competencia
          .filter((c) => c.producto.trim())
          .map((c) => ({
            producto: c.producto.trim(),
            competidor: c.competidor.trim(),
            precio: c.precio ? Number(c.precio) : undefined,
            moneda: c.moneda,
            nota: '',
          })),
        degustaciones: degustaciones
          .filter((d) => d.producto.trim())
          .map((d) => ({
            producto: d.producto.trim(),
            unidades: d.unidades ? Number(d.unidades) : undefined,
            notas: d.notas.trim(),
          })),
      })
      toast('Visita registrada ✓')
      navigate('/visitas')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo registrar la visita')
      setGuardando(false)
    }
  }

  return (
    <div className="fade-up" style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Cliente */}
      <div className="card card-pad-lg" style={{ padding: 22 }}>
        <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Store size={18} strokeWidth={2.4} /> Cliente o punto de venta
        </h2>
        <div className="field" style={{ position: 'relative', marginTop: 8 }}>
          <input
            className="input-text"
            placeholder="Buscar cliente por nombre o RIF…"
            value={clienteNombre}
            onChange={(e) => {
              setClienteNombre(e.target.value)
              setBusqueda(e.target.value)
              setClienteId(null)
            }}
            onFocus={() => opciones.length && setMostrarOpc(true)}
          />
          {mostrarOpc && opciones.length > 0 && (
            <div className="visita-opciones">
              {opciones.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="visita-opcion"
                  onClick={() => {
                    setClienteNombre(o.razon_social)
                    setClienteId(o.id)
                    setMostrarOpc(false)
                  }}
                >
                  <strong>{o.razon_social}</strong>
                  <span className="caption">{o.rif}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="caption" style={{ margin: '4px 2px 0' }}>
          {clienteId ? 'Cliente del catálogo ✓' : 'Se guardará el nombre tal cual lo escribas'}
        </p>
      </div>

      {/* Ubicación */}
      <div className="card card-pad-lg" style={{ padding: 22 }}>
        <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={18} strokeWidth={2.4} /> Ubicación
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 8 }}>
          <button className="btn btn-secondary" onClick={usarUbicacion} disabled={ubicando}>
            <LocateFixed size={16} strokeWidth={2.4} /> {ubicando ? 'Ubicando…' : 'Usar mi ubicación'}
          </button>
          {gps && (
            <span className="chip" style={{ background: 'var(--success-soft)', color: 'var(--success-600)' }}>
              {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)} · ±{Math.round(gps.prec)} m
            </span>
          )}
        </div>
        <div className="field" style={{ marginTop: 12 }}>
          <label className="field-label">Dirección / referencia (opcional)</label>
          <input
            className="input-text"
            placeholder="Av., local, punto de referencia…"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
      </div>

      {/* Fotos */}
      <div className="card card-pad-lg" style={{ padding: 22 }}>
        <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Camera size={18} strokeWidth={2.4} /> Fotos del anaquel <span className="caption">({fotos.length}/8)</span>
        </h2>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => agregarFotos(e.target.files)}
        />
        <div className="visita-fotos-grid" style={{ marginTop: 10 }}>
          {fotos.map((f, i) => (
            <div key={i} className="visita-foto-thumb">
              <img src={f} alt={`Foto ${i + 1}`} />
              <button type="button" className="visita-foto-quitar" onClick={() => setFotos((p) => p.filter((_, j) => j !== i))}>
                <X size={14} strokeWidth={2.6} />
              </button>
            </div>
          ))}
          {fotos.length < 8 && (
            <button type="button" className="visita-foto-add" onClick={() => fileRef.current?.click()} disabled={procesandoFoto}>
              <Camera size={22} strokeWidth={2} />
              <span>{procesandoFoto ? 'Procesando…' : 'Agregar'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Precios de la competencia */}
      <div className="card card-pad-lg" style={{ padding: 22 }}>
        <h2 className="h2">Precios de la competencia</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {competencia.map((c, i) => (
            <div key={i} className="visita-fila">
              <input className="input-text" placeholder="Producto" value={c.producto} onChange={(e) => setCompetencia((p) => p.map((x, j) => (j === i ? { ...x, producto: e.target.value } : x)))} />
              <input className="input-text" placeholder="Competidor" value={c.competidor} onChange={(e) => setCompetencia((p) => p.map((x, j) => (j === i ? { ...x, competidor: e.target.value } : x)))} />
              <input className="input-text" placeholder="Precio" inputMode="decimal" style={{ maxWidth: 110 }} value={c.precio} onChange={(e) => setCompetencia((p) => p.map((x, j) => (j === i ? { ...x, precio: e.target.value } : x)))} />
              <select className="input-text" style={{ maxWidth: 84 }} value={c.moneda} onChange={(e) => setCompetencia((p) => p.map((x, j) => (j === i ? { ...x, moneda: e.target.value } : x)))}>
                <option>Bs</option>
                <option>USD</option>
              </select>
              <button type="button" className="inv-quitar" title="Quitar" onClick={() => setCompetencia((p) => p.filter((_, j) => j !== i))}>
                <Trash2 size={16} strokeWidth={2.2} />
              </button>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => setCompetencia((p) => [...p, { producto: '', competidor: '', precio: '', moneda: 'Bs' }])}>
          <Plus size={16} strokeWidth={2.4} /> Agregar precio
        </button>
      </div>

      {/* Degustaciones */}
      <div className="card card-pad-lg" style={{ padding: 22 }}>
        <h2 className="h2">Degustaciones</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {degustaciones.map((d, i) => (
            <div key={i} className="visita-fila">
              <input className="input-text" placeholder="Producto degustado" value={d.producto} onChange={(e) => setDegustaciones((p) => p.map((x, j) => (j === i ? { ...x, producto: e.target.value } : x)))} />
              <input className="input-text" placeholder="Unidades" inputMode="decimal" style={{ maxWidth: 110 }} value={d.unidades} onChange={(e) => setDegustaciones((p) => p.map((x, j) => (j === i ? { ...x, unidades: e.target.value } : x)))} />
              <input className="input-text" placeholder="Nota" value={d.notas} onChange={(e) => setDegustaciones((p) => p.map((x, j) => (j === i ? { ...x, notas: e.target.value } : x)))} />
              <button type="button" className="inv-quitar" title="Quitar" onClick={() => setDegustaciones((p) => p.filter((_, j) => j !== i))}>
                <Trash2 size={16} strokeWidth={2.2} />
              </button>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => setDegustaciones((p) => [...p, { producto: '', unidades: '', notas: '' }])}>
          <Plus size={16} strokeWidth={2.4} /> Agregar degustación
        </button>
      </div>

      {/* Notas */}
      <div className="card card-pad-lg" style={{ padding: 22 }}>
        <h2 className="h2">Notas de la visita</h2>
        <textarea
          className="input-text"
          rows={3}
          style={{ marginTop: 8, resize: 'vertical' }}
          placeholder="Observaciones, acuerdos, incidencias…"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingBottom: 8 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/visitas')}>Cancelar</button>
        <button className="btn btn-cta" onClick={guardar} disabled={guardando || procesandoFoto}>
          {guardando ? 'Guardando…' : 'Registrar visita'}
        </button>
      </div>
    </div>
  )
}
