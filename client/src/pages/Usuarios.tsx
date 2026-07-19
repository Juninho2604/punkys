import { useCallback, useEffect, useState } from 'react'
import { KeyRound, Plus, UserCheck, UserX } from 'lucide-react'
import { api } from '../lib/api'
import { ROL_LABEL, useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import type { Rol, User } from '../lib/types'

// Gestión de usuarios (solo admin). Heredada del modelo del sistema previo:
// usuarios activables/desactivables, rol por área, restablecer contraseña.

interface UserAdmin extends User {
  telefono: string | null
  activo: boolean
}

const ROLES: Rol[] = ['vendedor', 'cxc', 'facturacion', 'despacho', 'admin']

export function Usuarios() {
  const { user: yo } = useAuth()
  const toast = useToast()
  const [users, setUsers] = useState<UserAdmin[]>([])
  const [creando, setCreando] = useState(false)
  const [claveDe, setClaveDe] = useState<UserAdmin | null>(null)
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', password: '', rol: 'vendedor' as Rol, telefono: '' })
  const [nuevaClave, setNuevaClave] = useState('')
  const [ocupado, setOcupado] = useState(false)

  const cargar = useCallback(() => {
    api.get<{ users: UserAdmin[] }>('/users').then((r) => setUsers(r.users)).catch(console.error)
  }, [])
  useEffect(cargar, [cargar])

  async function crear() {
    setOcupado(true)
    try {
      await api.post('/users', { ...nuevo, telefono: nuevo.telefono.trim() })
      toast(`Usuario ${nuevo.email} creado ✓`)
      setCreando(false)
      setNuevo({ nombre: '', email: '', password: '', rol: 'vendedor', telefono: '' })
      cargar()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo crear')
    } finally {
      setOcupado(false)
    }
  }

  async function cambiar(u: UserAdmin, patch: Partial<Pick<UserAdmin, 'rol' | 'activo'>>) {
    try {
      await api.patch(`/users/${u.id}`, patch)
      toast(patch.activo === false ? `${u.nombre} desactivado` : patch.activo === true ? `${u.nombre} reactivado ✓` : `Rol de ${u.nombre} actualizado ✓`)
      cargar()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo actualizar')
      cargar()
    }
  }

  async function restablecerClave() {
    if (!claveDe) return
    setOcupado(true)
    try {
      await api.post(`/users/${claveDe.id}/password`, { nueva: nuevaClave })
      toast(`Contraseña de ${claveDe.nombre} restablecida ✓`)
      setClaveDe(null)
      setNuevaClave('')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo restablecer')
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 className="h1-module">Usuarios</h1>
          <p className="subtitle">Accesos del equipo por área. Los desactivados no pueden entrar.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} onClick={() => setCreando(true)}>
          <Plus size={16} strokeWidth={2.6} /> Nuevo usuario
        </button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-scroll">
          <div className="table-min-760">
            <div className="table-head cols-usuarios">
              <span>Nombre</span><span>Email</span><span>Rol</span><span>Estado</span><span>Acciones</span>
            </div>
            {users.map((u) => (
              <div key={u.id} className={`table-row cols-usuarios${u.activo ? '' : ' user-row-inactivo'}`} style={{ cursor: 'default' }}>
                <span className="cell-main">{u.nombre}{u.id === yo?.id && <span className="caption"> (tú)</span>}</span>
                <span className="cell-sub">{u.email}</span>
                <span>
                  <select
                    className="input-text"
                    style={{ padding: '6px 8px', fontSize: 13, width: 'auto' }}
                    value={u.rol}
                    onChange={(e) => cambiar(u, { rol: e.target.value as Rol })}
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{ROL_LABEL[r]}</option>)}
                  </select>
                </span>
                <span>
                  <span className="badge" style={u.activo ? { background: 'var(--success-soft)', color: 'var(--success-600)' } : { background: 'var(--neutral-soft)', color: 'var(--neutral-fg)' }}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </span>
                <span style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary" style={{ padding: '7px 10px', fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 6 }} title="Restablecer contraseña" onClick={() => { setClaveDe(u); setNuevaClave('') }}>
                    <KeyRound size={14} strokeWidth={2.4} /> Clave
                  </button>
                  {u.activo ? (
                    <button className="btn-reject-soft" style={{ flex: 'none', padding: '7px 10px', display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => cambiar(u, { activo: false })}>
                      <UserX size={14} strokeWidth={2.4} /> Desactivar
                    </button>
                  ) : (
                    <button className="btn-approve-soft" style={{ flex: 'none', padding: '7px 10px', display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => cambiar(u, { activo: true })}>
                      <UserCheck size={14} strokeWidth={2.4} /> Reactivar
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {creando && (
        <div className="modal-backdrop" onClick={() => setCreando(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Nuevo usuario</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label className="field-label">Nombre y apellido</label>
                <input className="input-text" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} placeholder="Ej: Ana Pérez" />
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="input-text" type="email" value={nuevo.email} onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })} placeholder="ana@punkypartners.com" />
              </div>
              <div className="field">
                <label className="field-label">Contraseña inicial (mín. 8)</label>
                <input className="input-text" type="text" value={nuevo.password} onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })} placeholder="La compartes con la persona" />
              </div>
              <div className="form-grid-2">
                <div className="field">
                  <label className="field-label">Rol</label>
                  <select className="input-text" value={nuevo.rol} onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value as Rol })}>
                    {ROLES.map((r) => <option key={r} value={r}>{ROL_LABEL[r]}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Teléfono (opcional)</label>
                  <input className="input-text" value={nuevo.telefono} onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })} placeholder="+58 412 000 0000" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                <button className="btn btn-secondary" onClick={() => setCreando(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={crear} disabled={ocupado}>Crear usuario</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {claveDe && (
        <div className="modal-backdrop" onClick={() => setClaveDe(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Restablecer contraseña</h3>
            <p className="subtitle" style={{ margin: '0 0 14px' }}>{claveDe.nombre} · {claveDe.email}</p>
            <div className="field">
              <label className="field-label">Nueva contraseña (mín. 8)</label>
              <input className="input-text" type="text" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} placeholder="La compartes con la persona" />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
              <button className="btn btn-secondary" onClick={() => setClaveDe(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={restablecerClave} disabled={ocupado || nuevaClave.length < 8}>Restablecer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
