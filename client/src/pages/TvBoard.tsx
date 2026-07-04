import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fmtBs } from '../lib/format'
import { SERVICIO_NOMBRE } from './Cotizacion'

// Centro de Operaciones (modo TV): pantalla de solo lectura para el equipo.
// Rotación automática de escenas + ticker de eventos + banner de incidencias.
// Acceso: /tv/<clave> con TV_ACCESS_KEY configurada en el servidor.

const ROTACION_MS = 12_000 // cambio de escena
const POLL_MS = 20_000 // refresco de datos

interface Board {
  ahora: string
  kpis: {
    cotizacionesHoy: number
    cotizacionesMes: number
    montoCotizadoMes: number
    montoAprobadoMes: number
    porAprobar: number
    montoPorAprobar: number
    enviosActivos: number
    entregadosMes: number
    entregasATiempo: number
    incidencias: number
  }
  pendientes: { numero: string; razon_social: string; servicio: string; total: string; created_at: string }[]
  envios: { numero: string; cliente: string; origen: string; destino_ciudad: string; estado: string; eta: string | null; incidencia: boolean }[]
  incidencias: { numero: string; cliente: string; destino_ciudad: string }[]
  eventos: { t: string; texto: string }[]
}

const BADGE_TV: Record<string, { bg: string; fg: string }> = {
  Preparando: { bg: 'rgba(255,255,255,.14)', fg: '#dbe7f7' },
  'En tránsito': { bg: 'rgba(141,184,242,.22)', fg: '#8db8f2' },
  'En reparto': { bg: 'rgba(232,162,61,.25)', fg: '#ffce7a' },
  Entregado: { bg: 'rgba(46,158,91,.25)', fg: '#7fe3a8' },
  Incidencia: { bg: 'rgba(217,83,79,.28)', fg: '#ff9d99' },
}

function agingDe(iso: string): { texto: string; nivel: 'fresco' | 'medio' | 'viejo' } {
  const horas = (Date.now() - new Date(iso).getTime()) / 3_600_000
  const texto =
    horas < 1 ? `hace ${Math.max(1, Math.round(horas * 60))} min` : horas < 24 ? `hace ${Math.round(horas)} h` : `hace ${Math.round(horas / 24)} d`
  return { texto, nivel: horas < 4 ? 'fresco' : horas < 24 ? 'medio' : 'viejo' }
}

