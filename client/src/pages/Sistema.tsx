import { useEffect, useState } from 'react'
import { Database, HardDriveDownload, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react'
import { api } from '../lib/api'

interface Status {
  profitPlus: { modo: string; conectado: boolean; detalle: string }
  notificaciones: { email: string; whatsapp: string }
}
interface BackupRow {
  id: number
  archivo: string
  tamano_bytes: string | number | null
  ok: boolean
  created_at: string
}
interface Backups {
  configurado: boolean
  ultimo: BackupRow | null
  horasDesdeUltimo: number | null
  alDia: boolean
  recientes: BackupRow[]
}

const fmtBytes = (n: number | string | null) => {
  const b = Number(n ?? 0)
  if (!b) return '—'
  const u = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let v = b
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${u[i]}`
}
const fmtFecha = (s: string) => new Date(s).toLocaleString('es-VE')

export function Sistema() {
  const [status, setStatus] = useState<Status | null>(null)
  const [backups, setBackups] = useState<Backups | null>(null)
  const [cargando, setCargando] = useState(true)

  function cargar() {
    setCargando(true)
    Promise.all([
      api.get<Status>('/system/status').then(setStatus).catch(() => {}),
      api.get<Backups>('/system/backups').then(setBackups).catch(() => {}),
    ]).finally(() => setCargando(false))
  }
  useEffect(cargar, [])

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 820 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <p className="subtitle" style={{ margin: 0 }}>Estado de las integraciones (Profit, notificaciones) y de los respaldos automáticos de la base.</p>
        <button className="btn btn-secondary" onClick={cargar} disabled={cargando}>
          <RefreshCw size={15} strokeWidth={2.4} /> Actualizar
        </button>
      </div>

      {/* Integraciones */}
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px', font: '800 15px var(--font-ui)', color: 'var(--ink-900)' }}>
          <Database size={17} strokeWidth={2.4} /> Integraciones
        </h3>
        {status ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              {status.profitPlus.conectado ? <CheckCircle2 size={18} color="var(--success-600)" /> : <AlertTriangle size={18} color="var(--warning-600, #b7791f)" />}
              <div>
                <div style={{ font: '700 13.5px var(--font-ui)', color: 'var(--ink-900)' }}>Profit Plus · modo {status.profitPlus.modo}</div>
                <div className="caption">{status.profitPlus.detalle}</div>
              </div>
            </div>
            <div className="caption">Correo: <b>{status.notificaciones.email}</b> · WhatsApp: <b>{status.notificaciones.whatsapp}</b></div>
          </div>
        ) : (
          <p className="cell-sub">Cargando…</p>
        )}
      </div>

      {/* Respaldos */}
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px', font: '800 15px var(--font-ui)', color: 'var(--ink-900)' }}>
          <HardDriveDownload size={17} strokeWidth={2.4} /> Respaldos automáticos
        </h3>
        {!backups ? (
          <p className="cell-sub">Cargando…</p>
        ) : !backups.configurado ? (
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--warning-600, #b7791f)' }}>
              <AlertTriangle size={18} /> <span style={{ font: '700 13.5px var(--font-ui)' }}>Sin respaldos registrados todavía</span>
            </div>
            <p className="caption" style={{ marginTop: 6 }}>
              Programa el script <code>scripts/punky-backup.sh</code> con cron en el VPS (ver <code>docs/respaldos.md</code>).
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              {backups.alDia ? <CheckCircle2 size={18} color="var(--success-600)" /> : <AlertTriangle size={18} color="var(--warning-600, #b7791f)" />}
              <span style={{ font: '700 13.5px var(--font-ui)', color: backups.alDia ? 'var(--success-600)' : 'var(--warning-600, #b7791f)' }}>
                {backups.alDia ? 'Al día' : 'Atrasado'}
                {backups.horasDesdeUltimo != null && ` · último hace ${Math.round(backups.horasDesdeUltimo)} h`}
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tabla-datos" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
                <thead>
                  <tr><th style={{ textAlign: 'left' }}>Archivo</th><th style={{ textAlign: 'right' }}>Tamaño</th><th style={{ textAlign: 'left' }}>Fecha</th><th /></tr>
                </thead>
                <tbody>
                  {backups.recientes.map((b) => (
                    <tr key={b.id} style={{ borderTop: '1px solid var(--line-100)' }}>
                      <td className="cell-sub" style={{ fontFamily: 'monospace', fontSize: 12 }}>{b.archivo}</td>
                      <td style={{ textAlign: 'right' }}>{fmtBytes(b.tamano_bytes)}</td>
                      <td className="cell-sub">{fmtFecha(b.created_at)}</td>
                      <td>{b.ok ? <CheckCircle2 size={15} color="var(--success-600)" /> : <AlertTriangle size={15} color="var(--danger-600, #c0392b)" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
