import { config } from '../../config.js'
import type { ProfitPlusConnector } from './types.js'
import { SimulatedProfitPlusConnector } from './simulated.js'
import { SqlServerProfitPlusConnector } from './sqlserver.js'
import { PipelineProfitPlusConnector } from './pipeline.js'
import { ReplicaProfitPlusConnector } from './replica.js'

function build(): ProfitPlusConnector {
  switch (config.profitPlus.mode) {
    case 'sqlserver':
      return new SqlServerProfitPlusConnector()
    case 'pipeline':
      return new PipelineProfitPlusConnector()
    case 'replica':
      return new ReplicaProfitPlusConnector()
    default:
      return new SimulatedProfitPlusConnector()
  }
}

export const profitPlus: ProfitPlusConnector = build()
