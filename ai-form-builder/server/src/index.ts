/**
 * Elysia Server Entry Point
 * Main server with CORS, routes, and MongoDB connection
 */

import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { connectDatabase, env } from './config';
import { authRoutes, formsRoutes, templatesRoutes, usersRoutes } from './routes';

const app = new Elysia()
  // CORS
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    })
  )

  // Health check
  .get('/', () => ({
    status: 'ok',
    message: 'FormBuilder API Server',
    version: '1.0.0',
  }))

  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }))

  // Mount routes
  .use(authRoutes)
  .use(formsRoutes)
  .use(templatesRoutes)
  .use(usersRoutes)
  // TODO: Enable once Stripe account is set up
  // .use(billingRoutes)
  // .use(stripeWebhookRoutes)

  // Error handler
  .onError(({ code, error, set }) => {
    console.error(`Error [${code}]:`, error);

    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        success: false,
        message: 'Validation error',
        errors: error.message,
      };
    }

    set.status = 500;
    return {
      success: false,
      message: 'Internal server error',
    };
  });

// Start server
async function start() {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Elysia server
    app.listen(env.PORT);

    console.log(`
🚀 FormBuilder API Server is running!
   
   Local:   http://localhost:${env.PORT}
   Mode:    ${env.NODE_ENV}
   
   Routes:
   - GET  /                           Health check
   - POST /auth/register
   - POST /auth/login
   - GET  /auth/user/:email
   - GET  /forms
   - POST /forms
   - GET  /forms/:id
   - PUT  /forms/:id
   - DELETE /forms/:id
   - GET  /templates
   - GET  /templates/:id
   - POST /templates/:id/use
   - GET  /users/:id/profile
   - PUT  /users/:id/profile
   - GET  /users/:id/stats
   - PUT  /users/:id/password
   - GET  /users/:id/notifications
   - PUT  /users/:id/notifications
   - GET  /users/:id/billing
   - POST /users/:id/subscription/checkout
   - POST /users/:id/billing-portal
   - DELETE /users/:id/subscription
   - GET  /users/:id/invoices
   - POST /webhooks/stripe
`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export type App = typeof app;
