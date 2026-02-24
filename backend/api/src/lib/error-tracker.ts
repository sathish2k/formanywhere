/**
 * Error tracker — captures and reports errors to Sentry.
 *
 * Uses Sentry's HTTP API directly (no SDK needed) to keep bundle minimal.
 * Falls back to console.error when SENTRY_DSN is not configured.
 *
 * Setup:
 *   1. Create a project at https://sentry.io
 *   2. Get your DSN from Project Settings → Client Keys
 *   3. Set SENTRY_DSN in .env
 */

import { logger } from './logger';

const SENTRY_DSN = process.env.SENTRY_DSN || '';
const ENV = process.env.NODE_ENV || 'development';

interface SentryDSNParts {
    publicKey: string;
    host: string;
    projectId: string;
}

let dsnParts: SentryDSNParts | null = null;

function parseDSN(dsn: string): SentryDSNParts | null {
    try {
        const url = new URL(dsn);
        return {
            publicKey: url.username,
            host: `${url.protocol}//${url.host}`,
            projectId: url.pathname.replace('/', ''),
        };
    } catch {
        return null;
    }
}

function getDSNParts(): SentryDSNParts | null {
    if (!SENTRY_DSN) return null;
    if (!dsnParts) dsnParts = parseDSN(SENTRY_DSN);
    return dsnParts;
}

/**
 * Capture and report an error/exception.
 */
export async function captureException(error: Error, context?: Record<string, any>): Promise<void> {
    // Always log locally with structured logger
    logger.error(error.message, {
        error: error.name,
        stack: error.stack?.split('\n').slice(0, 5).join('\n'),
        ...context,
    });

    const parts = getDSNParts();
    if (!parts) return;

    const storeUrl = `${parts.host}/api/${parts.projectId}/store/`;

    const payload = {
        event_id: crypto.randomUUID().replace(/-/g, ''),
        timestamp: new Date().toISOString(),
        platform: 'node',
        level: 'error',
        environment: ENV,
        server_name: 'formanywhere-api',
        exception: {
            values: [{
                type: error.name || 'Error',
                value: error.message,
                stacktrace: error.stack ? {
                    frames: parseStackTrace(error.stack),
                } : undefined,
            }],
        },
        extra: context || {},
        tags: {
            runtime: 'bun',
            service: 'api',
        },
    };

    try {
        await fetch(storeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${parts.publicKey}, sentry_client=formanywhere/1.0`,
            },
            body: JSON.stringify(payload),
        });
    } catch {
        // Don't let error tracking itself cause issues
    }
}

/**
 * Capture a message (info/warning level).
 */
export async function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): Promise<void> {
    const parts = getDSNParts();
    if (!parts) {
        console.log(`[Sentry:${level}]`, message);
        return;
    }

    const storeUrl = `${parts.host}/api/${parts.projectId}/store/`;

    try {
        await fetch(storeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${parts.publicKey}, sentry_client=formanywhere/1.0`,
            },
            body: JSON.stringify({
                event_id: crypto.randomUUID().replace(/-/g, ''),
                timestamp: new Date().toISOString(),
                platform: 'node',
                level,
                environment: ENV,
                server_name: 'formanywhere-api',
                message: { formatted: message },
                tags: { runtime: 'bun', service: 'api' },
            }),
        });
    } catch {
        // Silent fail
    }
}

/** Parse a stack trace string into Sentry frame format */
function parseStackTrace(stack: string): Array<{ filename: string; lineno?: number; colno?: number; function?: string }> {
    const frames: Array<{ filename: string; lineno?: number; colno?: number; function?: string }> = [];
    const lines = stack.split('\n').slice(1); // Skip first line (error message)

    for (const line of lines) {
        const match = line.match(/at\s+(?:(.+?)\s+)?\(?(.+?):(\d+):(\d+)\)?/);
        if (match) {
            frames.push({
                function: match[1] || '<anonymous>',
                filename: match[2],
                lineno: parseInt(match[3], 10),
                colno: parseInt(match[4], 10),
            });
        }
    }

    return frames.reverse(); // Sentry expects oldest frame first
}
