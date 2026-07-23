import { createApp } from './app.js'
import { config } from './config.js'
import { iniciarRefrescoReplica } from './integrations/profitplus/replica.js'
import { iniciarRefrescoTasa } from './services/tasaCambio.js'
import { iniciarSincronizacionSheets } from './integrations/sheets/index.js'
import { iniciarCxcDiario } from './services/cxcDiario.js'
import { iniciarReportesIA } from './services/reportesIA.js'

const app = createApp()

app.listen(config.port, () => {
  console.log(`🐾 Punky Intranet API escuchando en http://localhost:${config.port}`)
  console.log(`   Email: ${config.email.provider} · WhatsApp: ${config.whatsapp.provider} · Profit Plus: ${config.profitPlus.mode}`)
  // Modo réplica: materializa profit.* → pp_* al arrancar y cada 5 minutos
  if (config.profitPlus.mode === 'replica') iniciarRefrescoReplica()
  // Tasa BCV para el equivalente USD de los montos en Bs
  iniciarRefrescoTasa()
  // Espejo de los catálogos de la intranet-Sheets del cliente (si hay URLs)
  iniciarSincronizacionSheets()
  // Correo diario de CxC por vendedor (7am hora del servidor)
  iniciarCxcDiario()
  // Reporte ejecutivo con IA (diario; requiere ANTHROPIC_API_KEY para redactar)
  iniciarReportesIA()
})
