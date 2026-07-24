import { useEffect, useState } from 'react'
import { Mail, Bell, Plus, Trash2 } from 'lucide-react'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'

interface Grupo { id: number; grupo: string; correos: string }
interface Tipo { id: number; clave: string; nombre: string; activo: boolean; para: string | null; cc: string | null; destino: string | null }

export function NotifConfig() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [tipos, setTipos] = useState<Tipo[]>([])
  const [nuevoGrupo, setNuevoGrupo] = useState({ grupo: '', correos: '' })
  const toast = useToast()

  function cargar() {
    api.get<{ grupos: Grupo[]; tipos: Tipo[] }>('/notif/config').then((r) => { setGrupos(r.grupos); setTipos(r.tipos) }).catch(() => {})
  }
  useEffect(cargar, [])

  async function crearGrupo() {
    if (!nuevoGrupo.grupo.trim() || !nuevoGrupo.correos.trim()) return
    try {
      await api.post('/notif/grupos', { grupo: nuevoGrupo.grupo.trim(), correos: nuevoGrupo.correos.trim() })
      setNuevoGrupo({ grupo: '', correos: '' })
      cargar()
    } catch (e) { toast(e instanceof Error ? e.message : 'Error') }
  }
  async function guardarGrupo(g: Grupo) {
    try { await api.patch(`/notif/grupos/${g.id}`, { correos: g.correos }); toast('Grupo guardado ✓') } catch (e) { toast(e instanceof Error ? e.message : 'Error') }
  }
  async function borrarGrupo(g: Grupo) {
    if (!window.confirm(`¿Eliminar el grupo ${g.grupo}?`)) return
    try { await api.del(`/notif/grupos/${g.id}`); cargar() } catch (e) { toast(e instanceof Error ? e.message : 'Error') }
  }
  async function toggleTipo(t: Tipo) {
    try { await api.patch(`/notif/tipos/${t.id}`, { activo: !t.activo }); setTipos((ts) => ts.map((x) => x.id === t.id ? { ...x, activo: !x.activo } : x)) } catch (e) { toast(e instanceof Error ? e.message : 'Error') }
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 860 }}>
      <p className="subtitle" style={{ margin: 0 }}>
        Ruteo de las notificaciones automáticas (grupos de correo y tipos de alerta). El envío real se activa al configurar el SMTP.
      </p>

      {/* Grupos de correo */}
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px', font: '800 15px var(--font-display)', color: 'var(--brand-900)' }}>
          <Mail size={17} strokeWidth={2.4} /> Grupos de correo
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {grupos.map((g) => (
            <div key={g.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr auto', gap: 10, alignItems: 'center' }}>
              <span className="cell-strong" style={{ fontFamily: 'monospace' }}>{g.grupo}</span>
              <input className="input-text" style={{ padding: '8px 10px', fontSize: 13 }} value={g.correos}
                onChange={(e) => setGrupos((gs) => gs.map((x) => x.id === g.id ? { ...x, correos: e.target.value } : x))}
                onBlur={() => guardarGrupo(g)} />
              <button className="btn btn-secondary" style={{ padding: '6px 9px' }} onClick={() => borrarGrupo(g)}><Trash2 size={14} color="var(--danger-500)" /></button>
            </div>
          ))}
          {grupos.length === 0 && <div className="cell-sub">Sin grupos. Se llenan al importar la config del cliente.</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr auto', gap: 10, alignItems: 'center', borderTop: '1px solid var(--line-soft)', paddingTop: 10 }}>
            <input className="input-text" style={{ padding: '8px 10px', fontSize: 13 }} placeholder="nombre_grupo" value={nuevoGrupo.grupo} onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, grupo: e.target.value })} />
            <input className="input-text" style={{ padding: '8px 10px', fontSize: 13 }} placeholder="correo1@…, correo2@…" value={nuevoGrupo.correos} onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, correos: e.target.value })} />
            <button className="btn btn-primary" style={{ padding: '7px 12px' }} onClick={crearGrupo}><Plus size={14} /></button>
          </div>
        </div>
      </div>

      {/* Tipos de notificación */}
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px', font: '800 15px var(--font-display)', color: 'var(--brand-900)' }}>
          <Bell size={17} strokeWidth={2.4} /> Tipos de notificación
        </h3>
        <div className="table-scroll">
          <table className="tabla-datos" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr style={{ font: '700 11px var(--font-ui)', color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: 0.5, background: '#f3f8fd' }}>
                <th style={{ textAlign: 'left', padding: '8px 10px' }}>Activo</th>
                <th style={{ textAlign: 'left', padding: '8px 10px' }}>Notificación</th>
                <th style={{ textAlign: 'left', padding: '8px 10px' }}>Ruteo</th>
              </tr>
            </thead>
            <tbody>
              {tipos.map((t) => (
                <tr key={t.id} style={{ borderTop: '1px solid var(--line-soft)', opacity: t.activo ? 1 : 0.55 }}>
                  <td style={{ padding: '8px 10px' }}>
                    <input type="checkbox" checked={t.activo} onChange={() => toggleTipo(t)} />
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <div className="cell-main">{t.nombre}</div>
                    <div className="caption" style={{ fontFamily: 'monospace' }}>{t.clave}</div>
                  </td>
                  <td style={{ padding: '8px 10px' }} className="cell-sub">{t.destino || `${t.para ?? ''}${t.cc ? ` · CC ${t.cc}` : ''}` || '—'}</td>
                </tr>
              ))}
              {tipos.length === 0 && <tr><td colSpan={3} style={{ padding: 16 }} className="cell-sub">Sin tipos. Se llenan al importar la config del cliente.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
