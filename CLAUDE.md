# Punky Intranet

Intranet logística para Punky Partners (tienda de mascotas, Venezuela):
cotización → aprobación (CxC) → despacho, con notificaciones automáticas
(email/WhatsApp), modo TV para la oficina e integración futura con Profit Plus 2K12.

**Lee `docs/CONTEXTO.md` antes de trabajar**: contiene el estado del proyecto,
las decisiones tomadas y su porqué, la infraestructura de producción, los
pendientes y las convenciones del código.

Reglas rápidas:
- Producción corre en un VPS (IP y detalles en el contexto) desde la rama
  `claude/pet-store-intranet-dd9wqs`; el usuario despliega con `punky-deploy`.
- El servidor SIEMPRE recalcula precios; el cliente solo previsualiza.
- `seed.ts` borra TODO (solo dev). Para limpiar datos reales existe `clean.ts`,
  que conserva usuarios.
- Server ESM: imports internos con extensión `.js`.
- Textos de UI, commits y docs en español.
