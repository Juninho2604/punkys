# Punky Intranet · Logística Corporativa 🐾

Intranet B2B para **Punky Partners** (tienda de productos para mascotas, Venezuela) que centraliza el proceso operacional que antes vivía en un Excel: el vendedor cotiza, Cuentas por Cobrar aprueba o rechaza, y Despacho gestiona el envío hasta la entrega — con emails y mensajes de WhatsApp automáticos en cada paso, e integración prevista con **Profit Plus 2K12**.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite (`client/`) |
| Backend | Node.js + Express + TypeScript (`server/`) |
| Base de datos | PostgreSQL (Knex para migraciones y queries) |
| Notificaciones | Email (SMTP/simulado) + WhatsApp (Twilio/Cloud API/simulado) |
| ERP | Conector Profit Plus 2K12 (simulado hasta tener acceso al SQL Server) |

## Puesta en marcha

Requisitos: Node 20+, PostgreSQL 14+.

```bash
# 1. Dependencias
npm install

# 2. Base de datos (ejemplo local)
sudo -u postgres psql -c "CREATE USER punky WITH PASSWORD 'punky_dev';"
sudo -u postgres psql -c "CREATE DATABASE punky_intranet OWNER punky;"

# 3. Configuración
cp .env.example server/.env   # ajustar DATABASE_URL si hace falta

# 4. Esquema + datos de demo
npm run migrate
npm run seed

# 5. Desarrollo (API en :4000, frontend en :5173)
npm run dev
```

### Usuarios de demo (contraseña: `punky123`)

| Email | Rol | Ve / puede |
|---|---|---|
| `admin@punkypartners.com` | Owner (admin) | Todo + Sistema de Diseño |
| `ventas@punkypartners.com` | Vendedor | Dashboard, Cotización, Despacho (lectura) |
| `cxc@punkypartners.com` | Cuentas por Cobrar | Dashboard, Aprobaciones |
| `despacho@punkypartners.com` | Despacho | Dashboard, Despacho (gestión) |

## Flujo operacional

```
Vendedor                CxC                    Despacho               Cliente
────────                ───                    ────────               ───────
Wizard 4 pasos   →   Kanban aprueba    →   Envío creado auto     📧 + 💬 aprobada
(genera COT-XXXX)    o rechaza             (ENV-XXXX, timeline)
     │                    │                      │
     └ 📧 aviso a CxC     └ 📧 resultado al      └ avanza etapas → 💬 en tránsito /
       + inyección          vendedor               en reparto / entregado /
       en Profit Plus                              incidencia
```

- Los **precios** se calculan en el servidor (flete base + Bs./kg + seguro 2% + IVA 16%) según el servicio: Terrestre Estándar, Express 24h, Cadena de Frío o Manejo Especial.
- Toda notificación enviada queda registrada en la tabla `notification_log` (consultable en `GET /api/system/notificaciones`).
- La numeración `COT-XXXX` / `ENV-XXXX` es correlativa y atómica.

## Estructura

```
├── client/               # React + Vite (pantallas según el handoff de diseño)
│   └── src/
│       ├── components/   #   Shell (sidebar+header), Badge, MascotaFrenchie…
│       ├── pages/        #   Login, Dashboard, Cotización, Aprobaciones, Despacho, Sistema de Diseño
│       └── lib/          #   api, auth, toast, formato es-VE
├── server/
│   └── src/
│       ├── routes/       # auth, quotes, shipments, dashboard, system
│       ├── services/     # pricing (motor de precios), workflow (cotización→aprobación→envío)
│       ├── notifications/# email + whatsapp con proveedores intercambiables
│       ├── integrations/profitplus/  # conector desacoplado (simulado | sqlserver)
│       └── db/           # migraciones, seed
└── docs/                 # integración Profit Plus, notificaciones
```

## Configuración por entorno (`server/.env`)

Ver `.env.example` para la lista completa. Los tres interruptores importantes:

- `EMAIL_PROVIDER=console|smtp` — en `console` los correos se imprimen en el log del servidor.
- `WHATSAPP_PROVIDER=console|twilio|cloudapi` — Twilio es el proveedor actual; la migración a WhatsApp Business Cloud API es cambiar esta variable (ver `docs/notificaciones.md`).
- `PROFIT_PLUS_MODE=simulado|sqlserver` — simulado hasta tener acceso a la BD del cliente (ver `docs/integracion-profit-plus.md`).

## Diseño

La UI recrea en React el handoff `Diseño Intranet Logística Corporativa` (tokens, tipografías Baloo 2 + Nunito Sans, componentes y las 7 pantallas, incluida la mascota frenchie del login que se tapa los ojos al escribir la contraseña). La página **Sistema de Diseño** (visible para el Owner) sirve de QA visual de los tokens.
