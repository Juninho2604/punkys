import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, Bell, Boxes, CheckCircle, Coins, FileText, HandCoins, KeyRound, Landmark, LayoutGrid, LogOut, MapPin, Menu, PackageSearch, Palette, Phone, ChevronLeft, ReceiptText, Search, ServerCog, ShoppingCart, Sparkles, Truck, Users, Wallet } from 'lucide-react'
import { ROL_LABEL, useAuth } from '../lib/auth'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'
import { iniciales } from '../lib/format'
import { InstallApp } from './InstallApp'
import type { Rol } from '../lib/types'

// Contexto para refrescar el contador de pendientes del sidebar tras aprobar/rechazar
const PendCtx = createContext<{ pendCount: number; factCount: number; refreshPend: () => void }>({ pendCount: 0, factCount: 0, refreshPend: () => {} })
export const usePend = () => useContext(PendCtx)

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutGrid
  roles: Rol[]
  badge?: 'pend' | 'fact'
}

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, roles: ['vendedor', 'cxc', 'facturacion', 'despacho', 'admin'] },
  { to: '/cotizacion', label: 'Nuevo Pedido', icon: FileText, roles: ['vendedor', 'admin'] },
  { to: '/aprobaciones', label: 'Aprobaciones', icon: CheckCircle, roles: ['cxc', 'admin'], badge: 'pend' },
  { to: '/facturacion', label: 'Facturación', icon: ReceiptText, roles: ['facturacion', 'admin'], badge: 'fact' },
  { to: '/cuentas-por-cobrar', label: 'Cuentas por Cobrar', icon: Wallet, roles: ['cxc', 'admin'] },
  { to: '/tesoreria', label: 'Tesorería', icon: Landmark, roles: ['cxc', 'admin'] },
  { to: '/despacho', label: 'Despacho', icon: Truck, roles: ['vendedor', 'despacho', 'admin'] },
  { to: '/visitas', label: 'Visitas de campo', icon: MapPin, roles: ['mercaderista', 'vendedor', 'admin'] },
]

const TITULOS: Record<string, string> = {
  '/': 'Dashboard',
  '/cotizacion': 'Nuevo Pedido',
  '/aprobaciones': 'Aprobaciones',
  '/facturacion': 'Facturación',
  '/cuentas-por-cobrar': 'Cuentas por Cobrar',
  '/tesoreria': 'Tesorería · Flujo de Caja',
  '/ventas': 'Ventas Analítica',
  '/comisiones': 'Comisiones',
  '/compras': 'Compras & Por Pagar',
  '/reposicion': 'Reposición · Compras',
  '/costos': 'Costos de envío',
  '/reportes': 'Reportes IA',
  '/sistema': 'Sistema',
  '/catalogos': 'Catálogos operacionales',
  '/lineas': 'Líneas telefónicas',
  '/notificaciones': 'Notificaciones',
  '/despacho': 'Despacho',
  '/visitas': 'Visitas de campo',
  '/usuarios': 'Usuarios',
  '/sistema-diseno': 'Sistema de Diseño',
}

