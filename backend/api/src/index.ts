import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { auth } from './lib/auth';

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

const app = new Elysia()
    .use(cors({
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:4321',
            'http://localhost:3000',
            'http://localhost:3001',
        ],
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    }))
    .use(swagger())
    .get('/', () => ({ status: 'ok', name: 'FormAnywhere API' }))
    .use(betterAuthView)
    // .use(formsRoutes) // TODO: Migrate forms routes
    // .use(submissionsRoutes) // TODO: Migrate submissions routes
    // .use(syncRoutes) // TODO: Migrate sync routes
    .listen(process.env.PORT || 3001);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`🔐 Better Auth is mounted at /api/auth`);

export type App = typeof app;
