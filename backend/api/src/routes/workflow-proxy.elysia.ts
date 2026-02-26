/**
 * Workflow Proxy — Server-side API caller for form workflows
 *
 * Proxies external API calls from workflow nodes to avoid CORS issues
 * and keep credentials server-side.
 *
 * POST /api/workflow-proxy
 * Body: { url, method, headers?, body? }
 * Returns: the external API response as JSON
 */
import { Elysia, t } from 'elysia';
import { auth } from '../lib/auth';

export const workflowProxyRoutes = new Elysia({ prefix: '/api/workflow-proxy' })
    .derive(async ({ request, set }) => {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            set.status = 401;
            return { user: null as any };
        }

        return { user: session.user };
    })
    .onBeforeHandle(({ user, set }) => {
        if (!user) {
            set.status = 401;
            return { success: false, error: 'Unauthorized' };
        }
    })

    // ── Execute workflow API call (POST /api/workflow-proxy) ────────
    .post('/', async ({ body, set }) => {
        const { url, method, headers, body: requestBody } = body as {
            url: string;
            method: string;
            headers?: Record<string, string>;
            body?: string;
        };

        // Basic URL validation
        if (!url || typeof url !== 'string') {
            set.status = 400;
            return { success: false, error: 'Missing or invalid URL' };
        }

        // Block internal/private IPs (basic protection)
        try {
            const parsed = new URL(url);
            const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
            if (blockedHosts.includes(parsed.hostname) || parsed.hostname.startsWith('192.168.') || parsed.hostname.startsWith('10.')) {
                set.status = 403;
                return { success: false, error: 'Requests to internal hosts are not allowed' };
            }
        } catch {
            set.status = 400;
            return { success: false, error: 'Invalid URL format' };
        }

        try {
            const fetchOptions: RequestInit = {
                method: (method || 'GET').toUpperCase(),
                headers: {
                    'Content-Type': 'application/json',
                    ...(headers || {}),
                },
            };

            if (requestBody && fetchOptions.method !== 'GET') {
                fetchOptions.body = requestBody;
            }

            const response = await fetch(url, fetchOptions);

            // Try to parse as JSON, fall back to text
            let data: unknown;
            const contentType = response.headers.get('content-type') ?? '';
            if (contentType.includes('json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            return {
                success: true,
                status: response.status,
                data,
            };
        } catch (err) {
            set.status = 502;
            return {
                success: false,
                error: `Proxy request failed: ${err instanceof Error ? err.message : String(err)}`,
            };
        }
    }, {
        body: t.Object({
            url: t.String(),
            method: t.Optional(t.String()),
            headers: t.Optional(t.Record(t.String(), t.String())),
            body: t.Optional(t.String()),
        }),
    });
