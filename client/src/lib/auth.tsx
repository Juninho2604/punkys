import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from './api'
import type { User } from './types'

interface AuthCtx {
  user: User | null
  cargando: boolean
  login: (email: string, password: string, recordar: boolean) => Promise<void>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api
      .get<{ user: User }>('/auth/me')
      .then((r) => setUser(r.user))
      .catch(() => setUser(null))
      .finally(() => setCargando(false))
  }, [])

  const login = useCallback(async (email: string, password: string, recordar: boolean) => {
    const r = await api.post<{ user: User }>('/auth/login', { email, password, recordar })
    setUser(r.user)
  }, [])

  const logout = useCallback(async () => {
    await api.post('/auth/logout')
    setUser(null)
  }, [])

  return <Ctx.Provider value={{ user, cargando, login, logout }}>{children}</Ctx.Provider>
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth requiere AuthProvider')
  return ctx
}

export const ROL_LABEL: Record<string, string> = {
  vendedor: 'Ventas',
  cxc: 'Cuentas por Cobrar',
  facturacion: 'Facturación',
  despacho: 'Despacho',
  mercaderista: 'Mercaderista',
  admin: 'Owner',
}
