import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { profitPlus } from '../integrations/profitplus/index.js'

// Inventario (existencias por sede) leído a través del conector Profit Plus.
// En modo simulado sirve el catálogo DEMO; con el SQL Server conectado, el real.

export const inventoryRouter = Router()
inventoryRouter.use(requireAuth)

inventoryRouter.get('/search', async (req, res, next) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : ''
    const productos = await profitPlus.searchProducts(q)
    res.json({ productos })
  } catch (err) {
    next(err)
  }
})
