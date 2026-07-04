import type { PPProduct, PPPushResult, PPQuotePayload, PPStatus, ProfitPlusConnector } from './types.js'

// Modo activo mientras no tengamos acceso al SQL Server del cliente.
// Sirve un CATÁLOGO DEMO (productos de tienda de mascotas con stock por sede)
// para que el flujo de cotización por productos funcione de punta a punta.
// Al conectar Profit Plus, el inventario real reemplaza esto sin tocar la UI.

const CATALOGO: PPProduct[] = [
  { codigo: 'ALI-001', nombre: 'Alimento perro adulto 20 kg', precio: 1850, stock: { 'Almacén Boleíta': 46, 'Almacén Principal': 120 } },
  { codigo: 'ALI-002', nombre: 'Alimento perro cachorro 8 kg', precio: 920, stock: { 'Almacén Boleíta': 30, 'Almacén Principal': 85 } },
  { codigo: 'ALI-003', nombre: 'Alimento gato adulto 10 kg', precio: 1150, stock: { 'Almacén Boleíta': 22, 'Almacén Principal': 64 } },
  { codigo: 'ALI-004', nombre: 'Alimento gato esterilizado 3 kg', precio: 480, stock: { 'Almacén Boleíta': 0, 'Almacén Principal': 40 } },
  { codigo: 'ARE-001', nombre: 'Arena sanitaria aglomerante 10 kg', precio: 390, stock: { 'Almacén Boleíta': 75, 'Almacén Principal': 200 } },
  { codigo: 'HIG-001', nombre: 'Shampoo antipulgas 500 ml', precio: 145, stock: { 'Almacén Boleíta': 18, 'Almacén Principal': 55 } },
  { codigo: 'HIG-002', nombre: 'Pipeta antiparasitaria perro mediano', precio: 210, stock: { 'Almacén Boleíta': 12, 'Almacén Principal': 0 } },
  { codigo: 'ACC-001', nombre: 'Collar ajustable con placa', precio: 95, stock: { 'Almacén Boleíta': 40, 'Almacén Principal': 90 } },
  { codigo: 'ACC-002', nombre: 'Correa retráctil 5 m', precio: 260, stock: { 'Almacén Boleíta': 15, 'Almacén Principal': 33 } },
  { codigo: 'ACC-003', nombre: 'Transportadora mediana', precio: 780, stock: { 'Almacén Boleíta': 8, 'Almacén Principal': 21 } },
  { codigo: 'JUG-001', nombre: 'Pelota de caucho resistente', precio: 60, stock: { 'Almacén Boleíta': 120, 'Almacén Principal': 300 } },
  { codigo: 'ACU-001', nombre: 'Alimento peces tropicales 200 g', precio: 85, stock: { 'Almacén Boleíta': 25, 'Almacén Principal': 70 } },
]

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

export class SimulatedProfitPlusConnector implements ProfitPlusConnector {
  async pushQuote(quote: PPQuotePayload): Promise<PPPushResult> {
    const externalRef = `PP-SIM-${quote.numero}`
    console.log(
      `🔌 [Profit Plus simulado] Cotización ${quote.numero} "inyectada" (${quote.items.length} renglones) → ref ${externalRef}`,
    )
    return { ok: true, estado: 'simulado', externalRef }
  }

  async searchProducts(query: string): Promise<PPProduct[]> {
    const q = norm(query.trim())
    if (!q) return CATALOGO.slice(0, 10)
    return CATALOGO.filter((p) => norm(p.nombre).includes(q) || norm(p.codigo).includes(q)).slice(0, 10)
  }

  async getProducts(codigos: string[]): Promise<PPProduct[]> {
    return CATALOGO.filter((p) => codigos.includes(p.codigo))
  }

  async status(): Promise<PPStatus> {
    return {
      modo: 'simulado',
      conectado: false,
      detalle:
        'Conector en modo simulado (inventario DEMO). Al recibir credenciales y esquema del SQL Server de Profit Plus 2K12, configurar PROFIT_PLUS_MODE=sqlserver (ver docs/integracion-profit-plus.md).',
    }
  }
}
