import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { authRoutes } from './routes/auth';

const app = new Elysia()
    .use(cors())
    .use(swagger())
    .get('/', () => ({ status: 'ok', name: 'FormAnywhere API' }))
    .group('/api', (app) =>
        app
            .use(authRoutes)
        // .use(formsRoutes) // TODO: Migrate forms routes
        // .use(submissionsRoutes) // TODO: Migrate submissions routes
        // .use(syncRoutes) // TODO: Migrate sync routes
    )
    .listen(process.env.PORT || 3001);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
