import { config } from '../../config.js'
import type { PPProduct, PPPushResult, PPQuotePayload, PPStatus, ProfitPlusConnector } from './types.js'

// ⚠️ ESQUELETO — EN ESPERA DE ACCESO AL SQL SERVER DEL CLIENTE.
//
// Cuando el cliente entregue el .md con credenciales, esquema de tablas y
// procedimiento de inyección de cotizaciones de Profit Plus 2K12:
//   1. npm i mssql -w server
//   2. Implementar pushQuote() con la escritura real (tablas de documentos de
//      venta / cotizaciones de Profit Plus, según el esquema entregado).
//   3. PROFIT_PLUS_MODE=sqlserver en el .env + variables PP_DB_*.
//
// Requisitos pendientes documentados en docs/integracion-profit-plus.md.
export class SqlServerProfitPlusConnector implements ProfitPlusConnector {
  constructor() {
    const { host, name, user } = config.profitPlus.db
    if (!host || !name || !user) {
      throw new Error(
        'PROFIT_PLUS_MODE=sqlserver requiere PP_DB_HOST, PP_DB_NAME y PP_DB_USER. ' +
          'Si aún no hay acceso al servidor del cliente, usar PROFIT_PLUS_MODE=simulado.',
      )
    }
  }

  async pushQuote(_quote: PPQuotePayload): Promise<PPPushResult> {
    return {
      ok: false,
      estado: 'error',
      error:
        'Conector SQL Server aún no implementado: falta el esquema de tablas y el acceso a la BD de Profit Plus 2K12 (ver docs/integracion-profit-plus.md).',
    }
  }

  // Al implementar: leer artículos/existencias por almacén de las tablas de
  // inventario de Profit Plus (según el esquema que entregue el cliente).
  async searchProducts(_query: string): Promise<PPProduct[]> {
    throw new Error('Inventario SQL Server pendiente del esquema del cliente')
  }

  async getProducts(_codigos: string[]): Promise<PPProduct[]> {
    throw new Error('Inventario SQL Server pendiente del esquema del cliente')
  }

  async status(): Promise<PPStatus> {
    return {
      modo: 'sqlserver',
      conectado: false,
      detalle: 'Configurado para SQL Server pero la implementación está pendiente del esquema/acceso del cliente.',
    }
  }
}
