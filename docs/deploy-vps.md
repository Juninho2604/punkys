# Despliegue en VPS (Contabo · Ubuntu) con Docker Compose

Guía paso a paso para dejar la intranet corriendo en tu VPS Contabo, primero por
**IP en HTTP** y después con **dominio + HTTPS**. El deploy continuo lo hace
**GitHub Actions** al hacer push a `main`.

Arquitectura en el VPS (todo en Docker Compose):

```
Internet ──▶ :8080 ─ web (Nginx)  ──/──▶ frontend estático (React build)
   (WEB_PORT)          └── /api ──▶ server (Express :4000) ──▶ db (PostgreSQL)
```

> Reemplaza `TU_IP` por la IP pública de tu Contabo en todos los comandos.

---

## 1. Primer acceso y hardening básico

Entra como root (Contabo te da la IP y la contraseña root por email):

```bash
ssh root@TU_IP
```

Crea un usuario de deploy (no trabajes como root) y dale sudo:

```bash
adduser deploy
usermod -aG sudo deploy
```

Copia tu llave SSH pública a ese usuario (desde **tu máquina local**, en otra terminal):

```bash
ssh-copy-id deploy@TU_IP           # si ya tienes ~/.ssh/id_ed25519.pub
# ¿No tienes llave? Créala antes con:  ssh-keygen -t ed25519
```

Vuelve a entrar como `deploy` y configura el firewall:

```bash
ssh deploy@TU_IP
sudo apt update && sudo apt upgrade -y
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Endurece SSH (deshabilita login de root y por contraseña — **asegúrate primero de que
entras con llave como `deploy`**):

```bash
sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

(Opcional pero recomendado) fail2ban contra fuerza bruta:

```bash
sudo apt install -y fail2ban
```

---

## 2. Instalar Docker + Docker Compose

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker deploy
# Cierra sesión y vuelve a entrar para que el grupo docker tome efecto:
exit
ssh deploy@TU_IP
docker --version && docker compose version
```

---

## 3. Dar al VPS acceso de lectura al repo (deploy key)

Como el repo es privado, el VPS necesita una **deploy key** (llave SSH de solo lectura).

En el **VPS**:

```bash
ssh-keygen -t ed25519 -C "vps-punky-deploy" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Copia esa clave pública y agrégala en GitHub:
**Repo → Settings → Deploy keys → Add deploy key** (nombre: `vps-contabo`, sin permiso de escritura).

Prueba el acceso:

```bash
ssh -T git@github.com   # debe saludarte con tu usuario; acepta el fingerprint
```

---

## 4. Primer despliegue (manual, una sola vez)

Clona el repo y crea el `.env` de producción:

```bash
git clone git@github.com:Juninho2604/punkys.git ~/punky-intranet
cd ~/punky-intranet
git checkout main            # o la rama que estés desplegando
cp .env.production.example .env
```

Edita `.env` con valores reales:

```bash
nano .env
```

Como mínimo:

```env
POSTGRES_PASSWORD=<genera: openssl rand -base64 24>
JWT_SECRET=<genera: openssl rand -base64 48>
CLIENT_ORIGIN=http://TU_IP
COOKIE_SECURE=false
```

> `openssl rand -base64 24` te imprime un secreto listo para pegar.

Levanta el stack:

```bash
docker compose up -d --build
docker compose ps            # los 3 servicios deben estar "running"/"healthy"
```

Carga los datos iniciales (usuarios + demo) **una sola vez**:

```bash
docker compose exec server node dist/db/seed.js
```

> ⚠️ `seed` **borra y repuebla** la base. Córrelo solo la primera vez. Las
> migraciones (que crean/actualizan tablas sin borrar datos) se aplican solas en
> cada arranque del contenedor `server`.

Abre en el navegador: **http://TU_IP** → deberías ver el login. Entra con
`admin@punkypartners.com` / `punky123` y **cambia estas credenciales de demo**
antes de usarlo en serio.

---

