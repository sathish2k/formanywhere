import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { formsRoutes } from './routes/forms';
import { submissionsRoutes } from './routes/submissions';
import { authRoutes } from './routes/auth';
import { syncRoutes } from './routes/sync';

const app = new Hono();

// Middleware
app.use('*', cors());

// Health check
app.get('/', (c) => c.json({ status: 'ok', name: 'FormAnywhere API' }));

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/forms', formsRoutes);
app.route('/api/submissions', submissionsRoutes);
app.route('/api/sync', syncRoutes);

export default {
    port: process.env.PORT || 3001,
    fetch: app.fetch,
};
