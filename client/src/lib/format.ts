// Formato de moneda es-VE: Bs. 1.234,56
export function fmtBs(n: number | string): string {
  const v = typeof n === 'string' ? Number(n) : n
  return 'Bs. ' + v.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })
}

export function fmtFechaHora(iso: string): string {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' }) +
    ' · ' +
    d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
  )
}

export function hoyLargo(): string {
  const s = new Date().toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
