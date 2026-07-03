import type { PPPushResult, PPQuotePayload, PPStatus, ProfitPlusConnector } from './types.js'

// Modo activo mientras no tengamos acceso al SQL Server del cliente.
// Registra la operación y devuelve una referencia ficticia, de modo que el
// resto del workflow (aprobaciones, despacho, notificaciones) funciona igual.
export class SimulatedProfitPlusConnector implements ProfitPlusConnector {
  async pushQuote(quote: PPQuotePayload): Promise<PPPushResult> {
    const externalRef = `PP-SIM-${quote.numero}`
    console.log(`🔌 [Profit Plus simulado] Cotización ${quote.numero} "inyectada" → ref ${externalRef}`)
    return { ok: true, estado: 'simulado', externalRef }
  }

  async status(): Promise<PPStatus> {
    return {
      modo: 'simulado',
      conectado: false,
      detalle:
        'Conector en modo simulado. Al recibir credenciales y esquema del SQL Server de Profit Plus 2K12, configurar PROFIT_PLUS_MODE=sqlserver (ver docs/integracion-profit-plus.md).',
    }
  }
}
