import { Hono } from 'hono';

export const syncRoutes = new Hono();

syncRoutes.post('/push', async (c) => {
    const { items } = await c.req.json();
    // TODO: Process sync items and store
    return c.json({
        synced: items.length,
        failed: 0,
        timestamp: new Date(),
    });
});

syncRoutes.get('/pull', (c) => {
    const since = c.req.query('since');
    // TODO: Return items updated since timestamp
    return c.json({
        items: [],
        timestamp: new Date(),
    });
});
