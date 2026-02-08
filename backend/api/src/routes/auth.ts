import { Hono } from 'hono';

export const authRoutes = new Hono();

// Placeholder auth routes
authRoutes.post('/login', async (c) => {
    const { email, password } = await c.req.json();
    // TODO: Implement actual authentication
    return c.json({
        token: 'placeholder-token',
        user: { id: '1', email },
    });
});

authRoutes.post('/register', async (c) => {
    const { email, password, name } = await c.req.json();
    // TODO: Implement actual registration
    return c.json({
        user: { id: '1', email, name },
    });
});

authRoutes.post('/logout', (c) => {
    return c.json({ success: true });
});
