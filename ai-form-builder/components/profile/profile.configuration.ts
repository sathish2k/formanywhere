export interface ProfileTab {
  id: string;
  label: string;
  index: number;
}

export interface UserStats {
  formsCreated: number;
  totalResponses: number;
  memberSince: string;
}

export interface Invoice {
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  language: string;
  timezone: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isCurrentPlan: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  brand?: string;
  isDefault: boolean;
}

export interface BillingInfo {
  currentPlan: SubscriptionPlan;
  nextBillingDate: string;
  paymentMethod: PaymentMethod | null;
}

export const defaultBillingInfo: BillingInfo = {
  currentPlan: {
    id: 'pro',
    name: 'Pro Plan',
    price: 29,
    interval: 'monthly',
    features: ['Unlimited forms', 'Advanced analytics', 'Priority support'],
    isCurrentPlan: true,
  },
  nextBillingDate: 'January 1, 2025',
  paymentMethod: {
    id: 'pm_1',
    type: 'card',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    brand: 'Visa',
    isDefault: true,
  },
};

export const profileTabs: ProfileTab[] = [
  { id: 'general', label: 'General', index: 0 },
  { id: 'security', label: 'Security', index: 1 },
  { id: 'notifications', label: 'Notifications', index: 2 },
  { id: 'billing', label: 'Billing', index: 3 },
];

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

export const timezoneOptions = [
  { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
  { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
  { value: 'UTC-6', label: 'Central Time (UTC-6)' },
  { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
  { value: 'UTC+0', label: 'UTC' },
  { value: 'UTC+5:30', label: 'India (UTC+5:30)' },
];

export const mockInvoices: Invoice[] = [
  { date: 'Dec 1, 2024', amount: '$29.00', status: 'Paid' },
  { date: 'Nov 1, 2024', amount: '$29.00', status: 'Paid' },
  { date: 'Oct 1, 2024', amount: '$29.00', status: 'Paid' },
];

export const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: true,
};
