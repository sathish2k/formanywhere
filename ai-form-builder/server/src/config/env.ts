/**
 * Environment Configuration
 */

export const env = {
  PORT: Number(Bun.env.PORT) || 4000,
  MONGODB_URI: Bun.env.MONGODB_URI || 'mongodb://localhost:27017/formbuilder',
  JWT_SECRET: Bun.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: Bun.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: Bun.env.CORS_ORIGIN || 'http://localhost:3000',
  NODE_ENV: Bun.env.NODE_ENV || 'development',
  // Stripe
  STRIPE_SECRET_KEY: Bun.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: Bun.env.STRIPE_WEBHOOK_SECRET || '',
  STRIPE_PRICE_ID_PRO_MONTHLY: Bun.env.STRIPE_PRICE_ID_PRO_MONTHLY || '',
  STRIPE_PRICE_ID_PRO_YEARLY: Bun.env.STRIPE_PRICE_ID_PRO_YEARLY || '',
};
