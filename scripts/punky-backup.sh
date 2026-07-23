#!/usr/bin/env bash
# Respaldo automático de la base de Punky Intranet.
# Hace pg_dump comprimido, conserva las últimas N copias y registra la corrida
# en la tabla backup_log para que la intranet muestre el estado.
#
# Uso (desde la carpeta de la intranet, donde está docker-compose.yml):
#   ./scripts/punky-backup.sh
#
# Programar con cron (todos los días a las 3am):
#   0 3 * * * cd /root/punky-intranet && ./scripts/punky-backup.sh >> /var/log/punky-backup.log 2>&1
#
# Variables opcionales:
#   BACKUP_DIR   carpeta destino (default: ./backups)
#   KEEP         cuántas copias conservar (default: 14)
#   DB_USER      usuario de Postgres (default: punky)
#   DB_NAME      base (default: punky_intranet)

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
KEEP="${KEEP:-14}"
DB_USER="${DB_USER:-punky}"
DB_NAME="${DB_NAME:-punky_intranet}"

STAMP="$(date +%Y%m%d-%H%M%S)"
FILE="punky-${DB_NAME}-${STAMP}.sql.gz"
mkdir -p "$BACKUP_DIR"

echo "[$(date)] Respaldando ${DB_NAME} → ${BACKUP_DIR}/${FILE}"

# pg_dump corre DENTRO del contenedor de la base; el .gz se escribe en el host.
if docker compose exec -T db pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "${BACKUP_DIR}/${FILE}"; then
  SIZE="$(stat -c%s "${BACKUP_DIR}/${FILE}" 2>/dev/null || echo 0)"
  echo "[$(date)] OK · ${SIZE} bytes"
  OK=true
  DETALLE=""
else
  SIZE=0
  OK=false
  DETALLE="pg_dump falló"
  echo "[$(date)] ERROR: pg_dump falló"
fi

# Rotación: conservar solo las últimas KEEP copias.
ls -1t "${BACKUP_DIR}"/punky-*.sql.gz 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f

# Registrar la corrida en la base (no rompe el respaldo si esto falla).
docker compose exec -T db psql -U "$DB_USER" -d "$DB_NAME" -c \
  "INSERT INTO backup_log (archivo, tamano_bytes, ok, detalle) VALUES ('${FILE}', ${SIZE}, ${OK}, NULLIF('${DETALLE}',''));" \
  >/dev/null 2>&1 || echo "[$(date)] aviso: no se pudo registrar en backup_log"

[ "$OK" = "true" ] || exit 1
echo "[$(date)] Respaldo completado."
