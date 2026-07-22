import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db/knex.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

// Visitas de campo (mercaderistas / asesores). Registro móvil con GPS, fotos,
// precios de la competencia y degustaciones. Las fotos se guardan en la base
// (bytea) y se sirven por un endpoint autenticado.

export const visitasRouter = Router()
visitasRouter.use(requireAuth)

// Quién puede cargar y ver todo (Owner) vs. solo lo propio.
function soloPropias(rol: string): boolean {
  return rol !== 'admin'
}

// ── Buscador de clientes (para asociar la visita a un cliente del catálogo) ───
visitasRouter.get('/clientes', async (req, res, next) => {
  try {
    const q = (typeof req.query.q === 'string' ? req.query.q : '').trim()
    if (q.length < 2) {
      res.json({ clientes: [] })
      return
    }
    const clientes = await db('clients')
      .whereILike('razon_social', `%${q}%`)
      .orWhereILike('rif', `%${q}%`)
      .select('id', 'razon_social', 'rif')
      .orderBy('razon_social')
      .limit(20)
    res.json({ clientes })
  } catch (err) {
    next(err)
  }
})

// ── Lista de visitas ─────────────────────────────────────────────────────────
visitasRouter.get('/', async (req, res, next) => {
  try {
    const query = db('visitas as v')
      .leftJoin('users as u', 'u.id', 'v.usuario_id')
      .select(
        'v.id',
        'v.cliente_nombre',
        'v.lat',
        'v.lng',
        'v.direccion',
        'v.notas',
        'v.created_at',
        'u.nombre as usuario',
      )
      .orderBy('v.created_at', 'desc')
      .limit(200)
    if (soloPropias(req.user!.rol)) query.where('v.usuario_id', req.user!.id)
    const visitas = await query

    // Conteos por visita (fotos / competencia / degustaciones)
    const ids = visitas.map((x) => x.id)
    const cuenta = async (tabla: string) =>
      ids.length
        ? await db(tabla).whereIn('visita_id', ids).groupBy('visita_id').select('visita_id').count('* as n')
        : []
    const [fotos, comp, deg] = await Promise.all([
      cuenta('visita_fotos'),
      cuenta('visita_competencia'),
      cuenta('visita_degustaciones'),
    ])
    const mapa = (rows: any[]) => new Map(rows.map((r) => [r.visita_id, Number(r.n)]))
    const mFotos = mapa(fotos)
    const mComp = mapa(comp)
    const mDeg = mapa(deg)
    for (const v of visitas) {
      v.fotos = mFotos.get(v.id) ?? 0
      v.competencia = mComp.get(v.id) ?? 0
      v.degustaciones = mDeg.get(v.id) ?? 0
    }

    res.json({ visitas })
  } catch (err) {
    next(err)
  }
})

// ── Detalle de una visita (sin el binario de las fotos, solo sus ids) ─────────
visitasRouter.get('/:id(\\d+)', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const visita = await db('visitas as v')
      .leftJoin('users as u', 'u.id', 'v.usuario_id')
      .select('v.*', 'u.nombre as usuario')
      .where('v.id', id)
      .first()
    if (!visita) {
      res.status(404).json({ error: 'Visita no encontrada' })
      return
    }
    if (soloPropias(req.user!.rol) && visita.usuario_id !== req.user!.id) {
      res.status(403).json({ error: 'No tienes permiso para ver esta visita' })
      return
    }
    const [fotos, competencia, degustaciones] = await Promise.all([
      db('visita_fotos').where('visita_id', id).select('id').orderBy('id'),
      db('visita_competencia').where('visita_id', id).orderBy('id'),
      db('visita_degustaciones').where('visita_id', id).orderBy('id'),
    ])
    res.json({ visita: { ...visita, fotos: fotos.map((f) => f.id), competencia, degustaciones } })
  } catch (err) {
    next(err)
  }
})

// ── Servir la imagen de una foto (autenticado) ───────────────────────────────
visitasRouter.get('/foto/:id(\\d+)', async (req, res, next) => {
  try {
    const foto = await db('visita_fotos as f')
      .join('visitas as v', 'v.id', 'f.visita_id')
      .select('f.imagen', 'f.mime', 'v.usuario_id')
      .where('f.id', Number(req.params.id))
      .first()
    if (!foto) {
      res.status(404).end()
      return
    }
    if (soloPropias(req.user!.rol) && foto.usuario_id !== req.user!.id) {
      res.status(403).end()
      return
    }
    res.setHeader('Content-Type', foto.mime || 'image/jpeg')
    res.setHeader('Cache-Control', 'private, max-age=86400')
    res.send(foto.imagen)
  } catch (err) {
    next(err)
  }
})

