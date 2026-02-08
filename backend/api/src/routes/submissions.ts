import { Hono } from 'hono';

export const submissionsRoutes = new Hono();

// In-memory store (replace with database)
const submissions = new Map();

submissionsRoutes.get('/', (c) => {
    const formId = c.req.query('formId');
    const all = Array.from(submissions.values());
    if (formId) {
        return c.json(all.filter((s: any) => s.formId === formId));
    }
    return c.json(all);
});

submissionsRoutes.get('/:id', (c) => {
    const id = c.req.param('id');
    const submission = submissions.get(id);
    if (!submission) {
        return c.json({ error: 'Submission not found' }, 404);
    }
    return c.json(submission);
});

submissionsRoutes.post('/', async (c) => {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const submission = {
        ...body,
        id,
        submittedAt: new Date(),
        syncStatus: 'synced',
    };
    submissions.set(id, submission);
    return c.json(submission, 201);
});
