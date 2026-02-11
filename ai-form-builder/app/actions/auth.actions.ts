/**
 * Auth Actions
 * Client-side auth helpers using NextAuth v4
 */

'use server';

import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Get current session on the server
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Register a new user
 */
export async function register(data: { email: string; password: string; name: string }) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { error: result.message || 'Registration failed' };
    }

    return { success: true, message: 'Registration successful! Please sign in.' };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Registration failed. Please try again.' };
  }
}
