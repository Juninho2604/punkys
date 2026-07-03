import knexFactory from 'knex'
import { config } from '../config.js'

export const db = knexFactory({
  client: 'pg',
  connection: config.databaseUrl,
  pool: { min: 1, max: 10 },
})
