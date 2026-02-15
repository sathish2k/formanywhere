/// <reference types="astro/client" />

/**
 * Astro locals type declarations for auth middleware.
 * These types are injected by the middleware and available in all .astro pages.
 */
declare namespace App {
    interface Locals {
        /** Authenticated user from Better Auth session, null if not logged in */
        user: {
            id: string;
            name: string;
            email: string;
            image?: string | null;
        } | null;
        /** Whether the user is authenticated */
        isAuthenticated: boolean;
    }
}