## 5. Deploy automático con GitHub Actions

El workflow `.github/workflows/deploy.yml` ya está en el repo: al hacer push a
`main` entra por SSH al VPS y hace `git pull` + `docker compose up -d --build`.

Necesita que GitHub pueda entrar al VPS. Genera una llave para eso:

En **tu máquina local**:

```bash
ssh-keygen -t ed25519 -C "github-actions-punky" -f ./gh_deploy -N ""
ssh-copy-id -i ./gh_deploy.pub deploy@TU_IP   # autoriza la pública en el VPS
cat ./gh_deploy                                # esta es la PRIVADA, para el secret
```

En GitHub: **Repo → Settings → Secrets and variables → Actions → New repository secret**, crea:

| Secret | Valor |
|---|---|
| `VPS_HOST` | `TU_IP` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | contenido completo de `./gh_deploy` (la privada) |
| `VPS_APP_DIR` | `/home/deploy/punky-intranet` *(opcional)* |

Borra la llave privada local (`rm ./gh_deploy*`) una vez guardada en el secret.

A partir de ahí, cada push a `main` despliega solo. También puedes lanzarlo a mano
en la pestaña **Actions → Deploy a VPS → Run workflow**.

---

## 6. Operación del día a día

```bash
cd ~/punky-intranet

# Ver logs
docker compose logs -f server      # API (incluye emails/WhatsApp simulados)
docker compose logs -f web         # Nginx
docker compose logs -f db          # PostgreSQL

# Reiniciar / detener / actualizar a mano
docker compose restart server
docker compose down                # detiene (los datos persisten en el volumen)
git pull && docker compose up -d --build

# Estado
docker compose ps
```

### Backups de la base de datos

```bash
# Copia de seguridad
docker compose exec -T db pg_dump -U punky punky_intranet > backup_$(date +%F).sql

# Restaurar
cat backup_2026-01-15.sql | docker compose exec -T db psql -U punky punky_intranet
```

> Recomendado: automatiza el `pg_dump` con un cron diario y súbelo fuera del VPS.

---

## 7. Activar dominio + HTTPS (cuando lo tengas)

1. En tu proveedor de DNS, crea un registro **A** de `tudominio.com` → `TU_IP`.
2. Instala certbot en el VPS y obtén el certificado (con los contenedores detenidos
   o usando el modo webroot). La forma más simple: certbot en el host generando el
   certificado y montándolo en Nginx, **o** añadir un servicio certbot al compose.

   Ruta rápida (certbot standalone, requiere parar `web` un momento):

   ```bash
   sudo apt install -y certbot
   docker compose stop web
   sudo certbot certonly --standalone -d tudominio.com
   docker compose start web
   ```

   Los certificados quedan en `/etc/letsencrypt/live/tudominio.com/`.

3. Monta los certificados en el contenedor `web` y añade el bloque `server` de HTTPS
   en `client/nginx.conf` (escuchar 443 con `ssl_certificate`), y en
   `docker-compose.yml` descomenta el puerto `443:443` y agrega el volumen
   `- /etc/letsencrypt:/etc/letsencrypt:ro`.

4. Cambia en `.env`:

   ```env
   CLIENT_ORIGIN=https://tudominio.com
   COOKIE_SECURE=true
   ```

   y `docker compose up -d --build`.

5. Renovación automática del certificado:

   ```bash
   sudo certbot renew --dry-run
   ```

> Cuando llegues a este punto avísame y te dejo el `nginx.conf` de HTTPS y el bloque
> del compose ya listos para pegar — es un cambio pequeño.

---

## Resumen de puertos

| Puerto | Servicio | Expuesto a internet |
|---|---|---|
| 22 | SSH | sí (solo con llave) |
| 80 | Nginx (web) | sí |
| 443 | Nginx HTTPS | sí (cuando actives dominio) |
| 4000 | API (server) | no — solo red interna de Docker |
| 5432 | PostgreSQL (db) | no — solo red interna de Docker |
