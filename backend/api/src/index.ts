import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { auth } from './lib/auth';
import { rateLimit } from './lib/rate-limiter';
import { formsRoutes } from './routes/forms.elysia';
import { blogsRoutes } from './routes/blogs.elysia';
import { feedRoutes } from './routes/feed.elysia';
import { blogFeaturesRoutes } from './routes/blog-features.elysia';
import { sitemapRoutes } from './routes/sitemap.elysia';
import { setupCronJobs } from './services/cron';
import { redis } from './lib/redis';
import { db } from './db';
import { sql } from 'drizzle-orm';
import { captureException } from './lib/error-tracker';
import { logger } from './lib/logger';

// Initialize background jobs
setupCronJobs();
logger.info('Background jobs initialized');

/**
 * Better Auth handler for Elysia.
 * Converts Elysia's request format to standard Web API Request
 * and routes all /api/auth/* requests to Better Auth.
 */
const betterAuthView = new Elysia({ prefix: '/api/auth' })
    .all('/*', async (ctx) => {
        const BETTER_AUTH_ACCEPT_METHODS = ['POST', 'GET'];
        if (BETTER_AUTH_ACCEPT_METHODS.includes(ctx.request.method)) {
            return auth.handler(ctx.request);
        }
        ctx.error(405);
    });

const isProduction = process.env.NODE_ENV === 'production';

const app = new Elysia()
    .use(cors({
        origin: isProduction
            ? (process.env.FRONTEND_URL || 'https://formanywhere.com').split(',')
            : [
                process.env.FRONTEND_URL || 'http://localhost:4321',
                'http://localhost:3000',
                'http://localhost:3001',
            ],
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    }))
    // Security headers
    .onBeforeHandle(({ set }) => {
        set.headers['X-Content-Type-Options'] = 'nosniff';
        set.headers['X-Frame-Options'] = 'DENY';
        set.headers['X-XSS-Protection'] = '0';
        set.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
        set.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()';
        if (isProduction) {
            set.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
        }
    })
    // Global rate limit: 120 requests per minute per IP
    .use(rateLimit({ max: 120, window: 60, prefix: 'rl:global' }))
    // Only expose swagger in development
    .use(isProduction ? new Elysia() : swagger())
    .get('/', async () => {
        // Deep health check — verify DB and Redis connectivity
        const checks: Record<string, string> = { api: 'ok' };
        try {
            await db.execute(sql`SELECT 1`);
            checks.database = 'ok';
        } catch {
            checks.database = 'error';
        }
        try {
            if (redis.status === 'ready') {
                await redis.ping();
                checks.redis = 'ok';
            } else {
                checks.redis = 'disconnected';
            }
        } catch {
            checks.redis = 'error';
        }
        const healthy = checks.database === 'ok';
        return {
            status: healthy ? 'ok' : 'degraded',
            name: 'FormAnywhere API',
            checks,
        };
    })
    .use(betterAuthView)
    .use(formsRoutes)
    .use(blogsRoutes)
    .use(feedRoutes)
    .use(blogFeaturesRoutes)
    .use(sitemapRoutes)
    // Global error handler — report uncaught errors to Sentry
    .onError(({ error, request }) => {
        if (error instanceof Error) {
            captureException(error, {
                url: request?.url,
                method: request?.method,
            });
        }
    })
    .listen(process.env.PORT || 3001);

logger.info('Server started', { host: app.server?.hostname, port: app.server?.port });
logger.info('Better Auth mounted at /api/auth');

export type App = typeof app;
