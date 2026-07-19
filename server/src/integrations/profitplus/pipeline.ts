import { db } from '../../db/knex.js'
import type { PPProduct, PPPushResult, PPQuotePayload, PPStatus, ProfitPlusConnector } from './types.js'

// Modo PIPELINE (Fase 1 del plan maestro): el inventario real llega desde los
// extractores del cliente (Profit → Excel → sync) a la tabla pp_products.
// Los productos/precios/stock para cotizar salen de ahí.
// La inyección de cotizaciones a Profit sigue pendiente del acceso al SQL
// Server (se comporta como el modo simulado y queda registrada).

function aProducto(row: any): PPProduct {
  return {
    codigo: row.codigo,
    nombre: row.nombre,
    precio: Number(row.precio),
    stock: row.stock ?? {},
  }
}

export class PipelineProfitPlusConnector implements ProfitPlusConnector {
  async pushQuote(quote: PPQuotePayload): Promise<PPPushResult> {
    const externalRef = `PP-PEND-${quote.numero}`
    console.log(
      `🔌 [Profit Plus pipeline] Cotización ${quote.numero} registrada para inyección futura (${quote.items.length} renglones) → ref ${externalRef}`,
    )
    return { ok: true, estado: 'simulado', externalRef }
  }

  async searchProducts(query: string): Promise<PPProduct[]> {
    const q = query.trim()
    const base = db('pp_products').where('activo', true).orderBy('nombre').limit(10)
    if (q) {
      base.andWhere((w) => {
        w.whereILike('nombre', `%${q}%`).orWhereILike('codigo', `%${q}%`)
      })
    }
    return (await base).map(aProducto)
  }

  async getProducts(codigos: string[]): Promise<PPProduct[]> {
    const rows = await db('pp_products').whereIn('codigo', codigos).andWhere('activo', true)
    return rows.map(aProducto)
  }

  async status(): Promise<PPStatus> {
    const ultimo = await db('sync_log').where('dataset', 'productos').orderBy('created_at', 'desc').first()
    const [{ count }] = await db('pp_products').where('activo', true).count()
    if (!ultimo) {
      return {
        modo: 'pipeline',
        conectado: false,
        detalle:
          'Modo pipeline activo pero SIN sincronizaciones aún. Correr el script sync_inventario.py desde la PC del cliente (ver docs/puente-datos.md).',
      }
    }
    const horas = (Date.now() - new Date(ultimo.created_at).getTime()) / 3_600_000
    return {
      modo: 'pipeline',
      conectado: horas < 24,
      detalle: `Última sincronización: ${new Date(ultimo.created_at).toLocaleString('es-VE')} (${ultimo.registros} productos, fuente: ${ultimo.fuente ?? '—'}). Activos: ${count}.${horas >= 24 ? ' ⚠️ Lleva más de 24h sin sincronizar.' : ''}`,
    }
  }
}
