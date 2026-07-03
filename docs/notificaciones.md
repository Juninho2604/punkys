# Notificaciones automáticas (email + WhatsApp)

Toda la mensajería sale por la fachada `notifier` (`server/src/notifications/index.ts`),
que enruta al proveedor configurado y **registra cada envío** en la tabla `notification_log`
(canal, proveedor, destinatario, evento, ref, estado, error). Bitácora: `GET /api/system/notificaciones` (admin).

## Eventos automáticos del workflow

| Evento | Disparador | Canal → destinatario |
|---|---|---|
| `cotizacion_pendiente` | Vendedor envía a aprobación | 📧 → equipo CxC |
| `cotizacion_aprobada` | CxC aprueba | 📧 → cliente (si hay email) · 💬 → WhatsApp del cliente · 📧 → vendedor |
| `cotizacion_rechazada` | CxC rechaza | 📧 → vendedor (con motivo) |
| `despacho_nuevo` | Se crea el envío al aprobar | 📧 → equipo Despacho |
| `envio_estado` | El envío cambia de estado (En tránsito / En reparto / Entregado / Incidencia) | 💬 → cliente · 📧 → cliente (si hay email) |

Los copys viven en un solo archivo: `server/src/notifications/templates.ts`.

Los teléfonos venezolanos se normalizan a E.164 automáticamente
(`0412-555.01.22` → `+584125550122`).

## Email

- `EMAIL_PROVIDER=console` (default): imprime el correo en el log del servidor. Para desarrollo.
- `EMAIL_PROVIDER=smtp`: envío real vía nodemailer. Variables: `SMTP_HOST`, `SMTP_PORT`,
  `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`.

## WhatsApp

Proveedor intercambiable con `WHATSAPP_PROVIDER`:

### `console` (default)
Imprime el mensaje en el log. Para desarrollo.

### `twilio` (proveedor actual)
API REST de Twilio, sin SDK (`server/src/notifications/whatsapp/twilio.ts`).

```
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886   # sandbox o número aprobado
```

Notas Twilio:
- Para pruebas, el **sandbox** de Twilio exige que cada destinatario mande primero
  `join <código>` al número sandbox.
- En producción se necesita un número WhatsApp aprobado en Twilio y plantillas
  registradas para mensajes fuera de la ventana de 24h.

### `cloudapi` (migración futura a WhatsApp Business Cloud API de Meta)
Ya implementado en `whatsapp/cloudapi.ts`. Migrar = cambiar variables, cero código:

```
WHATSAPP_PROVIDER=cloudapi
WA_CLOUD_PHONE_NUMBER_ID=...
WA_CLOUD_ACCESS_TOKEN=...
```

⚠️ Antes de salir a producción con Cloud API: fuera de la ventana de servicio de 24h,
Meta solo permite **plantillas aprobadas** (`type: "template"`). Habrá que registrar como
plantillas los mensajes de `templates.ts` (aprobación de cotización y estados de envío)
y ajustar `cloudapi.ts` para usarlas. Está anotado en el propio archivo.

## Diseño a prueba de fallos

Un error de un proveedor **nunca tumba el workflow**: la operación de negocio se completa
y el fallo queda en `notification_log` con `estado='error'` y el detalle, para reintento o
auditoría manual.
