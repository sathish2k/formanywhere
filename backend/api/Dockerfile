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
# Stage 2: Build the backend
# ─────────────────────────────────────────────────────────────
FROM oven/bun:1.2 AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build backend bundle
RUN cd backend/api && bun build src/index.ts --outdir dist --target bun

# ─────────────────────────────────────────────────────────────
# Stage 3: Production runtime (minimal)
# ─────────────────────────────────────────────────────────────
FROM oven/bun:1.2-slim AS runtime

WORKDIR /app

# Non-root user for security
RUN groupadd --gid 1001 appuser && \
    useradd --uid 1001 --gid 1001 --create-home appuser

# Copy only what's needed to run
COPY --from=builder /app/backend/api/dist ./dist
COPY --from=builder /app/backend/api/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

# Drizzle needs the schema at runtime for migrations
COPY --from=builder /app/backend/api/src/db ./src/db
COPY --from=builder /app/backend/api/drizzle.config.ts ./drizzle.config.ts

USER appuser

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD bun -e "fetch('http://localhost:3001/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["bun", "run", "dist/index.js"]
