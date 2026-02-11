/**
 * Billing Routes
 * Subscription and payment endpoints with Stripe integration
 */

import { Elysia, t } from 'elysia';
import { env } from '../config/env';
import { User } from '../models';
import {
  cancelSubscription,
  constructWebhookEvent,
  createBillingPortalSession,
  createCheckoutSession,
  getInvoicePdf,
  getOrCreateCustomer,
  getPriceId,
  getSubscription,
  listInvoices,
} from '../services/stripe.service';

export const billingRoutes = new Elysia({ prefix: '/users' })
  // Get billing info
  .get(
    '/:id/billing',
    async ({ params, set }) => {
      try {
        const user = await User.findById(params.id);
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        let subscription = null;
        if (user.subscriptionId) {
          try {
            subscription = await getSubscription(user.subscriptionId);
          } catch {
            // Subscription may have been deleted
          }
        }

        return {
          success: true,
          billing: {
            currentPlan: {
              id: user.currentPlan || 'free',
              name: user.currentPlan === 'pro' ? 'Pro Plan' : 'Free Plan',
              price: user.currentPlan === 'pro' ? 29 : 0,
              interval: 'monthly',
              features:
                user.currentPlan === 'pro'
                  ? ['Unlimited forms', 'Advanced analytics', 'Priority support']
                  : ['3 forms', 'Basic analytics', 'Community support'],
              isCurrentPlan: true,
            },
            nextBillingDate: subscription
              ? new Date(
                  (subscription as unknown as { current_period_end: number }).current_period_end *
                    1000
                ).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : null,
            paymentMethod: null, // Would fetch from Stripe customer
            subscriptionStatus: user.subscriptionStatus,
          },
        };
      } catch (error) {
        console.error('Get billing error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to get billing info' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Create checkout session for subscription
  .post(
    '/:id/subscription/checkout',
    async ({ params, body, set }) => {
      try {
        const user = await User.findById(params.id);
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        // Get or create Stripe customer
        const customer = await getOrCreateCustomer(user.email, user.name, user.stripeCustomerId);

        // Save customer ID if new
        if (!user.stripeCustomerId) {
          user.stripeCustomerId = customer.id;
          await user.save();
        }

        // Get price ID
        const priceId = getPriceId('pro', body.interval || 'monthly');
        if (!priceId) {
          set.status = 400;
          return { success: false, message: 'Invalid plan configuration' };
        }

        // Create checkout session
        const session = await createCheckoutSession(
          customer.id,
          priceId,
          body.successUrl || `${env.CORS_ORIGIN}/profile?success=true`,
          body.cancelUrl || `${env.CORS_ORIGIN}/pricing`
        );

        return {
          success: true,
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error('Create checkout error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to create checkout session' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        interval: t.Optional(t.Union([t.Literal('monthly'), t.Literal('yearly')])),
        successUrl: t.Optional(t.String()),
        cancelUrl: t.Optional(t.String()),
      }),
    }
  )

  // Create billing portal session
  .post(
    '/:id/billing-portal',
    async ({ params, body, set }) => {
      try {
        const user = await User.findById(params.id);
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        if (!user.stripeCustomerId) {
          set.status = 400;
          return { success: false, message: 'No billing account found' };
        }

        const session = await createBillingPortalSession(
          user.stripeCustomerId,
          body.returnUrl || `${env.CORS_ORIGIN}/profile`
        );

        return {
          success: true,
          url: session.url,
        };
      } catch (error) {
        console.error('Create portal error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to create portal session' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        returnUrl: t.Optional(t.String()),
      }),
    }
  )

  // Cancel subscription
  .delete(
    '/:id/subscription',
    async ({ params, set }) => {
      try {
        const user = await User.findById(params.id);
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        if (!user.subscriptionId) {
          set.status = 400;
          return { success: false, message: 'No active subscription' };
        }

        await cancelSubscription(user.subscriptionId);

        user.subscriptionStatus = 'canceled';
        await user.save();

        return {
          success: true,
          message: 'Subscription will be canceled at end of billing period',
        };
      } catch (error) {
        console.error('Cancel subscription error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to cancel subscription' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Get invoices
  .get(
    '/:id/invoices',
    async ({ params, set }) => {
      try {
        const user = await User.findById(params.id);
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        if (!user.stripeCustomerId) {
          return {
            success: true,
            invoices: [],
          };
        }

        const stripeInvoices = await listInvoices(user.stripeCustomerId);

        const invoices = stripeInvoices.map((inv) => ({
          id: inv.id,
          date: new Date(inv.created * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          amount: `$${((inv.amount_paid || 0) / 100).toFixed(2)}`,
          status: inv.status === 'paid' ? 'Paid' : inv.status === 'open' ? 'Pending' : 'Failed',
        }));

        return {
          success: true,
          invoices,
        };
      } catch (error) {
        console.error('Get invoices error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to get invoices' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Download invoice
  .get(
    '/:id/invoices/:invoiceId/download',
    async ({ params, set }) => {
      try {
        const pdfUrl = await getInvoicePdf(params.invoiceId);
        if (!pdfUrl) {
          set.status = 404;
          return { success: false, message: 'Invoice not found' };
        }

        // Redirect to PDF URL
        set.redirect = pdfUrl;
        return;
      } catch (error) {
        console.error('Download invoice error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to download invoice' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
        invoiceId: t.String(),
      }),
    }
  );

// Webhook route (separate from user prefix)
export const stripeWebhookRoutes = new Elysia({ prefix: '/webhooks' }).post(
  '/stripe',
  async ({ request, set }) => {
    try {
      const signature = request.headers.get('stripe-signature');
      if (!signature) {
        set.status = 400;
        return { success: false, message: 'Missing signature' };
      }

      const body = await request.text();
      const event = constructWebhookEvent(body, signature);

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as { customer?: string; subscription?: string };
          const customerId = session.customer;
          const subscriptionId = session.subscription;

          if (customerId && subscriptionId) {
            await User.findOneAndUpdate(
              { stripeCustomerId: customerId },
              {
                subscriptionId,
                subscriptionStatus: 'active',
                currentPlan: 'pro',
              }
            );
          }
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as {
            id?: string;
            status?: string;
            cancel_at_period_end?: boolean;
          };
          await User.findOneAndUpdate(
            { subscriptionId: subscription.id },
            {
              subscriptionStatus: subscription.cancel_at_period_end
                ? 'canceled'
                : (subscription.status as 'active' | 'past_due'),
            }
          );
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as { id?: string };
          await User.findOneAndUpdate(
            { subscriptionId: subscription.id },
            {
              subscriptionId: null,
              subscriptionStatus: null,
              currentPlan: 'free',
            }
          );
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as { subscription?: string };
          if (invoice.subscription) {
            await User.findOneAndUpdate(
              { subscriptionId: invoice.subscription },
              { subscriptionStatus: 'past_due' }
            );
          }
          break;
        }
      }

      return { success: true, received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      set.status = 400;
      return { success: false, message: 'Webhook failed' };
    }
  }
);
