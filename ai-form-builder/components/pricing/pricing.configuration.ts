/**
 * Pricing Page Configuration
 * Static configuration data for pricing page
 */

import { Building2, Sparkles, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  icon: LucideIcon;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  popular: boolean;
  features: PlanFeature[];
  cta: string;
  gradient: boolean;
}

export interface FAQ {
  q: string;
  a: string;
}

/**
 * Pricing Plans
 */
export const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    icon: Sparkles,
    description: 'Perfect for individuals and small projects',
    monthlyPrice: 0,
    annualPrice: 0,
    popular: false,
    features: [
      { name: 'Up to 3 forms', included: true },
      { name: '100 submissions/month', included: true },
      { name: 'Basic form fields', included: true },
      { name: 'Email notifications', included: true },
      { name: 'Basic templates', included: true },
      { name: 'Community support', included: true },
      { name: 'Multi-step forms', included: false },
      { name: 'Conditional logic', included: false },
      { name: 'Custom branding', included: false },
      { name: 'API access', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'Priority support', included: false },
    ],
    cta: 'Get Started Free',
    gradient: false,
  },
  {
    name: 'Professional',
    icon: Zap,
    description: 'For growing teams and businesses',
    monthlyPrice: 29,
    annualPrice: 290,
    popular: true,
    features: [
      { name: 'Unlimited forms', included: true },
      { name: '10,000 submissions/month', included: true },
      { name: 'All form field types', included: true },
      { name: 'Email notifications', included: true },
      { name: 'Premium templates', included: true },
      { name: 'Priority support', included: true },
      { name: 'Multi-step forms', included: true },
      { name: 'Conditional logic', included: true },
      { name: 'Custom branding', included: true },
      { name: 'API access', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Team collaboration', included: false },
    ],
    cta: 'Start Free Trial',
    gradient: true,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    description: 'For large organizations with custom needs',
    monthlyPrice: null,
    annualPrice: null,
    popular: false,
    features: [
      { name: 'Unlimited everything', included: true },
      { name: 'Custom submission limits', included: true },
      { name: 'All form field types', included: true },
      { name: 'Advanced notifications', included: true },
      { name: 'Custom templates', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Multi-step forms', included: true },
      { name: 'Advanced conditional logic', included: true },
      { name: 'White-label solution', included: true },
      { name: 'Full API access', included: true },
      { name: 'Custom analytics', included: true },
      { name: 'Team collaboration', included: true },
    ],
    cta: 'Contact Sales',
    gradient: false,
  },
];

/**
 * Frequently Asked Questions
 */
export const pricingFAQs: FAQ[] = [
  {
    q: 'Can I change plans later?',
    a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
  },
  {
    q: 'What happens when I exceed my submission limit?',
    a: "You'll receive a notification when you're approaching your limit. You can upgrade your plan or purchase additional submissions.",
  },
  {
    q: 'Do you offer refunds?',
    a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We use enterprise-grade security with encryption at rest and in transit. SOC 2 Type II compliant.',
  },
];
