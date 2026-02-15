/**
 * Better Auth Client Configuration
 * 
 * This is the client-side auth configuration used by frontend components.
 * It communicates with the Better Auth server endpoints.
 * 
 * Usage:
 *   import { authClient } from '@formanywhere/shared/auth-client';
 *   
 *   // Sign in
 *   await authClient.signIn.email({ email, password });
 *   
 *   // Sign up
 *   await authClient.signUp.email({ email, password, name });
 *   
 *   // Social login
 *   await authClient.signIn.social({ provider: 'google' });
 *   
 *   // Get session
 *   const session = await authClient.getSession();
 *   
 *   // Sign out
 *   await authClient.signOut();
 */
import { createAuthClient } from 'better-auth/client';

/**
 * The auth client instance configured to point at the backend API.
 * 
 * In development, the API runs on localhost:3001.
 * In production, set VITE_API_URL or use relative paths.
 */
export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined'
        ? (import.meta.env?.VITE_API_URL || 'http://localhost:3001')
        : 'http://localhost:3001',
});

/**
 * Convenience re-exports for common auth operations.
 */
export const {
    signIn,
    signUp,
    signOut,
    getSession,
    useSession,
} = authClient;

/**
 * Type exports for use in components.
 */
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
