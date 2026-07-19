import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config.js'
import { errorHandler } from './middleware/errors.js'
import { authRouter } from './routes/auth.js'
import { quotesRouter } from './routes/quotes.js'
import { shipmentsRouter } from './routes/shipments.js'
import { dashboardRouter } from './routes/dashboard.js'
import { systemRouter } from './routes/system.js'
import { tvRouter } from './routes/tv.js'
import { inventoryRouter } from './routes/inventory.js'
import { syncRouter } from './routes/sync.js'
import { usersRouter } from './routes/users.js'
import { cxcRouter } from './routes/cxc.js'
import { ventasRouter } from './routes/ventas.js'

export function createApp() {
  const app = express()
  // Detrás de Nginx: confía en el primer proxy para X-Forwarded-* (IP real y esquema para cookies Secure).
  app.set('trust proxy', 1)
  app.use(cors({ origin: config.clientOrigin, credentials: true }))
  // 10mb: el catálogo completo de inventario llega por /api/sync/productos
  app.use(express.json({ limit: '10mb' }))
  app.use(cookieParser())

  app.get('/api/health', (_req, res) => res.json({ ok: true }))
  app.use('/api/auth', authRouter)
  app.use('/api/quotes', quotesRouter)
  app.use('/api/shipments', shipmentsRouter)
  app.use('/api/dashboard', dashboardRouter)
  app.use('/api/system', systemRouter)
  app.use('/api/tv', tvRouter)
  app.use('/api/inventario', inventoryRouter)
  app.use('/api/sync', syncRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/cxc', cxcRouter)
  app.use('/api/ventas', ventasRouter)

  app.use(errorHandler)
  return app
}
