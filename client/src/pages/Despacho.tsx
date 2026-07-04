import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Badge } from '../components/Badge'
import type { Shipment } from '../lib/types'

export function Despacho() {
  const navigate = useNavigate()
  const [shipments, setShipments] = useState<Shipment[]>([])

  useEffect(() => {
    api.get<{ shipments: Shipment[] }>('/shipments').then((r) => setShipments(r.shipments)).catch(console.error)
  }, [])

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 18 }}>
        <h1 className="h1-module">Despachos</h1>
        <p className="subtitle">Selecciona un envío para ver su seguimiento.</p>
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-scroll">
          <div className="table-min-760">
            <div className="table-head cols-despacho">
              <span>Envío</span><span>Cliente</span><span>Ruta</span><span>Transportista</span><span>Estado</span><span>ETA</span>
            </div>
            {shipments.map((s) => (
              <div key={s.id} className="table-row cols-despacho" style={{ padding: '14px 20px' }} onClick={() => navigate(`/despacho/${s.id}`)}>
                <span className="cell-id">{s.numero}</span>
                <span className="cell-main">{s.cliente}</span>
                <span className="cell-sub">{s.origen.split('—')[0].trim()} → {s.destino_ciudad}</span>
                <span className="cell-sub">{s.transportista}</span>
                <span><Badge estado={s.estado} /></span>
                <span className="cell-strong">{s.eta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
