import { createApp } from './app.js'
import { config } from './config.js'
import { iniciarRefrescoReplica } from './integrations/profitplus/replica.js'

const app = createApp()

app.listen(config.port, () => {
  console.log(`🐾 Punky Intranet API escuchando en http://localhost:${config.port}`)
  console.log(`   Email: ${config.email.provider} · WhatsApp: ${config.whatsapp.provider} · Profit Plus: ${config.profitPlus.mode}`)
  // Modo réplica: materializa profit.* → pp_* al arrancar y cada 5 minutos
  if (config.profitPlus.mode === 'replica') iniciarRefrescoReplica()
})
