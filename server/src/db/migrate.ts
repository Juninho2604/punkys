import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { db } from './knex.js'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations')

async function main() {
  const [batch, applied] = await db.migrate.latest({
    directory: dir,
    extension: 'ts',
    loadExtensions: ['.ts', '.js'],
  })
  if (applied.length === 0) console.log('Migraciones al día, nada que aplicar.')
  else console.log(`Batch ${batch}: aplicadas ${applied.length} migraciones:\n- ${applied.join('\n- ')}`)
  await db.destroy()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
