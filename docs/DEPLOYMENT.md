# FormAnywhere — Deployment Guide

> Complete step-by-step guide to deploy FormAnywhere on a VPS with Docker, SSL, and a custom domain.

---

## Prerequisites

| Requirement | Minimum |
|-------------|---------|
| **VPS** | 2 GB RAM, 1 vCPU, 20 GB disk (e.g. DigitalOcean, Hetzner, AWS EC2, Contabo) |
| **OS** | Ubuntu 22.04+ / Debian 12+ |
| **Domain** | A registered domain (e.g. `formanywhere.com`) |
| **Docker** | Docker Engine 24+ & Docker Compose v2 |

---

## 1. Server Setup

### 1.1 Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Add your user to docker group (logout & login after)
sudo usermod -aG docker $USER

# Verify
docker --version
docker compose version
```

### 1.2 Configure Firewall

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (for SSL challenge)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 2. DNS Configuration

At your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), add **two A records**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `YOUR_SERVER_IP` | 300 |
| A | `api` | `YOUR_SERVER_IP` | 300 |

> **Wait 5–10 minutes** for DNS to propagate. Verify with:
> ```bash
> dig +short yourdomain.com
> dig +short api.yourdomain.com
> ```
> Both should return your server IP.

---

## 3. Deploy the Application

### 3.1 Clone & Configure

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/formanywhere.git
cd formanywhere

# Create environment file
cp .env.example .env
```

### 3.2 Edit `.env`

```bash
nano .env
```

Fill in these **required** values:

```env
# Your domain (without https://)
DOMAIN=yourdomain.com

# Generate strong passwords
POSTGRES_PASSWORD=<run: openssl rand -base64 24>
REDIS_PASSWORD=<run: openssl rand -base64 24>

# Auth secret (MUST be unique and random)
BETTER_AUTH_SECRET=<run: openssl rand -base64 32>

# Email for SSL certificate notifications
SSL_EMAIL=you@yourdomain.com
```

Optional (add if you have them):

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# AI Features
GEMINI_API_KEY=your-gemini-api-key
XAI_API_KEY=your-xai-api-key

# Blog cover images
UNSPLASH_ACCESS_KEY=your-unsplash-key
```

> **Quick password generation:**
> ```bash
> echo "POSTGRES_PASSWORD=$(openssl rand -base64 24)"
> echo "REDIS_PASSWORD=$(openssl rand -base64 24)"
> echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)"
> ```

### 3.3 Get SSL Certificate & Start

```bash
# Initialize SSL (first time only)
bash scripts/init-ssl.sh

# Build and start all services
docker compose up -d --build

# Run database migrations
docker compose exec api bun run drizzle-kit push
```

### 3.4 Verify Deployment

```bash
# Check all services are running
docker compose ps

# Expected output:
# NAME         STATUS
# nginx        Up (healthy)
# web          Up (healthy)
# api          Up (healthy)
# postgres     Up (healthy)
# redis        Up (healthy)
# certbot      Up
```

Visit your site:
- **Frontend:** `https://yourdomain.com`
- **API health:** `https://api.yourdomain.com/`  (should return `{"status":"ok"}`)

---

## 4. Architecture

```
Internet
   │
   ▼  :80 / :443
┌──────────────────┐
│    Nginx         │
│  (reverse proxy  │
│   + SSL/TLS)     │
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│  web  │ │  api  │
│ :3000 │ │ :3001 │
└───────┘ └───┬───┘
              │
        ┌─────┴─────┐
        ▼           ▼
   ┌──────────┐ ┌───────┐
   │ postgres │ │ redis │
   │  :5432   │ │ :6379 │
   └──────────┘ └───────┘
```

| Service | Image | Purpose |
|---------|-------|---------|
| **nginx** | `nginx:1.27-alpine` | Reverse proxy, SSL termination, rate limiting |
| **web** | Custom (Bun) | SolidStart SSR frontend |
| **api** | Custom (Bun) | ElysiaJS REST API |
| **postgres** | `postgres:16-alpine` | Primary database |
| **redis** | `redis:7-alpine` | Caching, rate limiting, view count buffering |
| **certbot** | `certbot/certbot` | Auto-renews SSL certificates every 12h |

---

## 5. Common Operations

### View Logs

