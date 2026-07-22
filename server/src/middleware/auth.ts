import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export type Rol = 'vendedor' | 'cxc' | 'facturacion' | 'despacho' | 'mercaderista' | 'admin'

export interface AuthUser {
  id: number
  nombre: string
  email: string
  rol: Rol
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export const COOKIE_NAME = 'punky_token'

export function signToken(user: AuthUser): string {
  return jwt.sign(user, config.jwtSecret, { expiresIn: '12h' })
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) {
    res.status(401).json({ error: 'No autenticado' })
    return
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthUser & { iat: number; exp: number }
    req.user = { id: payload.id, nombre: payload.nombre, email: payload.email, rol: payload.rol }
    next()
  } catch {
    res.status(401).json({ error: 'Sesión expirada o inválida' })
  }
}

// El rol admin (Owner) siempre pasa.
export function requireRole(...roles: Rol[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user
    if (!user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }
    if (user.rol !== 'admin' && !roles.includes(user.rol)) {
      res.status(403).json({ error: 'No tienes permisos para esta acción' })
      return
    }
    next()
  }
}
