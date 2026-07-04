import 'dotenv/config'

function env(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback
  if (v === undefined) throw new Error(`Falta la variable de entorno ${name}`)
  return v
}

export const config = {
  port: Number(env('PORT', '4000')),
  nodeEnv: env('NODE_ENV', 'development'),
  clientOrigin: env('CLIENT_ORIGIN', 'http://localhost:5173'),
  jwtSecret: env('JWT_SECRET', 'dev-secret-no-usar-en-produccion'),
  databaseUrl: env('DATABASE_URL', 'postgres://punky:punky_dev@localhost:5432/punky_intranet'),
  // Cookie de sesión con flag Secure (solo se envía por HTTPS). Debe quedar en
  // 'false' mientras se sirva por IP/HTTP y pasar a 'true' al activar el dominio con TLS.
  cookieSecure: env('COOKIE_SECURE', 'false') === 'true',
  // Clave de acceso del Centro de Operaciones (modo TV, solo lectura).
  // Vacía = modo TV deshabilitado. URL: /tv/<clave>
  tvAccessKey: process.env.TV_ACCESS_KEY ?? '',

  email: {
    provider: env('EMAIL_PROVIDER', 'console') as 'console' | 'smtp',
    from: env('EMAIL_FROM', 'Punky Partners <notificaciones@punkypartners.com>'),
    smtp: {
      host: process.env.SMTP_HOST ?? '',
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER ?? '',
      pass: process.env.SMTP_PASS ?? '',
    },
  },

  whatsapp: {
    provider: env('WHATSAPP_PROVIDER', 'console') as 'console' | 'twilio' | 'cloudapi',
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
      authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
      from: process.env.TWILIO_WHATSAPP_FROM ?? '',
    },
    cloudApi: {
      phoneNumberId: process.env.WA_CLOUD_PHONE_NUMBER_ID ?? '',
      accessToken: process.env.WA_CLOUD_ACCESS_TOKEN ?? '',
    },
  },

  profitPlus: {
    mode: env('PROFIT_PLUS_MODE', 'simulado') as 'simulado' | 'sqlserver',
    db: {
      host: process.env.PP_DB_HOST ?? '',
      port: Number(process.env.PP_DB_PORT ?? 1433),
      name: process.env.PP_DB_NAME ?? '',
      user: process.env.PP_DB_USER ?? '',
      password: process.env.PP_DB_PASSWORD ?? '',
    },
  },
}
