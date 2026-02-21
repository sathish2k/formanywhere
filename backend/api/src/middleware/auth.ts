/**
 * Elysia Auth Middleware
 * 
 * Server-side middleware for protecting API routes.
 * Validates the Better Auth session from cookies and injects
 * the authenticated user into the request context.
 * 
 * Usage:
 *   import { authMiddleware } from '../middleware/auth';
 *   
 *   const protectedRoutes = new Elysia()
 *     .use(authMiddleware)
 *     .get('/forms', ({ user }) => {
 *         // user is guaranteed to exist here
 *         return db.query.forms.findMany({ where: eq(forms.userId, user.id) });
 *     });
 */
import { Elysia } from 'elysia';
import { auth } from '../lib/auth';

/**
 * Auth middleware that validates sessions for protected API routes.
 * 
 * Adds `user` and `session` to the Elysia context.
 * Returns 401 if no valid session is found.
 */
export const authMiddleware = new Elysia({ name: 'auth-middleware' })
    .derive(async ({ request, set }) => {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            set.status = 401;
            return {
                user: null as any,
                session: null as any,
            };
        }

        return {
            user: session.user,
            session: session.session,
        };
    })
    .onBeforeHandle(({ user, set }) => {
        if (!user) {
            set.status = 401;
            return { success: false, error: 'Unauthorized' };
        }
    });

/**
 * Optional auth middleware — doesn't block requests without a session.
 * Useful for routes that work both authenticated and anonymously.
 * 
 * Adds `user` (nullable) and `session` (nullable) to context.
 */
export const optionalAuthMiddleware = new Elysia({ name: 'optional-auth-middleware' })
    .derive(async ({ request }) => {
        try {
            const session = await auth.api.getSession({
                headers: request.headers,
            });

            return {
                user: session?.user ?? null,
                session: session?.session ?? null,
            };
        } catch {
            return {
                user: null,
                session: null,
            };
        }
    });
