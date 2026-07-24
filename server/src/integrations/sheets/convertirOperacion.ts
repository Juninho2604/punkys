import { db } from '../../db/knex.js'
import { MILESTONES, estadoFromDone } from '../../services/workflow.js'

// Convierte los pedidos del cliente (op_pedidos, espejo de sus Sheets) en
// pedidos NATIVOS para que fluyan por los módulos según su etapa:
//   Recibido / CXC   → quote 'pendiente'  → Aprobaciones (CxC)
//   Facturación      → quote 'aprobada'   → Facturación
//   Logística        → quote 'facturada' + envío "Preparando"  → Despacho
//   En Ruta          → quote 'facturada' + envío "En tránsito" → Despacho
//   Entregado        → quote 'facturada' + envío "Entregado"   → Despacho (histórico)
//
// Es SOLO LECTURA sobre su sistema: leemos op_* (ya importado del snapshot) y
// escribimos en nuestras tablas nativas. Idempotente: UPSERT por número, se
// puede re-correr al traer un nuevo snapshot sin duplicar.

// El número del pedido conserva el correlativo del cliente. La secuencia viva
// está en la banda de los 1.100 (su último real ~1189); hay números sueltos
// mucho más altos (2.8xx, 5.7xx) que son casos especiales/archivo y NO deben
// arrastrar la numeración de los pedidos nuevos.
const TECHO_SECUENCIA = 2000

type MapEtapa = { quote: 'pendiente' | 'aprobada' | 'facturada'; done: number | null }

function mapearEtapa(estado: string | null | undefined): MapEtapa {
  const e = (estado ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
  if (e === 'entregado') return { quote: 'facturada', done: 5 }
  if (e === 'en ruta') return { quote: 'facturada', done: 3 }
  if (e === 'logistica') return { quote: 'facturada', done: 1 }
  if (e === 'facturacion') return { quote: 'aprobada', done: null }
  // 'recibido', 'cxc' y cualquier otro → pendiente de CxC
  return { quote: 'pendiente', done: null }
}

const num = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}
const r2 = (n: number) => Math.round(n * 100) / 100

// fecha_pedido puede venir como Date (columna `date` de pg) o como string.
function aFecha(v: unknown): Date {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v
  if (typeof v === 'string' && v.length >= 10) {
    const d = new Date(v.slice(0, 10) + 'T12:00:00')
    if (!Number.isNaN(d.getTime())) return d
  }
  return new Date()
}

export interface ResultadoConversion {
  ok: boolean
  quotes: number
  shipments: number
  proximoNumero: number | null
  errores: number
}

