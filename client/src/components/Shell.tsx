import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, CheckCircle, FileText, LayoutGrid, LogOut, Palette, ChevronLeft, Search, Truck } from 'lucide-react'
import { ROL_LABEL, useAuth } from '../lib/auth'
import { api } from '../lib/api'
import { iniciales } from '../lib/format'
import type { Rol } from '../lib/types'

// Contexto para refrescar el contador de pendientes del sidebar tras aprobar/rechazar
const PendCtx = createContext<{ pendCount: number; refreshPend: () => void }>({ pendCount: 0, refreshPend: () => {} })
export const usePend = () => useContext(PendCtx)

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutGrid
  roles: Rol[]
  badge?: boolean
}

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, roles: ['vendedor', 'cxc', 'despacho', 'admin'] },
  { to: '/cotizacion', label: 'Cotización', icon: FileText, roles: ['vendedor', 'admin'] },
  { to: '/aprobaciones', label: 'Aprobaciones', icon: CheckCircle, roles: ['cxc', 'admin'], badge: true },
  { to: '/despacho', label: 'Despacho', icon: Truck, roles: ['vendedor', 'despacho', 'admin'] },
]

const TITULOS: Record<string, string> = {
  '/': 'Dashboard',
  '/cotizacion': 'Cotización',
  '/aprobaciones': 'Aprobaciones',
  '/despacho': 'Despacho',
  '/sistema-diseno': 'Sistema de Diseño',
}

export function Shell() {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [pendCount, setPendCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  const refreshPend = useCallback(() => {
    api
      .get<{ quotes: unknown[] }>('/quotes?estado=pendiente')
      .then((r) => setPendCount(r.quotes.length))
      .catch(() => {})
  }, [])

  useEffect(refreshPend, [refreshPend, location.pathname])

  if (!user) return null
  const items = NAV.filter((n) => n.roles.includes(user.rol))
  const seccion = '/' + (location.pathname.split('/')[1] ?? '')
  const titulo = TITULOS[seccion] ?? 'Dashboard'

  return (
    <PendCtx.Provider value={{ pendCount, refreshPend }}>
      <div className="shell">
        <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
          <div className="sidebar-brand">
            {collapsed ? (
              <img src="/logo-circulo.png" alt="Punky Partners" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            ) : (
              <img src="/logo-letters.png" alt="Punky Partners" style={{ width: 150 }} />
            )}
          </div>
          <nav className="sidebar-nav">
            {items.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                <n.icon size={19} strokeWidth={2.2} />
                {!collapsed && (
                  <span className="label">
                    {n.label}
                    {n.badge && pendCount > 0 && <span className="sidebar-count">{pendCount}</span>}
                  </span>
                )}
              </NavLink>
            ))}
            {user.rol === 'admin' && (
              <>
                <div className="sidebar-divider" />
                <NavLink to="/sistema-diseno" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <Palette size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Sistema de Diseño</span>}
                </NavLink>
              </>
            )}
          </nav>
          <button className="sidebar-collapse" onClick={() => setCollapsed((c) => !c)}>
            <span className="chev">
              <ChevronLeft size={16} strokeWidth={2.5} />
            </span>
            {!collapsed && <span>Colapsar menú</span>}
          </button>
        </aside>

        <div className="main-col">
          <header className="header-admin">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="header-breadcrumb">Inicio / {titulo}</div>
              <div className="header-title">{titulo}</div>
            </div>
            <div className="header-search">
              <Search size={15} strokeWidth={2.4} color="var(--ink-300)" />
              <input
                placeholder="Buscar envío, cotización…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate('/despacho')
                }}
              />
            </div>
            <button className="header-bell" title="Notificaciones">
              <Bell size={18} strokeWidth={2.2} color="var(--ink-900)" />
              <span className="dot" />
            </button>
            <div className="header-profile">
              <div className="header-avatar">{iniciales(user.nombre)}</div>
              <div>
                <div style={{ font: "800 13.5px var(--font-ui)", color: 'var(--ink-900)', lineHeight: 1.2 }}>{user.nombre}</div>
                <div style={{ font: "700 11px var(--font-ui)", color: 'var(--ink-500)' }}>{ROL_LABEL[user.rol]}</div>
              </div>
              <button className="header-logout" title="Cerrar sesión" onClick={logout}>
                <LogOut size={17} strokeWidth={2.4} />
              </button>
            </div>
          </header>
          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </PendCtx.Provider>
  )
}
