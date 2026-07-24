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

const Tog = ({ v, onClick }: { v: boolean; onClick: () => void }) => (
  <button onClick={onClick} className="badge" style={{ cursor: 'pointer', border: 'none', background: v ? 'var(--success-soft)' : 'var(--line-soft)', color: v ? 'var(--success-600)' : 'var(--ink-300)' }}>
    {v ? 'Sí' : 'No'}
  </button>
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

  // Editar una bandera del catálogo (nuestra copia manda; actualiza en el acto).
  async function toggle(entidad: 'productos' | 'almacenes' | 'categorias', claveField: 'codigo' | 'categoria', claveVal: string, campo: string, actual: boolean) {
    setOcupado(true)
    try {
      await api.patch(`/operacional/${entidad}/${encodeURIComponent(claveVal)}`, { [campo]: !actual })
      setData((d) => (d ? ({ ...d, [entidad]: (d[entidad] as unknown as Record<string, unknown>[]).map((r) => (r[claveField] === claveVal ? { ...r, [campo]: !actual } : r)) } as Data) : d))
    } catch (err) {
      toast(err instanceof Error ? err.message : 'No se pudo actualizar')
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
            Configuración del cliente traída de su Sheet, <b>editable desde aquí</b> (nuestra copia manda). Toca los <b>Sí/No</b> para activar/desactivar visibilidad y foco.
          </p>
        </div>
        <button className="btn btn-secondary" disabled={ocupado} onClick={cargar}>Actualizar</button>
      </div>

      {vacio ? (
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div className="cell-sub">
            Aún no hay catálogos. Se cargan solos al desplegar (snapshot del cliente) o con “Recargar snapshot” en <b>Operación (espejo)</b>.
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
                    <span><Tog v={p.mostrar_vendedores} onClick={() => toggle('productos', 'codigo', p.codigo, 'mostrar_vendedores', p.mostrar_vendedores)} /></span>
                    <span><Tog v={p.foco_mes} onClick={() => toggle('productos', 'codigo', p.codigo, 'foco_mes', p.foco_mes)} /></span>
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
                    <span><Tog v={a.activo} onClick={() => toggle('almacenes', 'codigo', a.codigo, 'activo', a.activo)} /></span>
                    <span><Tog v={a.mostrar_admin} onClick={() => toggle('almacenes', 'codigo', a.codigo, 'mostrar_admin', a.mostrar_admin)} /></span>
                    <span><Tog v={a.mostrar_vendedor} onClick={() => toggle('almacenes', 'codigo', a.codigo, 'mostrar_vendedor', a.mostrar_vendedor)} /></span>
                    <span><Tog v={a.mostrar_inventario} onClick={() => toggle('almacenes', 'codigo', a.codigo, 'mostrar_inventario', a.mostrar_inventario)} /></span>
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
                    <span><Tog v={c.activo} onClick={() => toggle('categorias', 'categoria', c.categoria, 'activo', c.activo)} /></span>
                    <span><Tog v={c.mostrar_dashboard} onClick={() => toggle('categorias', 'categoria', c.categoria, 'mostrar_dashboard', c.mostrar_dashboard)} /></span>
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
