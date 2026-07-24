// Snapshot (solo lectura) de la operación del cliente tomado de sus Sheets.
// Se genera leyendo "Pedidos Punky" + "Punky - Configuración". Re-generarlo y
// recargarlo trae el delta (el cargador es idempotente). NO se escribe a sus
// Sheets nunca. Este archivo se rellena con la data real; el cargador vive en
// integrations/sheets/importarSnapshot.ts.

export interface OpPedido {
  numero: string
  fecha_pedido?: string | null
  fecha_despacho?: string | null
  cliente?: string | null
  cod_cliente?: string | null
  rif?: string | null
  vendedor?: string | null
  observaciones?: string | null
  cond_pago?: string | null
  productos?: string | null
  monto_usd?: number | null
  almacen?: string | null
  lista_precios?: string | null
  estado?: string | null
  nro_nota?: string | null
  nro_factura?: string | null
  fecha_recibido?: string | null
  fecha_cxc?: string | null
  fecha_aprobado_cxc?: string | null
  fecha_logistica?: string | null
  fecha_entregado?: string | null
  fecha_en_ruta?: string | null
  origen?: string | null
  renglones?: { cantidad: number | null; descripcion: string }[]
}

export interface SnapshotOperacion {
  generado: string
  pedidos: OpPedido[]
  estados: Record<string, unknown>[]
  logistica: Record<string, unknown>[]
  fletes: Record<string, unknown>[]
  contactos: Record<string, unknown>[]
  notif_grupos: Record<string, unknown>[]
  notif_tipos: Record<string, unknown>[]
}

export const snapshotOperacion: SnapshotOperacion = {
  generado: '',
  pedidos: [],
  estados: [],
  logistica: [],
  fletes: [],
  contactos: [],
  notif_grupos: [],
  notif_tipos: [],
}