```bash
# All services
docker compose logs -f

# Single service
docker compose logs -f api
docker compose logs -f web
docker compose logs -f nginx
```

### Rebuild After Code Changes

```bash
git pull
docker compose up -d --build
```

### Run Database Migrations

```bash
docker compose exec api bun run drizzle-kit push
```

### Restart a Service

```bash
docker compose restart api
docker compose restart web
docker compose restart nginx
```

### Stop Everything

```bash
docker compose down        # stop containers (data preserved)
docker compose down -v     # stop + DELETE all data (⚠️ destructive)
```

### Access Database

```bash
docker compose exec postgres psql -U formanywhere -d formanywhere
```

### Access Redis

```bash
docker compose exec redis redis-cli -a "$REDIS_PASSWORD"
```

---

## 6. Updating the Application

```bash
cd formanywhere

# Pull latest code
git pull origin main

# Rebuild and restart (zero-downtime with health checks)
docker compose up -d --build

# Run migrations if schema changed
docker compose exec api bun run drizzle-kit push
```

---

## 7. Backups

### Database Backup

```bash
# Create a backup
docker compose exec postgres pg_dump -U formanywhere formanywhere > backup_$(date +%Y%m%d).sql

# Restore from backup
cat backup_20260224.sql | docker compose exec -T postgres psql -U formanywhere -d formanywhere
```

### Automated Daily Backups (Cron)

```bash
# Edit crontab
crontab -e

# Add this line (backs up daily at 2 AM)
0 2 * * * cd /root/formanywhere && docker compose exec -T postgres pg_dump -U formanywhere formanywhere | gzip > /root/backups/db_$(date +\%Y\%m\%d).sql.gz
```

```bash
# Create backup directory
mkdir -p /root/backups
```

---

## 8. Monitoring

### Quick Health Check

```bash
# API health
curl -s https://api.yourdomain.com/ | jq

# Check container resource usage
docker stats --no-stream
```

### Set Up Uptime Monitoring

Use a free service to monitor your endpoints:
- [UptimeRobot](https://uptimerobot.com/) (free, 5-min checks)
- [Betterstack](https://betterstack.com/) (free tier)

Monitor these URLs:
| URL | Expected |
|-----|----------|
| `https://yourdomain.com` | 200 OK |
| `https://api.yourdomain.com/` | `{"status":"ok"}` |

---

## 9. Troubleshooting

### Container won't start

```bash
# Check logs for errors
docker compose logs api --tail 50
docker compose logs web --tail 50

# Verify env vars are loaded
docker compose config
```

### SSL certificate errors

```bash
# Check certificate status
docker compose exec certbot certbot certificates

# Force renewal
docker compose run --rm certbot renew --force-renewal
docker compose exec nginx nginx -s reload
```

### Database connection errors

```bash
# Verify postgres is healthy
docker compose exec postgres pg_isready -U formanywhere

# Check DATABASE_URL
docker compose exec api printenv DATABASE_URL
```

### Port 80/443 already in use

```bash
# Find what's using the port
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting service (e.g. Apache)
sudo systemctl stop apache2
sudo systemctl disable apache2
```

### Out of disk space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a --volumes  # ⚠️ removes unused images/volumes
```

---

## 10. Security Checklist

Before going live, verify:

- [ ] `.env` file has strong, unique passwords (not the defaults)
- [ ] `BETTER_AUTH_SECRET` is a random 32+ byte string
- [ ] SSH key authentication enabled (password auth disabled)
- [ ] Firewall only allows ports 22, 80, 443
- [ ] DNS A records resolve correctly
- [ ] HTTPS works and redirects from HTTP
- [ ] API returns `{"status":"ok"}` at `https://api.yourdomain.com/`
- [ ] Swagger is NOT accessible in production
- [ ] Database backups are scheduled
- [ ] Uptime monitoring is configured

---

## Quick Reference

| Task | Command |
|------|---------|
| Start everything | `docker compose up -d` |
| Rebuild & start | `docker compose up -d --build` |
| Stop everything | `docker compose down` |
| View logs | `docker compose logs -f` |
| Run migrations | `docker compose exec api bun run drizzle-kit push` |
| Backup database | `docker compose exec postgres pg_dump -U formanywhere formanywhere > backup.sql` |
| SSL renewal | Automatic (certbot container) |
| Update app | `git pull && docker compose up -d --build` |
