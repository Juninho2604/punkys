// badge-status: colores por estado según el handoff
const COLORES: Record<string, { bg: string; fg: string }> = {
  Aprobado: { bg: 'var(--success-soft)', fg: 'var(--success-600)' },
  Aprobada: { bg: 'var(--success-soft)', fg: 'var(--success-600)' },
  Entregado: { bg: 'var(--success-soft)', fg: 'var(--success-600)' },
  Pendiente: { bg: 'var(--warning-soft)', fg: 'var(--warning-600)' },
  'En reparto': { bg: 'var(--warning-soft)', fg: 'var(--warning-600)' },
  Rechazado: { bg: 'var(--danger-soft)', fg: 'var(--danger-500)' },
  Rechazada: { bg: 'var(--danger-soft)', fg: 'var(--danger-500)' },
  Incidencia: { bg: 'var(--danger-soft)', fg: 'var(--danger-500)' },
  Facturada: { bg: 'var(--info-soft)', fg: 'var(--info-fg)' },
  'En tránsito': { bg: 'var(--info-soft)', fg: 'var(--info-fg)' },
  Preparando: { bg: 'var(--neutral-soft)', fg: 'var(--neutral-fg)' },
}

export function Badge({ estado, lg = false }: { estado: string; lg?: boolean }) {
  const c = COLORES[estado] ?? COLORES.Preparando
  return (
    <span className={`badge${lg ? ' badge-lg' : ''}`} style={{ background: c.bg, color: c.fg }}>
      {estado}
    </span>
  )
}
