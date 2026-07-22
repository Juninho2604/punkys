import { db } from '../../db/knex.js'
import { config } from '../../config.js'

// Conector Google Sheets → VPS (Ola 1 de la migración de la intranet-Sheets).
// SOLO LECTURA: descarga cada catálogo como CSV (URL publicada / export) y
// reemplaza por completo la tabla espejo op_*. Nunca escribe en el Sheet.
// Como Sheets vive en la nube, corre directo en el VPS (sin túnel).

const REFRESH_MS = () => config.sheets.refreshMin * 60_000

// ── Parser CSV mínimo pero correcto (comillas, comas y saltos dentro de comillas)
function parseCsv(texto: string): string[][] {
  const filas: string[][] = []
  let campo = ''
  let fila: string[] = []
  let enComillas = false
  const t = texto.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  for (let i = 0; i < t.length; i++) {
    const c = t[i]
    if (enComillas) {
      if (c === '"') {
        if (t[i + 1] === '"') { campo += '"'; i++ } else enComillas = false
      } else campo += c
    } else if (c === '"') {
      enComillas = true
    } else if (c === ',') {
      fila.push(campo); campo = ''
    } else if (c === '\n') {
      fila.push(campo); filas.push(fila); fila = []; campo = ''
    } else campo += c
  }
  if (campo.length || fila.length) { fila.push(campo); filas.push(fila) }
  return filas
}

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '_')
const bool = (v: unknown) => {
  const s = String(v ?? '').trim().toLowerCase()
  return s === 'true' || s === 'verdadero' || s === 'sí' || s === 'si' || s === '1' || s === 'x'
}
const int = (v: unknown) => {
  const n = parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10)
  return Number.isFinite(n) ? n : 0
}
const txt = (v: unknown) => String(v ?? '').trim()

// Descarga un CSV y devuelve filas como objetos {encabezado_normalizado: valor}
async function traerCsv(url: string): Promise<Record<string, string>[]> {
  const ctrl = new AbortController()
  const to = setTimeout(() => ctrl.abort(), 20_000)
  const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow' })
  clearTimeout(to)
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar el CSV`)
  const filas = parseCsv(await res.text())
  if (filas.length < 2) return []
  const cab = filas[0].map(norm)
  return filas.slice(1)
    .filter((f) => f.some((c) => c.trim() !== '')) // saltar filas vacías
    .map((f) => Object.fromEntries(cab.map((h, i) => [h, f[i] ?? ''])))
}

interface Catalogo {
  clave: 'productos' | 'almacenes' | 'categorias'
  tabla: string
  dataset: string
  mapear: (r: Record<string, string>) => Record<string, unknown> | null
}

const CATALOGOS: Catalogo[] = [
  {
    clave: 'productos',
    tabla: 'op_productos',
    dataset: 'op_productos',
    mapear: (r) => {
      const codigo = txt(r.codigo_producto || r.codigo)
      if (!codigo) return null
      return {
        codigo,
        nombre: txt(r.nombre_producto || r.nombre) || codigo,
        marca: txt(r.marca) || null,
        categoria: txt(r.categoria) || null,
        subcategoria: txt(r.subcategoria) || null,
        activo: bool(r.activo),
        mostrar_inventario: bool(r.mostrar_en_inventario ?? r.mostrar_inventario),
        mostrar_ventas: bool(r.mostrar_en_ventas ?? r.mostrar_ventas),
        mostrar_vendedores: bool(r.mostrar_a_vendedores ?? r.mostrar_vendedores),
        orden: int(r.orden_visual ?? r.orden),
        foco_mes: bool(r.es_foco_mes ?? r.foco_mes),
      }
    },
  },
  {
    clave: 'almacenes',
    tabla: 'op_almacenes',
    dataset: 'op_almacenes',
    mapear: (r) => {
      const codigo = txt(r.codigo_almacen || r.codigo)
      if (!codigo) return null
      return {
        codigo,
        nombre: txt(r.nombre_almacen || r.nombre) || codigo,
        activo: bool(r.activo),
        mostrar_admin: bool(r.mostrar_admin),
        mostrar_vendedor: bool(r.mostrar_vendedor),
        mostrar_inventario: bool(r.mostrar_inventario),
        orden: int(r.orden_visual ?? r.orden),
      }
    },
  },
  {
    clave: 'categorias',
    tabla: 'op_categorias',
    dataset: 'op_categorias',
    mapear: (r) => {
      const categoria = txt(r.categoria)
      if (!categoria) return null
      return {
        categoria,
        subcategoria: txt(r.subcategoria) || null,
        marca: txt(r.marca) || null,
        activo: bool(r.activo),
        mostrar_dashboard: bool(r.mostrar_dashboard),
        orden: int(r.orden_visual ?? r.orden),
      }
    },
  },
]

async function sincronizarCatalogo(cat: Catalogo): Promise<string> {
  const url = config.sheets.urls[cat.clave]
  if (!url) return `${cat.clave}: (sin URL)`
  const crudas = await traerCsv(url)
  const filas: Record<string, unknown>[] = []
  const vistos = new Set<string>()
  for (const r of crudas) {
    const m = cat.mapear(r)
    if (!m) continue
    const k = String(m[cat.clave === 'categorias' ? 'categoria' : 'codigo'])
    if (vistos.has(k)) continue // primer registro gana ante duplicados
    vistos.add(k)
    filas.push({ ...m, updated_at: db.fn.now() })
  }
  await db.transaction(async (trx) => {
    await trx(cat.tabla).del()
    if (filas.length) await trx.batchInsert(cat.tabla, filas, 200)
    await trx('sync_log').insert({ dataset: cat.dataset, fuente: 'Google Sheets', registros: filas.length })
  })
  return `${cat.clave} ${filas.length}`
}

let sincronizando = false

export async function sincronizarSheets(): Promise<{ ok: boolean; detalle: string }> {
  if (sincronizando) return { ok: false, detalle: 'Ya hay una sincronización en curso' }
  if (!config.sheets.habilitado) return { ok: false, detalle: 'Sin URLs de Sheets configuradas (SHEETS_URL_*)' }
  sincronizando = true
  try {
    const partes: string[] = []
    for (const cat of CATALOGOS) {
      try {
        partes.push(await sincronizarCatalogo(cat))
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        partes.push(`${cat.clave} ERROR: ${msg}`)
        console.error(`⚠️ [Sheets] ${cat.clave}:`, msg)
      }
    }
    const detalle = partes.join(' · ')
    console.log(`📄 [Sheets] Catálogos clonados: ${detalle}`)
    return { ok: !detalle.includes('ERROR'), detalle }
  } finally {
    sincronizando = false
  }
}

export function iniciarSincronizacionSheets(): void {
  if (!config.sheets.habilitado) return
  void sincronizarSheets()
  setInterval(() => void sincronizarSheets(), REFRESH_MS())
  console.log(`📄 [Sheets] Clonado automático de catálogos cada ${config.sheets.refreshMin} min`)
}
