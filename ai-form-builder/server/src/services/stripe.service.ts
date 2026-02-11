/**
 * Stripe Service
 * Handles all Stripe API interactions
 */

import Stripe from 'stripe';
import { env } from '../config/env';

// Lazy-initialize Stripe (only when actually used)
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured. Please add it to your .env file.');
    }
    _stripe = new Stripe(env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

/**
 * Create a new Stripe customer
 */
export async function createCustomer(email: string, name: string): Promise<Stripe.Customer> {
  return getStripe().customers.create({
    email,
    name,
  });
}

/**
 * Get or create Stripe customer
 */
export async function getOrCreateCustomer(
  email: string,
  name: string,
  existingCustomerId?: string
): Promise<Stripe.Customer> {
  if (existingCustomerId) {
    try {
      return (await getStripe().customers.retrieve(existingCustomerId)) as Stripe.Customer;
    } catch {
      // Customer not found, create new one
    }
  }
  return createCustomer(email, name);
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  return getStripe().checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
  });
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return getStripe().subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return getStripe().subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return getStripe().subscriptions.retrieve(subscriptionId);
}

/**
 * List customer invoices
 */
export async function listInvoices(customerId: string, limit = 10): Promise<Stripe.Invoice[]> {
  const invoices = await getStripe().invoices.list({
    customer: customerId,
    limit,
  });
  return invoices.data;
}

/**
 * Get invoice PDF URL
 */
export async function getInvoicePdf(invoiceId: string): Promise<string | null> {
  const invoice = await getStripe().invoices.retrieve(invoiceId);
  return invoice.invoice_pdf || null;
}

/**
 * Construct webhook event from payload
 */
export function constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
  return getStripe().webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
}

/**
 * Get price ID based on plan and interval
 */
export function getPriceId(_plan: 'pro', interval: 'monthly' | 'yearly'): string {
  if (interval === 'yearly') {
    return env.STRIPE_PRICE_ID_PRO_YEARLY;
  }
  return env.STRIPE_PRICE_ID_PRO_MONTHLY;
}

export { getStripe };
