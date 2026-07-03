import { config } from '../../config.js'
import type { ProfitPlusConnector } from './types.js'
import { SimulatedProfitPlusConnector } from './simulated.js'
import { SqlServerProfitPlusConnector } from './sqlserver.js'

function build(): ProfitPlusConnector {
  switch (config.profitPlus.mode) {
    case 'sqlserver':
      return new SqlServerProfitPlusConnector()
    default:
      return new SimulatedProfitPlusConnector()
  }
}

export const profitPlus: ProfitPlusConnector = build()
