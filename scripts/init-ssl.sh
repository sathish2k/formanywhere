#!/bin/bash
# ─────────────────────────────────────────────────────────
# FormAnywhere — First-time SSL initialization script
#
# This script:
#   1. Starts Nginx with a temporary self-signed cert
#   2. Requests a real Let's Encrypt certificate via Certbot
#   3. Restarts Nginx with the real certificate
#
# Prerequisites:
#   - Docker & Docker Compose installed
#   - .env file configured with DOMAIN and SSL_EMAIL
#   - DNS A records pointing to this server:
#       yourdomain.com     → YOUR_SERVER_IP
#       api.yourdomain.com → YOUR_SERVER_IP
#
# Usage:
#   chmod +x scripts/init-ssl.sh
#   bash scripts/init-ssl.sh
# ─────────────────────────────────────────────────────────

set -euo pipefail

# Load env vars
if [ ! -f .env ]; then
    echo "❌ .env file not found. Run: cp .env.example .env"
    exit 1
fi

source .env

DOMAIN="${DOMAIN:?Set DOMAIN in .env}"
SSL_EMAIL="${SSL_EMAIL:?Set SSL_EMAIL in .env}"

echo ""
echo "🔒 FormAnywhere SSL Setup"
echo "   Domain:  ${DOMAIN}"
echo "   API:     api.${DOMAIN}"
echo "   Email:   ${SSL_EMAIL}"
echo ""

# ── Step 1: Create dummy certs so Nginx can start ───────
echo "📦 Creating temporary self-signed certificate..."

CERT_DIR="./certbot/conf/live/${DOMAIN}"
mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "$CERT_DIR/privkey.pem" \
        -out "$CERT_DIR/fullchain.pem" \
        -subj "/CN=localhost" \
        2>/dev/null
    echo "   ✓ Temporary cert created"
else
    echo "   ✓ Cert already exists, skipping"
fi

# Create SSL options file if needed
SSL_OPTIONS_DIR="./certbot/conf"
if [ ! -f "$SSL_OPTIONS_DIR/options-ssl-nginx.conf" ]; then
    mkdir -p "$SSL_OPTIONS_DIR"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
        > "$SSL_OPTIONS_DIR/options-ssl-nginx.conf"
    echo "   ✓ SSL options downloaded"
fi

if [ ! -f "$SSL_OPTIONS_DIR/ssl-dhparams.pem" ]; then
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
        > "$SSL_OPTIONS_DIR/ssl-dhparams.pem"
    echo "   ✓ DH params downloaded"
fi

# ── Step 2: Start Nginx with dummy cert ─────────────────
echo ""
echo "🚀 Starting Nginx with temporary certificate..."

# Override certbot volume to use local dir
docker compose up -d nginx --no-deps 2>/dev/null || true
sleep 3

# ── Step 3: Get real Let's Encrypt certificate ──────────
echo ""
echo "🔐 Requesting Let's Encrypt certificate..."

docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$SSL_EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "api.$DOMAIN"

# ── Step 4: Remove dummy cert & reload Nginx ───────────
echo ""
echo "🔄 Reloading Nginx with real certificate..."

# Remove temporary certs (real ones are in docker volume)
rm -rf ./certbot

docker compose exec nginx nginx -s reload 2>/dev/null || \
    docker compose restart nginx

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ SSL setup complete!"
echo ""
echo "  Your site is now available at:"
echo "    🌐 https://${DOMAIN}"
echo "    🔗 https://api.${DOMAIN}"
echo ""
echo "  Next steps:"
echo "    docker compose up -d --build"
echo "    docker compose exec api bun run drizzle-kit push"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