export function TvBoard() {
  const { clave } = useParams()
  const [board, setBoard] = useState<Board | null>(null)
  const [offline, setOffline] = useState(false)
  const [actualizado, setActualizado] = useState<Date | null>(null)
  const [reloj, setReloj] = useState(new Date())
  const [escena, setEscena] = useState(0)

  // Datos
  useEffect(() => {
    let vivo = true
    async function cargar() {
      try {
        const res = await fetch(`/api/tv/board?key=${encodeURIComponent(clave ?? '')}`)
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as Board
        if (!vivo) return
        setBoard(data)
        setOffline(false)
        setActualizado(new Date())
      } catch {
        if (vivo) setOffline(true)
      }
    }
    cargar()
    const t = setInterval(cargar, POLL_MS)
    return () => {
      vivo = false
      clearInterval(t)
    }
  }, [clave])

  // Reloj y rotación
  useEffect(() => {
    const t = setInterval(() => setReloj(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    const t = setInterval(() => setEscena((e) => (e + 1) % ESCENAS.length), ROTACION_MS)
    return () => clearInterval(t)
  }, [])

  const segundosDesde = actualizado ? Math.round((reloj.getTime() - actualizado.getTime()) / 1000) : null

  const fecha = useMemo(() => {
    const s = reloj.toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long' })
    return s.charAt(0).toUpperCase() + s.slice(1)
  }, [reloj])

  if (!board) {
    return (
      <div className="tv-root">
        <div className="tv-empty" style={{ flex: 1 }}>
          {offline ? '⚠️ Sin conexión con la intranet (o clave inválida)' : 'Cargando Centro de Operaciones…'}
        </div>
      </div>
    )
  }

  const EscenaActiva = ESCENAS[escena]

  return (
    <div className="tv-root">
      <header className="tv-header">
        <img src="/logo-letters.png" alt="Punky Partners" style={{ width: 'clamp(90px, 8vw, 150px)' }} />
        <div>
          <div className="tv-title">Centro de Operaciones</div>
          <div className="tv-sub">Logística · tiempo real</div>
        </div>
        <div className={`tv-updated${offline ? ' offline' : ''}`}>
          <span className="dot-live" />
          {offline ? 'Sin conexión — mostrando últimos datos' : segundosDesde !== null ? `Actualizado hace ${segundosDesde}s` : 'Conectando…'}
        </div>
        <div className="tv-clock">
          <div className="hora">{reloj.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="fecha">{fecha}</div>
        </div>
      </header>

      {board.incidencias.length > 0 && (
        <div className="tv-alert">
          ⚠️ {board.incidencias.length === 1 ? 'INCIDENCIA ACTIVA' : `${board.incidencias.length} INCIDENCIAS ACTIVAS`}:{' '}
          {board.incidencias.map((i) => `${i.numero} (${i.cliente} → ${i.destino_ciudad})`).join(' · ')}
        </div>
      )}

      <EscenaActiva board={board} />

      <div className="tv-dots">
        {ESCENAS.map((_, i) => (
          <span key={i} className={i === escena ? 'on' : ''} />
        ))}
      </div>

      <div className="tv-ticker">
        <div className="tv-ticker-track">
          {[...board.eventos, ...board.eventos].map((e, i) => (
            <span key={i}>{e.texto}</span>
          ))}
          {board.eventos.length === 0 && <span>🐾 Punky Partners · Centro de Operaciones · esperando actividad del día…</span>}
        </div>
      </div>
    </div>
  )
}

// ── Escena 1 · Pulso de hoy ──────────────────────────────────────────────────
function EscenaPulso({ board }: { board: Board }) {
  const { kpis } = board
  return (
    <section className="tv-scene">
      <div className="tv-scene-title">
        Pulso del negocio <span className="tv-scene-hint">hoy y el mes en curso</span>
      </div>
      <div className="tv-kpis">
        <div className="tv-kpi">
          <div className="label">Cotizaciones hoy</div>
          <div className="valor">{kpis.cotizacionesHoy}</div>
          <div className="detalle">{kpis.cotizacionesMes} en el mes</div>
        </div>
        <div className="tv-kpi">
          <div className="label">Cotizado este mes</div>
          <div className="valor">{fmtBs(kpis.montoCotizadoMes)}</div>
          <div className="detalle">{fmtBs(kpis.montoAprobadoMes)} aprobado</div>
        </div>
        <div className={`tv-kpi${kpis.porAprobar > 0 ? ' warn' : ' ok'}`}>
          <div className="label">Esperando aprobación</div>
          <div className="valor">{kpis.porAprobar}</div>
          <div className="detalle">{kpis.porAprobar > 0 ? `${fmtBs(kpis.montoPorAprobar)} en juego` : 'Todo al día ✓'}</div>
        </div>
        <div className="tv-kpi">
          <div className="label">Envíos activos</div>
          <div className="valor">{kpis.enviosActivos}</div>
          <div className="detalle">{kpis.entregadosMes} entregados este mes</div>
        </div>
        <div className={`tv-kpi${kpis.entregasATiempo >= 96 ? ' ok' : ' bad'}`}>
          <div className="label">Entregas a tiempo</div>
          <div className="valor">{kpis.entregasATiempo}%</div>
          <div className="detalle">meta: 96%</div>
        </div>
        <div className={`tv-kpi${kpis.incidencias > 0 ? ' bad' : ' ok'}`}>
          <div className="label">Incidencias</div>
          <div className="valor">{kpis.incidencias}</div>
          <div className="detalle">{kpis.incidencias === 0 ? 'Operación limpia 🐾' : 'Atención requerida'}</div>
        </div>
      </div>
    </section>
  )
}

// ── Escena 2 · Esperando aprobación ─────────────────────────────────────────
function EscenaAprobaciones({ board }: { board: Board }) {
  return (
    <section className="tv-scene">
      <div className="tv-scene-title">
        Esperando aprobación <span className="tv-scene-hint">las más antiguas primero</span>
      </div>
      {board.pendientes.length === 0 ? (
        <div className="tv-empty">
          <div style={{ fontSize: 'clamp(40px, 4vw, 72px)' }}>✅</div>
          Nada pendiente por aprobar. ¡Cuentas por Cobrar al día!
        </div>
      ) : (
        <div className="tv-rows">
          {board.pendientes.map((q) => {
            const aging = agingDe(q.created_at)
            return (
              <div key={q.numero} className="tv-row" style={{ gridTemplateColumns: '150px 1fr auto 200px auto' }}>
                <span className="id">{q.numero}</span>
                <span>
                  {q.razon_social} <span className="sub">· {SERVICIO_NOMBRE[q.servicio] ?? q.servicio}</span>
                </span>
                <span className={`tv-aging ${aging.nivel}`}>{aging.texto}</span>
                <span className="monto">{fmtBs(q.total)}</span>
                <span className="sub" />
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

// ── Escena 3 · Despachos en curso ────────────────────────────────────────────
function EscenaDespachos({ board }: { board: Board }) {
  return (
    <section className="tv-scene">
      <div className="tv-scene-title">
        Despachos en curso <span className="tv-scene-hint">incidencias primero</span>
      </div>
      {board.envios.length === 0 ? (
        <div className="tv-empty">
          <div style={{ fontSize: 'clamp(40px, 4vw, 72px)' }}>📦</div>
          No hay envíos activos ahora mismo.
        </div>
      ) : (
        <div className="tv-rows">
          {board.envios.map((s) => {
            const c = BADGE_TV[s.estado] ?? BADGE_TV.Preparando
            return (
              <div
                key={s.numero}
                className={`tv-row${s.incidencia ? ' incidente' : ''}`}
                style={{ gridTemplateColumns: '150px 1.4fr 1.2fr 190px 130px' }}
              >
                <span className="id">{s.numero}</span>
                <span>{s.cliente}</span>
                <span className="sub">
                  {s.origen} → {s.destino_ciudad}
                </span>
                <span className="tv-badge" style={{ background: c.bg, color: c.fg }}>
                  {s.estado}
                </span>
                <span className="sub" style={{ textAlign: 'right' }}>
                  ETA {s.eta ?? '—'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

const ESCENAS = [EscenaPulso, EscenaAprobaciones, EscenaDespachos]
