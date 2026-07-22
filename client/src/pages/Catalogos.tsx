import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useToast } from '../lib/toast'

interface Producto {
  codigo: string; nombre: string; marca: string | null; categoria: string | null
  activo: boolean; mostrar_vendedores: boolean; foco_mes: boolean; orden: number
}
interface Almacen {
  codigo: string; nombre: string; activo: boolean
  mostrar_admin: boolean; mostrar_vendedor: boolean; mostrar_inventario: boolean; orden: number
}
interface Categoria {
  categoria: string; marca: string | null; activo: boolean; mostrar_dashboard: boolean; orden: number
}
interface Data {
  productos: Producto[]; almacenes: Almacen[]; categorias: Categoria[]; actualizado: string | null
}

const Si = ({ v }: { v: boolean }) => (
  <span className="badge" style={{ background: v ? 'var(--success-soft)' : 'var(--line-soft)', color: v ? 'var(--success-600)' : 'var(--ink-300)' }}>
    {v ? 'Sí' : 'No'}
  </span>
)

export function Catalogos() {
  const toast = useToast()
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'productos' | 'almacenes' | 'categorias'>('productos')
  const [ocupado, setOcupado] = useState(false)

  const cargar = useCallback(() => {
    api.get<Data>('/operacional/catalogos').then(setData).catch((e) => setError(e instanceof Error ? e.message : 'Error'))
  }, [])
  useEffect(cargar, [cargar])

  if (error) return <div className="fade-up"><p className="subtitle">{error}</p></div>
  if (!data) return null

  const vacio = data.productos.length + data.almacenes.length + data.categorias.length === 0

  const refrescar = async () => {
    setOcupado(true)
    try {
      const r = await api.post<{ ok: boolean; detalle: string }>('/sync/sheets/refresh')
      toast(r.ok ? `Clonado ✓ (${r.detalle})` : `Aviso: ${r.detalle}`)
      cargar()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo refrescar')
    } finally {
      setOcupado(false)
    }
  }

  const tabs = [
    { k: 'productos' as const, label: `Productos (${data.productos.length})` },
    { k: 'almacenes' as const, label: `Almacenes (${data.almacenes.length})` },
    { k: 'categorias' as const, label: `Categorías (${data.categorias.length})` },
  ]

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="h1-module">Catálogos operacionales</h1>
          <p className="subtitle">
            Espejo de solo lectura desde el Sheet del cliente ("Punky - Configuración").{' '}
            {data.actualizado ? `Clonado ${new Date(data.actualizado).toLocaleString('es-VE')}.` : 'Sin clonar aún — configurar las URLs de Sheets (ver docs).'}
          </p>
        </div>
        <button className="btn btn-secondary" disabled={ocupado} onClick={refrescar}>{ocupado ? 'Clonando…' : 'Refrescar ahora'}</button>
      </div>

      {vacio ? (
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div className="cell-sub">
            Aún no hay catálogos clonados. Se cargan del Google Sheet vía las URLs <code>SHEETS_URL_*</code> del <code>.env</code> (ver <code>docs/migracion-sheets.md</code>).
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tabs.map((t) => (
              <button key={t.k} className={`btn ${tab === t.k ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => setTab(t.k)}>{t.label}</button>
            ))}
          </div>

          {tab === 'productos' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header"><div className="h3-card">Productos</div><span className="caption">visibilidad y foco del mes</span></div>
              <div className="table-scroll"><div className="table-min-760">
                <div className="table-head" style={{ gridTemplateColumns: '0.8fr 2fr 1fr 1fr 0.7fr 0.7fr' }}>
                  <span>Código</span><span>Nombre</span><span>Marca</span><span>Categoría</span><span>Vend.</span><span>Foco</span>
                </div>
                {data.productos.map((p) => (
                  <div key={p.codigo} className="table-row" style={{ gridTemplateColumns: '0.8fr 2fr 1fr 1fr 0.7fr 0.7fr', cursor: 'default', opacity: p.activo ? 1 : 0.5 }}>
                    <span className="cell-sub">{p.codigo}</span>
                    <span className="cell-main">{p.nombre}</span>
                    <span className="cell-sub">{p.marca ?? '—'}</span>
                    <span className="cell-sub">{p.categoria ?? '—'}</span>
                    <span><Si v={p.mostrar_vendedores} /></span>
                    <span>{p.foco_mes ? <span className="badge" style={{ background: 'var(--warning-soft)', color: 'var(--warning-600)' }}>★</span> : '—'}</span>
                  </div>
                ))}
              </div></div>
            </div>
          )}

          {tab === 'almacenes' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header"><div className="h3-card">Almacenes</div><span className="caption">visibilidad por rol</span></div>
              <div className="table-scroll"><div className="table-min-760">
                <div className="table-head" style={{ gridTemplateColumns: '0.7fr 2fr 0.7fr 0.7fr 0.7fr 0.7fr' }}>
                  <span>Código</span><span>Nombre</span><span>Activo</span><span>Admin</span><span>Vend.</span><span>Invent.</span>
                </div>
                {data.almacenes.map((a) => (
                  <div key={a.codigo} className="table-row" style={{ gridTemplateColumns: '0.7fr 2fr 0.7fr 0.7fr 0.7fr 0.7fr', cursor: 'default' }}>
                    <span className="cell-sub">{a.codigo}</span>
                    <span className="cell-main">{a.nombre}</span>
                    <span><Si v={a.activo} /></span>
                    <span><Si v={a.mostrar_admin} /></span>
                    <span><Si v={a.mostrar_vendedor} /></span>
                    <span><Si v={a.mostrar_inventario} /></span>
                  </div>
                ))}
              </div></div>
            </div>
          )}

          {tab === 'categorias' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header"><div className="h3-card">Categorías</div></div>
              <div className="table-scroll"><div className="table-min-760">
                <div className="table-head" style={{ gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr' }}>
                  <span>Categoría</span><span>Marca</span><span>Activa</span><span>Dashboard</span>
                </div>
                {data.categorias.map((c) => (
                  <div key={c.categoria} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr', cursor: 'default' }}>
                    <span className="cell-main" style={{ textTransform: 'capitalize' }}>{c.categoria}</span>
                    <span className="cell-sub">{c.marca ?? '—'}</span>
                    <span><Si v={c.activo} /></span>
                    <span><Si v={c.mostrar_dashboard} /></span>
                  </div>
                ))}
              </div></div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
