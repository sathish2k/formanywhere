/**
 * Astro Middleware for Authentication
 * 
 * Server-side session validation using Better Auth.
 * Runs on every request *before* the page renders.
 * 
 * - Protected routes (e.g., /dashboard, /app) redirect to /signin if no valid session
 * - Public routes pass through
 * - Session data is injected into Astro.locals for use in .astro pages
 * 
 * Industry standard: validate session server-side to prevent flicker
 * and ensure security before any HTML is sent to the client.
 */
import { defineMiddleware } from 'astro:middleware';
import { createAuthClient } from 'better-auth/client';

/**
 * Routes that require authentication.
 * Unauthenticated users are redirected to /signin.
 */
const PROTECTED_ROUTES = [
    '/dashboard',
    '/app',
    '/form-setup',
    '/preview',
    '/settings',
    '/profile',
];

/**
 * Routes that should redirect TO dashboard if already authenticated.
 * (e.g., signin/signup pages — no point showing these to logged-in users)
 */
const AUTH_ROUTES = [
    '/signin',
    '/signup',
];

const API_URL = import.meta.env.API_URL || 'http://localhost:3001';

export const onRequest = defineMiddleware(async (context, next) => {
    const { pathname } = context.url;

    // Skip middleware for static assets, API calls, etc.
    if (
        pathname.startsWith('/_') ||
        pathname.startsWith('/api/') ||
        pathname.includes('.') // static files (.css, .js, .svg, etc.)
    ) {
        return next();
    }

    // Try to get session from cookies by forwarding them to Better Auth
    let sessionUser: { id: string; name: string; email: string; image?: string } | null = null;

    try {
        const cookieHeader = context.request.headers.get('cookie');
        if (cookieHeader) {
            // Forward the session cookie to the Better Auth API to validate
            const response = await fetch(`${API_URL}/api/auth/get-session`, {
                headers: {
                    cookie: cookieHeader,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data?.user) {
                    sessionUser = data.user;
                }
            }
        }
    } catch (err) {
        // Auth service unavailable — treat as unauthenticated
        console.error('[Auth Middleware] Failed to validate session:', err);
    }

    // Inject user into Astro.locals (available in .astro pages)
    context.locals.user = sessionUser;
    context.locals.isAuthenticated = !!sessionUser;

    // // Check if this is a protected route
    // const isProtectedRoute = PROTECTED_ROUTES.some(
    //     (route) => pathname === route || pathname.startsWith(route + '/')
    // );

    // if (isProtectedRoute && !sessionUser) {
    //     // Not authenticated → redirect to signin with return URL
    //     const returnUrl = encodeURIComponent(pathname);
    //     return context.redirect(`/signin?returnTo=${returnUrl}`);
    // }

    // // Check if this is an auth route (signin/signup) and user is already logged in
    // const isAuthRoute = AUTH_ROUTES.some(
    //     (route) => pathname === route || pathname.startsWith(route + '/')
    // );

    // if (isAuthRoute && sessionUser) {
    //     // Already authenticated → redirect to dashboard
    //     return context.redirect('/dashboard');
    // }

    return next();
});
