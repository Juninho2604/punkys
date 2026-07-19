import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import { ToastProvider } from './lib/toast'
import { Shell } from './components/Shell'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Cotizacion } from './pages/Cotizacion'
import { Aprobaciones } from './pages/Aprobaciones'
import { Despacho } from './pages/Despacho'
import { DespachoDetalle } from './pages/DespachoDetalle'
import { DesignSystem } from './pages/DesignSystem'
import { TvBoard } from './pages/TvBoard'
import { ImprimirCotizacion } from './pages/ImprimirCotizacion'
import { Usuarios } from './pages/Usuarios'
import type { Rol } from './lib/types'

function Protegida({ roles, children }: { roles?: Rol[]; children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && user.rol !== 'admin' && !roles.includes(user.rol)) return <Navigate to="/" replace />
  return <>{children}</>
}

function Rutas() {
  const { user, cargando } = useAuth()
  if (cargando) return null

  return (
    <Routes>
      {/* Centro de Operaciones (TV): acceso por clave en la URL, sin sesión */}
      <Route path="/tv/:clave" element={<TvBoard />} />
      {/* Hoja imprimible: fuera del Shell para que salga limpia */}
      <Route path="/cotizaciones/:id/imprimir" element={<Protegida><ImprimirCotizacion /></Protegida>} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route
        element={
          <Protegida>
            <Shell />
          </Protegida>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/cotizacion" element={<Protegida roles={['vendedor']}><Cotizacion /></Protegida>} />
        <Route path="/aprobaciones" element={<Protegida roles={['cxc']}><Aprobaciones /></Protegida>} />
        <Route path="/despacho" element={<Protegida roles={['vendedor', 'despacho']}><Despacho /></Protegida>} />
        <Route path="/despacho/:id" element={<Protegida roles={['vendedor', 'despacho']}><DespachoDetalle /></Protegida>} />
        <Route path="/usuarios" element={<Protegida roles={[]}><Usuarios /></Protegida>} />
        <Route path="/sistema-diseno" element={<Protegida roles={[]}><DesignSystem /></Protegida>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Rutas />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
