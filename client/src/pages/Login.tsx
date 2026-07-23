import { useState, type FormEvent } from 'react'
import { Lock } from 'lucide-react'
import { MascotaFrenchie } from '../components/MascotaFrenchie'
import { useAuth } from '../lib/auth'

export function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [recordar, setRecordar] = useState(true)
  const [pwHide, setPwHide] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await login(email, pass, recordar)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-blob" style={{ width: 520, height: 520, background: '#BCDCF4', top: -180, left: -160 }} />
      <div className="login-blob" style={{ width: 420, height: 420, background: '#C9E3F7', bottom: -160, right: -120 }} />
      <div className="login-blob" style={{ width: 140, height: 140, background: '#1A3F8F', opacity: 0.08, top: 120, right: '18%' }} />

      <div className="login-card">
        <div className="login-mascota">
          <MascotaFrenchie hideEyes={pwHide} />
        </div>
        <div className="login-logo">
          <img src="/logo-wordmark.png" alt="Punky Partners" style={{ width: 220, position: 'relative' }} />
        </div>
        <h1 className="h1" style={{ textAlign: 'center', marginBottom: 4 }}>
          ¡Hola de nuevo!
        </h1>
        <p className="subtitle" style={{ textAlign: 'center', margin: '0 0 24px' }}>
          Entra para gestionar la logística de Punky Partners.
        </p>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="field">
            <label className="field-label">Email o usuario</label>
            <input
              type="email"
              className="input-text"
              placeholder="nombre@punkypartners.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label className="field-label">Contraseña</label>
            <input
              type="password"
              className={`input-text${error ? ' error' : ''}`}
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onFocus={() => setPwHide(true)}
              onBlur={() => setPwHide(false)}
              autoComplete="current-password"
              required
            />
            {error && <div className="field-error">{error}</div>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, font: '600 13px var(--font-ui)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--brand-800)' }}
              />
              Recordar equipo
            </label>
            <a href="#" className="link" onClick={(e) => e.preventDefault()}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 13, fontSize: 15, marginTop: 4 }} disabled={enviando}>
            {enviando ? 'Entrando…' : 'Iniciar sesión'}
          </button>
        </form>
        <div className="login-footer">
          <Lock size={13} strokeWidth={2.5} color="var(--ink-500)" />
          <span className="caption" style={{ color: 'var(--ink-500)' }}>
            Acceso restringido · Conexión cifrada TLS 1.3
          </span>
        </div>
      </div>
    </div>
  )
}
