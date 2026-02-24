# ─────────────────────────────────────────────────────────────
# Stage 1: Install dependencies (monorepo-aware)
# ─────────────────────────────────────────────────────────────
FROM oven/bun:1.2 AS deps

WORKDIR /app

# Copy workspace root manifests
COPY package.json bun.lockb bunfig.toml turbo.json ./

# Copy all workspace package.json files so Bun resolves workspaces
COPY apps/web/package.json ./apps/web/
COPY backend/api/package.json ./backend/api/
COPY packages/ui/package.json ./packages/ui/
COPY packages/shared/package.json ./packages/shared/
COPY packages/domain/package.json ./packages/domain/
COPY packages/editor/package.json ./packages/editor/
COPY packages/features/marketing/package.json ./packages/features/marketing/
COPY packages/features/auth/package.json ./packages/features/auth/
COPY packages/features/dashboard/package.json ./packages/features/dashboard/
COPY packages/features/form-editor/package.json ./packages/features/form-editor/
COPY packages/features/form-runtime/package.json ./packages/features/form-runtime/

RUN bun install --frozen-lockfile

# ─────────────────────────────────────────────────────────────
# Stage 2: Build the SolidStart app
# ─────────────────────────────────────────────────────────────
FROM oven/bun:1.2 AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Vinxi build generates .output/ (Nitro preset: bun)
ENV NODE_ENV=production
RUN cd apps/web && npx vinxi build

# ─────────────────────────────────────────────────────────────
# Stage 3: Production runtime (minimal)
# ─────────────────────────────────────────────────────────────
FROM oven/bun:1.2-slim AS runtime

WORKDIR /app

# Non-root user for security
RUN groupadd --gid 1001 appuser && \
    useradd --uid 1001 --gid 1001 --create-home appuser

# Copy the Nitro output (self-contained server + static assets)
COPY --from=builder /app/apps/web/.output ./

USER appuser

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD bun -e "fetch('http://localhost:3000/').then(r => process.exit(r.status < 500 ? 0 : 1)).catch(() => process.exit(1))"

CMD ["bun", "run", "server/index.mjs"]
