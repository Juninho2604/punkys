import { Router } from 'express'
import { db } from '../db/knex.js'
import { requireAuth } from '../middleware/auth.js'

export const dashboardRouter = Router()
dashboardRouter.use(requireAuth)

// Resumen operativo. Combina lo que la intranet YA tiene aunque nadie haya
// cotizado nativamente todavía: finanzas de Profit (pp_*), la operación del
// cliente traída de sus Sheets (op_pedidos) y la actividad nativa (quotes/
// shipments). Así el tablero muestra el negocio real desde el día uno.
dashboardRouter.get('/', async (_req, res, next) => {
  try {
    const n = (v: unknown) => Number(v ?? 0)
    const existe = async (t: string) => Boolean((await db.raw("SELECT to_regclass(?) AS t", [t])).rows?.[0]?.t)
    const hayOp = await existe('op_pedidos')

    // Ventas del mes (Profit)
    const [ventas] = await db('pp_ventas')
      .where('mes', db.raw("to_char(current_date,'YYYY-MM')"))
      .sum({ bs: 'monto_usd' })
      .sum({ usd: 'monto_usd_real' })

    // Cartera por cobrar (Profit)
    const [cxc] = await db('pp_cxc')
      .sum({ saldoBs: 'saldo' })
      .sum({ saldoUsd: 'saldo_usd' })
      .sum({ vencidoBs: db.raw('case when dias_vencido > 0 and saldo > 0 then saldo else 0 end') })

    // Pedidos activos y por aprobar (nativo). Los pedidos del cliente ya son
    // pedidos nativos: pendiente/aprobada = en curso sin despachar; los envíos
    // no entregados = en despacho. "Por aprobar" = cola de CxC (pendiente).
    const quotesActivas = n((await db('quotes').whereIn('estado', ['pendiente', 'aprobada']).count())[0]?.count)
    const shipActivos = n((await db('shipments').whereNot('estado', 'Entregado').count())[0]?.count)
    const quotesPend = n((await db('quotes').where('estado', 'pendiente').count())[0]?.count)

    // Pedidos recientes: de la operación del cliente; si no hay, envíos nativos
    let recientes: Record<string, unknown>[] = []
    if (hayOp) {
      recientes = await db('op_pedidos')
        .orderBy('fecha_pedido', 'desc')
        .limit(6)
        .select('numero', 'cliente', 'vendedor', 'estado', 'fecha_pedido', 'monto_usd')
    }
    if (!recientes.length) {
      const env = await db('shipments').orderBy('created_at', 'desc').limit(6).select('numero', 'cliente', 'estado', 'destino_ciudad')
      recientes = env.map((s) => ({ numero: s.numero, cliente: s.cliente, vendedor: null, estado: s.estado, fecha_pedido: null, monto_usd: null }))
    }

    // Por aprobar (con acción nativa): cotizaciones pendientes de la intranet
    const pendientes = await db('quotes as q')
      .leftJoin('users as u', 'u.id', 'q.created_by')
      .select('q.*', db.raw('COALESCE(q.vendedor_ext, u.nombre) as vendedor'))
      .where('q.estado', 'pendiente')
      .orderBy('q.created_at', 'desc')
      .limit(3)

    res.json({
      kpis: {
        ventasMesBs: n(ventas?.bs),
        ventasMesUsd: n(ventas?.usd),
        carteraBs: n(cxc?.saldoBs),
        carteraUsd: n(cxc?.saldoUsd),
        vencidoBs: n(cxc?.vencidoBs),
        pedidosActivos: quotesActivas + shipActivos,
        porAprobar: quotesPend,
      },
      recientes,
      pendientes,
    })
  } catch (err) {
    next(err)
  }
})