// ── Crear visita (mercaderista / vendedor / admin) ───────────────────────────
const nuevaSchema = z.object({
  clienteId: z.coerce.number().int().positive().optional(),
  clienteNombre: z.string().trim().min(2, 'Indica el cliente o punto de venta'),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  gpsPrecision: z.coerce.number().nonnegative().optional(),
  direccion: z.string().trim().max(400).optional().default(''),
  notas: z.string().trim().max(2000).optional().default(''),
  fotos: z.array(z.string()).max(8, 'Máximo 8 fotos por visita').optional().default([]),
  competencia: z
    .array(
      z.object({
        producto: z.string().trim().min(1),
        competidor: z.string().trim().max(120).optional().default(''),
        precio: z.coerce.number().nonnegative().optional(),
        moneda: z.string().trim().max(8).optional().default('Bs'),
        nota: z.string().trim().max(300).optional().default(''),
      }),
    )
    .max(50)
    .optional()
    .default([]),
  degustaciones: z
    .array(
      z.object({
        producto: z.string().trim().min(1),
        unidades: z.coerce.number().nonnegative().optional(),
        notas: z.string().trim().max(300).optional().default(''),
      }),
    )
    .max(50)
    .optional()
    .default([]),
})

// Convierte un data URL (data:image/jpeg;base64,...) o base64 puro a Buffer.
function decodificarFoto(dataUrl: string): { buf: Buffer; mime: string } | null {
  const m = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
  const mime = m ? m[1] : 'image/jpeg'
  const base64 = m ? m[2] : dataUrl
  try {
    const buf = Buffer.from(base64, 'base64')
    if (buf.length === 0 || buf.length > 3_000_000) return null // >3MB por foto: descartar
    return { buf, mime }
  } catch {
    return null
  }
}

visitasRouter.post('/', requireRole('mercaderista', 'vendedor'), async (req, res, next) => {
  try {
    const datos = nuevaSchema.parse(req.body)
    const visita = await db.transaction(async (trx) => {
      const [v] = await trx('visitas')
        .insert({
          usuario_id: req.user!.id,
          cliente_id: datos.clienteId ?? null,
          cliente_nombre: datos.clienteNombre,
          lat: datos.lat ?? null,
          lng: datos.lng ?? null,
          gps_precision: datos.gpsPrecision ?? null,
          direccion: datos.direccion || null,
          notas: datos.notas || null,
        })
        .returning('*')

      const fotos = datos.fotos.map(decodificarFoto).filter((x): x is { buf: Buffer; mime: string } => x !== null)
      if (fotos.length) {
        await trx('visita_fotos').insert(fotos.map((f) => ({ visita_id: v.id, imagen: f.buf, mime: f.mime })))
      }
      if (datos.competencia.length) {
        await trx('visita_competencia').insert(
          datos.competencia.map((c) => ({
            visita_id: v.id,
            producto: c.producto,
            competidor: c.competidor || null,
            precio: c.precio ?? null,
            moneda: c.moneda || 'Bs',
            nota: c.nota || null,
          })),
        )
      }
      if (datos.degustaciones.length) {
        await trx('visita_degustaciones').insert(
          datos.degustaciones.map((d) => ({
            visita_id: v.id,
            producto: d.producto,
            unidades: d.unidades ?? null,
            notas: d.notas || null,
          })),
        )
      }
      return v
    })
    res.status(201).json({ visita })
  } catch (err) {
    next(err)
  }
})

// ── Eliminar una visita (el dueño de la visita o el admin) ───────────────────
visitasRouter.delete('/:id(\\d+)', async (req, res, next) => {
  try {
    const visita = await db('visitas').where('id', Number(req.params.id)).first()
    if (!visita) {
      res.status(404).json({ error: 'Visita no encontrada' })
      return
    }
    if (req.user!.rol !== 'admin' && visita.usuario_id !== req.user!.id) {
      res.status(403).json({ error: 'No puedes eliminar esta visita' })
      return
    }
    await db('visitas').where('id', visita.id).del() // cascada borra fotos/competencia/degustaciones
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})
