import { Hono } from 'hono';

export const formsRoutes = new Hono();

// In-memory store (replace with database)
const forms = new Map();

formsRoutes.get('/', (c) => {
    return c.json(Array.from(forms.values()));
});

formsRoutes.get('/:id', (c) => {
    const id = c.req.param('id');
    const form = forms.get(id);
    if (!form) {
        return c.json({ error: 'Form not found' }, 404);
    }
    return c.json(form);
});

formsRoutes.post('/', async (c) => {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const form = { ...body, id, createdAt: new Date(), updatedAt: new Date() };
    forms.set(id, form);
    return c.json(form, 201);
});

formsRoutes.put('/:id', async (c) => {
    const id = c.req.param('id');
    if (!forms.has(id)) {
        return c.json({ error: 'Form not found' }, 404);
    }
    const body = await c.req.json();
    const form = { ...forms.get(id), ...body, updatedAt: new Date() };
    forms.set(id, form);
    return c.json(form);
});

formsRoutes.delete('/:id', (c) => {
    const id = c.req.param('id');
    if (!forms.has(id)) {
        return c.json({ error: 'Form not found' }, 404);
    }
    forms.delete(id);
    return c.json({ success: true });
});
