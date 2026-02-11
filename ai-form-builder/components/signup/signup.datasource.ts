/**
 * SignUp Datasource
 * API calls for signup functionality
 */

import { signIn } from 'next-auth/react';
import type { SignUpFormData } from './signup.configuration';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface SignUpResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(data: SignUpFormData): Promise<SignUpResponse> {
  try {
    // First register the user via API
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.fullName,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Registration failed',
      };
    }

    // Then sign in the user
    const signInResult = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      return {
        success: false,
        message: 'Account created but sign in failed',
      };
    }

    return {
      success: true,
      message: 'Account created successfully',
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      message: 'An error occurred during sign up',
    };
  }
}

/**
 * Sign up with Google OAuth
 */
export async function signUpWithGoogle(): Promise<SignUpResponse> {
  try {
    await signIn('google', { callbackUrl: '/dashboard' });
    return { success: true };
  } catch (error) {
    console.error('Google sign up error:', error);
    return { success: false, message: 'Google sign up failed' };
  }
}

/**
 * Sign up with GitHub OAuth
 */
export async function signUpWithGithub(): Promise<SignUpResponse> {
  try {
    await signIn('github', { callbackUrl: '/dashboard' });
    return { success: true };
  } catch (error) {
    console.error('GitHub sign up error:', error);
    return { success: false, message: 'GitHub sign up failed' };
  }
}