export async function convertirOpPedidosANativos(): Promise<ResultadoConversion> {
  // Necesitamos un usuario para created_by (FK obligatoria). Preferimos admin.
  const sistema = await db('users').where({ rol: 'admin' }).orderBy('id').first()
    || await db('users').orderBy('id').first()
  if (!sistema) {
    console.warn('⚠️ [Conversión] No hay usuarios; no se pueden crear pedidos nativos todavía.')
    return { ok: false, quotes: 0, shipments: 0, proximoNumero: null, errores: 0 }
  }

  const pedidos = await db('op_pedidos').select('*')
  if (!pedidos.length) return { ok: true, quotes: 0, shipments: 0, proximoNumero: null, errores: 0 }

  let quotes = 0
  let shipments = 0
  let errores = 0
  let maxSecuencia = 0

  for (const p of pedidos) {
    const numero = String(p.numero)
    const nEntero = Number(numero)
    if (Number.isInteger(nEntero) && nEntero < TECHO_SECUENCIA) {
      maxSecuencia = Math.max(maxSecuencia, nEntero)
    }
    const map = mapearEtapa(p.estado)
    const total = r2(num(p.monto_usd))
    const creado = aFecha(p.fecha_pedido)

    try {
      await db.transaction(async (trx) => {
        // Pedido nativo (quote) con el correlativo y la etapa del cliente.
        const [quote] = await trx('quotes')
          .insert({
            numero,
            razon_social: p.cliente ?? 'Cliente',
            rif: p.rif ?? 'S/R',
            telefono: null,
            contacto: null,
            origen: p.almacen ?? '—',
            destino_ciudad: '—',
            destino_direccion: '—',
            subtotal: total,
            iva: 0,
            total,
            estado: map.quote,
            factura_numero: p.nro_factura ?? null,
            created_by: sistema.id,
            fuente: 'importado',
            vendedor_ext: p.vendedor ?? null,
            created_at: creado,
            updated_at: creado,
          })
          .onConflict('numero')
          .merge(['razon_social', 'rif', 'origen', 'subtotal', 'iva', 'total', 'estado', 'factura_numero', 'fuente', 'vendedor_ext', 'updated_at'])
          .returning('*')

        // Renglones (a partir de la columna "Productos" ya parseada). Los
        // precios reales viven en Profit; aquí solo describimos la carga.
        const reng = await trx('op_pedido_reng').where('pedido_numero', numero).orderBy('id')
        await trx('quote_items').where('quote_id', quote.id).del()
        if (reng.length) {
          await trx('quote_items').insert(
            reng.map((r: { cantidad: number | null; descripcion: string | null }) => ({
              quote_id: quote.id,
              codigo: '—',
              nombre: r.descripcion ?? '—',
              precio_unit: 0,
              cantidad: Math.max(1, Math.round(num(r.cantidad) || 1)),
              total: 0,
            })),
          )
        }

        // Envío (Despacho) para las etapas de logística en adelante.
        if (map.done != null) {
          const done = map.done
          const estadoEnvio = estadoFromDone(done, false)
          const log = await trx('op_logistica').where('pedido_numero', numero).first()
          const [ship] = await trx('shipments')
            .insert({
              numero, // conserva el correlativo del cliente
              quote_id: quote.id,
              cliente: p.cliente ?? 'Cliente',
              origen: p.almacen ?? '—',
              destino_ciudad: log?.ciudad_destino ?? '—',
              destino_direccion: log?.destino ?? '—',
              transportista: log?.transporte ?? 'Por asignar',
              carga: p.productos ?? null,
              estado: estadoEnvio,
              done,
              nro_nota: p.nro_nota ?? null,
              nro_factura: p.nro_factura ?? null,
              tipo_transporte: log?.tipo_transporte ?? null,
              ruta: log?.ruta ?? null,
              kilos: log?.kilos ?? null,
              fuente: 'importado',
              created_at: creado,
              updated_at: creado,
            })
            .onConflict('numero')
            .merge(['quote_id', 'cliente', 'estado', 'done', 'nro_nota', 'nro_factura', 'tipo_transporte', 'ruta', 'kilos', 'fuente', 'updated_at'])
            .returning('*')

          // Hitos (0..4): marcados hasta la etapa alcanzada.
          await trx('shipment_milestones').where('shipment_id', ship.id).del()
          await trx('shipment_milestones').insert(
            MILESTONES.map((titulo, idx) => ({
              shipment_id: ship.id,
              idx,
              titulo,
              at: idx < done ? creado : null,
            })),
          )
          shipments++
        }
      })
      quotes++
    } catch (err) {
      errores++
      console.error(`⚠️ [Conversión] Pedido ${numero} no se pudo convertir:`, err instanceof Error ? err.message : err)
    }
  }

  // Continuar su secuencia: el próximo pedido nativo será maxSecuencia + 1.
  // Nunca retrocedemos el contador.
  let proximoNumero: number | null = null
  if (maxSecuencia > 0) {
    const [c] = await db('counters').where({ nombre: 'quote' }).select('valor')
    const actual = num(c?.valor)
    const nuevo = Math.max(actual, maxSecuencia)
    await db('counters').insert({ nombre: 'quote', valor: nuevo }).onConflict('nombre').merge()
    proximoNumero = nuevo + 1
  }

  return { ok: true, quotes, shipments, proximoNumero, errores }
}