export function Shell() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pendCount, setPendCount] = useState(0)
  const [factCount, setFactCount] = useState(0)
  const [cambiandoClave, setCambiandoClave] = useState(false)
  const [clave, setClave] = useState({ actual: '', nueva: '', repetir: '' })
  const [ocupado, setOcupado] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const refreshPend = useCallback(() => {
    api
      .get<{ quotes: unknown[] }>('/quotes?estado=pendiente')
      .then((r) => setPendCount(r.quotes.length))
      .catch(() => {})
    api
      .get<{ quotes: unknown[] }>('/quotes?estado=aprobada')
      .then((r) => setFactCount(r.quotes.length))
      .catch(() => {})
  }, [])

  useEffect(refreshPend, [refreshPend, location.pathname])

  // Al navegar, cierra el drawer móvil
  useEffect(() => setMobileOpen(false), [location.pathname])

  if (!user) return null
  const items = NAV.filter((n) => n.roles.includes(user.rol))
  const seccion = '/' + (location.pathname.split('/')[1] ?? '')
  const titulo = TITULOS[seccion] ?? 'Dashboard'

  return (
    <PendCtx.Provider value={{ pendCount, factCount, refreshPend }}>
      <div className="shell">
        {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}
        <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
          <div className="sidebar-brand">
            {collapsed ? (
              <img src="/logo-isotipo.png" alt="Punky Partners" style={{ width: 40, height: 40, borderRadius: 9 }} />
            ) : (
              <img src="/logo-wordmark-white.png" alt="Punky Partners" style={{ width: 150 }} />
            )}
          </div>
          <nav className="sidebar-nav">
            {items.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                <n.icon size={19} strokeWidth={2.2} />
                {!collapsed && (
                  <span className="label">
                    {n.label}
                    {n.badge === 'pend' && pendCount > 0 && <span className="sidebar-count">{pendCount}</span>}
                    {n.badge === 'fact' && factCount > 0 && <span className="sidebar-count">{factCount}</span>}
                  </span>
                )}
              </NavLink>
            ))}
            {user.rol === 'admin' && (
              <>
                <div className="sidebar-divider" />
                <NavLink to="/ventas" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <BarChart3 size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Ventas Analítica</span>}
                </NavLink>
                <NavLink to="/compras" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <ShoppingCart size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Compras &amp; Por Pagar</span>}
                </NavLink>
                <NavLink to="/reposicion" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <PackageSearch size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Reposición</span>}
                </NavLink>
                <NavLink to="/costos" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <Coins size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Costos de envío</span>}
                </NavLink>
                <NavLink to="/reportes" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <Sparkles size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Reportes IA</span>}
                </NavLink>
                <NavLink to="/sistema" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <ServerCog size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Sistema</span>}
                </NavLink>
                <NavLink to="/catalogos" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <Boxes size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Catálogos</span>}
                </NavLink>
                <NavLink to="/lineas" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <Phone size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Líneas telefónicas</span>}
                </NavLink>
                <NavLink to="/notificaciones" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <Bell size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Notificaciones</span>}
                </NavLink>
                <NavLink to="/comisiones" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <HandCoins size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Comisiones</span>}
                </NavLink>
                <NavLink to="/usuarios" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                  <Users size={19} strokeWidth={2.2} />
                  {!collapsed && <span className="label">Usuarios</span>}
                </NavLink>
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
            <button className="menu-btn" title="Menú" onClick={() => setMobileOpen(true)}>
              <Menu size={19} strokeWidth={2.2} color="var(--ink-900)" />
            </button>
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
            <InstallApp />
            <button className="header-bell" title="Notificaciones">
              <Bell size={18} strokeWidth={2.2} color="var(--ink-900)" />
              <span className="dot" />
            </button>
            <div className="header-profile">
              <div className="header-avatar">{iniciales(user.nombre)}</div>
              <div className="profile-text">
                <div style={{ font: "800 13.5px var(--font-ui)", color: 'var(--ink-900)', lineHeight: 1.2 }}>{user.nombre}</div>
                <div style={{ font: "700 11px var(--font-ui)", color: 'var(--ink-500)' }}>{ROL_LABEL[user.rol]}</div>
              </div>
              <button className="header-logout" title="Cambiar mi contraseña" onClick={() => setCambiandoClave(true)}>
                <KeyRound size={16} strokeWidth={2.4} />
              </button>
              <button className="header-logout" title="Cerrar sesión" onClick={logout}>
                <LogOut size={17} strokeWidth={2.4} />
              </button>
            </div>
          </header>
          <main className="main-content">
            <Outlet />
          </main>
        </div>

        {cambiandoClave && (
          <div className="modal-backdrop" onClick={() => setCambiandoClave(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3>Cambiar mi contraseña</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="field">
                  <label className="field-label">Contraseña actual</label>
                  <input className="input-text" type="password" value={clave.actual} onChange={(e) => setClave({ ...clave, actual: e.target.value })} autoComplete="current-password" />
                </div>
                <div className="field">
                  <label className="field-label">Nueva contraseña (mín. 8)</label>
                  <input className="input-text" type="password" value={clave.nueva} onChange={(e) => setClave({ ...clave, nueva: e.target.value })} autoComplete="new-password" />
                </div>
                <div className="field">
                  <label className="field-label">Repetir nueva contraseña</label>
                  <input className="input-text" type="password" value={clave.repetir} onChange={(e) => setClave({ ...clave, repetir: e.target.value })} autoComplete="new-password" />
                  {clave.repetir.length > 0 && clave.repetir !== clave.nueva && <div className="field-error">No coincide con la nueva contraseña</div>}
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                  <button className="btn btn-secondary" onClick={() => setCambiandoClave(false)}>Cancelar</button>
                  <button
                    className="btn btn-primary"
                    disabled={ocupado || clave.nueva.length < 8 || clave.nueva !== clave.repetir || !clave.actual}
                    onClick={async () => {
                      setOcupado(true)
                      try {
                        await api.post('/users/me/password', { actual: clave.actual, nueva: clave.nueva })
                        toast('Contraseña actualizada ✓')
                        setCambiandoClave(false)
                        setClave({ actual: '', nueva: '', repetir: '' })
                      } catch (err) {
                        toast(err instanceof Error ? err.message : 'No se pudo cambiar')
                      } finally {
                        setOcupado(false)
                      }
                    }}
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PendCtx.Provider>
  )
}
