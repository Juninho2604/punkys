# Respaldos automáticos de la base

La intranet guarda TODO en PostgreSQL (pedidos, usuarios, la réplica de Profit,
visitas, costos, notas, etc.). Estos respaldos protegen esa base.

## Qué hace

`scripts/punky-backup.sh` (en el repo, ya desplegado en el VPS):

1. Hace `pg_dump` de la base **comprimido** (`.sql.gz`) hacia `./backups`.
2. Conserva las **últimas 14 copias** (rota las viejas).
3. Registra cada corrida en la tabla `backup_log`, para que la pantalla
   **Sistema** de la intranet muestre "último respaldo hace X horas" y alerte
   si se atrasa (>26 h).

## Programarlo en el VPS (una sola vez)

En el VPS, dentro de la carpeta de la intranet (donde está `docker-compose.yml`):

```bash
# Probar una vez a mano (seguro, solo lee la base):
./scripts/punky-backup.sh

# Programar con cron: todos los días a las 3am
crontab -e
# y agregar esta línea:
0 3 * * * cd /root/punky-intranet && ./scripts/punky-backup.sh >> /var/log/punky-backup.log 2>&1
```

Verifica en la intranet: **Sistema → Respaldos automáticos** debe pasar a
"Al día" tras la primera corrida.

## Variables opcionales

- `BACKUP_DIR` — carpeta destino (default `./backups`)
- `KEEP` — cuántas copias conservar (default `14`)
- `DB_USER` / `DB_NAME` — default `punky` / `punky_intranet`

## Restaurar un respaldo

```bash
gunzip -c backups/punky-punky_intranet-AAAAMMDD-HHMMSS.sql.gz \
  | docker compose exec -T db psql -U punky -d punky_intranet
```

> Recomendación: de vez en cuando copia algún `.sql.gz` fuera del VPS
> (otra máquina o nube) por si el servidor mismo falla.
