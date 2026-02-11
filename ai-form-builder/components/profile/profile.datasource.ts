/**
 * Profile Datasource
 * API calls for profile data
 */

import type {
  BillingInfo,
  Invoice,
  NotificationSettings,
  UserProfile,
  UserStats,
} from './profile.configuration';
import {
  defaultBillingInfo,
  defaultNotificationSettings,
  mockInvoices,
} from './profile.configuration';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Fetch user profile data
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/profile`);
    const data = await response.json();

    if (data.success) {
      return data.profile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  profile: Partial<UserProfile>
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    const data = await response.json();
    return { success: data.success };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false };
  }
}

/**
 * Fetch user stats
 */
export async function fetchUserStats(userId: string): Promise<UserStats> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/stats`);
    const data = await response.json();

    if (data.success) {
      return data.stats;
    }
    return { formsCreated: 0, totalResponses: 0, memberSince: 'Unknown' };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { formsCreated: 0, totalResponses: 0, memberSince: 'Unknown' };
  }
}

/**
 * Update password
 */
export async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, message: 'Failed to update password' };
  }
}

/**
 * Get notification settings
 */
export async function getNotificationSettings(userId: string): Promise<NotificationSettings> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/notifications`);
    const data = await response.json();

    if (data.success) {
      return data.settings;
    }
    return defaultNotificationSettings;
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return defaultNotificationSettings;
  }
}

/**
 * Update notification settings
 */
export async function updateNotificationSettings(
  userId: string,
  settings: NotificationSettings
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/notifications`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    const data = await response.json();
    return { success: data.success };
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return { success: false };
  }
}

/**
 * Get billing invoices
 */
export async function getBillingInvoices(userId: string): Promise<Invoice[]> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/invoices`);
    const data = await response.json();

    if (data.success) {
      return data.invoices;
    }
    return mockInvoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return mockInvoices;
  }
}

/**
 * Get billing info (current plan, payment method, next billing date)
 */
export async function getBillingInfo(userId: string): Promise<BillingInfo> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/billing`);
    const data = await response.json();

    if (data.success) {
      return data.billing;
    }
    return defaultBillingInfo;
  } catch (error) {
    console.error('Error fetching billing info:', error);
    return defaultBillingInfo;
  }
}

/**
 * Update subscription plan
 */
export async function updateSubscription(
  userId: string,
  planId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/subscription`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    });

    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { success: false, message: 'Failed to update subscription' };
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  userId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/subscription`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return { success: false, message: 'Failed to cancel subscription' };
  }
}

/**
 * Update payment method
 */
export async function updatePaymentMethod(
  userId: string,
  paymentMethodId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/payment-method`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethodId }),
    });

    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (error) {
    console.error('Error updating payment method:', error);
    return { success: false, message: 'Failed to update payment method' };
  }
}

/**
 * Download invoice PDF
 */
export async function downloadInvoice(userId: string, invoiceId: string): Promise<Blob | null> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/invoices/${invoiceId}/download`);

    if (response.ok) {
      return await response.blob();
    }
    return null;
  } catch (error) {
    console.error('Error downloading invoice:', error);
    return null;
  }
}
