#!/bin/sh
# Arranque del contenedor de la API:
#  1. aplica migraciones pendientes (Knex las trackea, es idempotente)
#  2. lanza el servidor
set -e

echo "▶ Aplicando migraciones…"
node dist/db/migrate.js

echo "▶ Iniciando API…"
exec node dist/index.js
