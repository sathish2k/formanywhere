/**
 * Better Auth Server Configuration
 * 
 * Configures the authentication server with:
 * - Email/password authentication
 * - Google & GitHub social login (OAuth)
 * - Session management with secure cookies
 * - Drizzle ORM adapter for PostgreSQL
 */
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db';
import * as schema from '../db/schema';

/**
 * Sends a password reset email.
 * In development, logs the reset URL to the console.
 * In production, integrate a real email service (e.g. Resend, SendGrid).
 */
async function sendResetPasswordEmail(url: string, user: { email: string; name: string }) {
    if (process.env.NODE_ENV === 'production') {
        // TODO: Replace with real email service (Resend, SendGrid, etc.)
        console.log(`[AUTH] Password reset requested for ${user.email} — email service not configured`);
    } else {
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`  🔑 Password Reset Link for ${user.email}`);
        console.log(`  ${url}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    }
}

export const auth = betterAuth({
    /**
     * Base URL for the API server.
     * Better Auth uses this to construct callback URLs for OAuth.
     */
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',

    /**
     * Secret key for signing sessions and tokens.
     * MUST be set in production via BETTER_AUTH_SECRET env variable.
     */
    secret: process.env.BETTER_AUTH_SECRET || 'formanywhere-dev-secret-change-in-production',

    /**
     * Database adapter using Drizzle ORM.
     * Better Auth will use the existing Drizzle connection and schema.
     */
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
    }),

    /**
     * Email & Password authentication configuration.
     */
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        sendResetPassword: async ({ user, url }) => {
            await sendResetPasswordEmail(url, { email: user.email, name: user.name });
        },
    },

    /**
     * Social login providers.
     * Configure via environment variables.
     */
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            redirectURI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/callback/google',
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            redirectURI: process.env.GITHUB_REDIRECT_URI || 'http://localhost:3001/api/auth/callback/github',
        },
    },

    /**
     * Session configuration.
     */
    session: {
        /**
         * How long a session token is valid (in seconds).
         * Default: 7 days
         */
        expiresIn: 60 * 60 * 24 * 7, // 7 days

        /**
         * How often to refresh the session (update expiry).
         * Default: 1 day (refresh when less than 1 day remaining)
         */
        updateAge: 60 * 60 * 24, // 1 day

        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes cache
        },
    },

    /**
     * Account linking configuration.
     * When a user signs in with a social provider and an account with 
     * the same email already exists, link them automatically.
     */
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ['google', 'github'],
        },
    },

    /**
     * Trusted origins for CORS and redirect validation.
     */
    trustedOrigins: [
        process.env.FRONTEND_URL || 'http://localhost:4321',
        'http://localhost:3000',
        'http://localhost:3001',
    ],

    /**
     * Base path for all auth routes.
     * All auth endpoints will be under /api/auth/*
     */
    basePath: '/api/auth',

    /**
     * Advanced configuration for cookies, rate limiting, etc.
     */
    advanced: {
        crossSubDomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        },
    },
});

/**
 * Export the auth type for use with the client.
 */
export type Auth = typeof auth;
