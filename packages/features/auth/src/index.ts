/**
 * Auth Feature Module
 *
 * Authentication components: SignIn, SignUp, Social Login, AuthGuard
 */

// ─── State ──────────────────────────────────────────────────────────────────
export { AuthProvider, useAuth } from './state/auth-provider';
export type { AuthContextValue } from './state/auth-provider';

// ─── Components ─────────────────────────────────────────────────────────────
export { AuthGuard } from './components/auth-guard';
export type { AuthGuardProps } from './components/auth-guard';
export { SignInForm } from './components/sign-in-form';
export { SignUpForm } from './components/sign-up-form';
