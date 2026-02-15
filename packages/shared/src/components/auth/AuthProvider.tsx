/**
 * SolidJS Auth Context & Hook (useAuth)
 * 
 * Provides reactive authentication state management for SolidJS components.
 * Uses Better Auth client SDK under the hood.
 * 
 * Usage:
 *   import { AuthProvider, useAuth } from '@formanywhere/shared/auth';
 * 
 *   // Wrap your app or island
 *   <AuthProvider>
 *     <MyComponent />
 *   </AuthProvider>
 * 
 *   // Inside any child component
 *   const auth = useAuth();
 *   auth.user()       // reactive user object or null
 *   auth.loading()    // true while checking session
 *   auth.isAuthenticated() // shorthand for !!user()
 */
import {
    createContext,
    useContext,
    createSignal,
    createEffect,
    onMount,
    type ParentComponent,
    type Accessor,
} from 'solid-js';
import { authClient, type Session, type User } from '../../lib/auth-client';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AuthContextValue {
    /** Current user object, null if not authenticated */
    user: Accessor<User | null>;
    /** Current session object, null if not authenticated */
    session: Accessor<Session | null>;
    /** True while the session is being loaded/checked */
    loading: Accessor<boolean>;
    /** Shorthand: true if user is authenticated */
    isAuthenticated: Accessor<boolean>;
    /** Sign in with email and password */
    signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
    /** Sign up with email, password, and name */
    signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error?: string }>;
    /** Sign in with a social provider (google, github) */
    signInWithSocial: (provider: 'google' | 'github') => Promise<void>;
    /** Sign out and redirect */
    signOut: () => Promise<void>;
    /** Refresh the session from the server */
    refreshSession: () => Promise<void>;
}

// ─── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>();

/**
 * AuthProvider — wrap your SolidJS island with this to provide auth state.
 * On mount, it fetches the current session from Better Auth.
 */
export const AuthProvider: ParentComponent = (props) => {
    const [user, setUser] = createSignal<User | null>(null);
    const [session, setSession] = createSignal<Session | null>(null);
    const [loading, setLoading] = createSignal(true);

    const isAuthenticated = () => !!user();

    /** Fetch current session from Better Auth server */
    const refreshSession = async () => {
        try {
            const result = await authClient.getSession();
            if (result.data) {
                setUser(result.data.user as User);
                setSession(result.data as Session);
            } else {
                setUser(null);
                setSession(null);
            }
        } catch {
            setUser(null);
            setSession(null);
        } finally {
            setLoading(false);
        }
    };

    /** Sign in with email/password */
    const signInWithEmail = async (email: string, password: string) => {
        try {
            const result = await authClient.signIn.email({
                email,
                password,
            });
            if (result.error) {
                return { error: result.error.message || 'Sign in failed' };
            }
            await refreshSession();
            return {};
        } catch (err: any) {
            return { error: err.message || 'Sign in failed' };
        }
    };

    /** Sign up with email/password */
    const signUpWithEmail = async (email: string, password: string, name: string) => {
        try {
            const result = await authClient.signUp.email({
                email,
                password,
                name,
            });
            if (result.error) {
                return { error: result.error.message || 'Sign up failed' };
            }
            await refreshSession();
            return {};
        } catch (err: any) {
            return { error: err.message || 'Sign up failed' };
        }
    };

    /** Sign in with social provider (redirects) */
    const signInWithSocial = async (provider: 'google' | 'github') => {
        await authClient.signIn.social({
            provider,
            callbackURL: '/dashboard',
        });
    };

    /** Sign out */
    const signOut = async () => {
        await authClient.signOut();
        setUser(null);
        setSession(null);
        window.location.href = '/signin';
    };

    // Fetch session on mount
    onMount(() => {
        refreshSession();
    });

    const value: AuthContextValue = {
        user,
        session,
        loading,
        isAuthenticated,
        signInWithEmail,
        signUpWithEmail,
        signInWithSocial,
        signOut,
        refreshSession,
    };

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
};

/**
 * useAuth — access the auth context from any child component.
 * Must be used inside an <AuthProvider>.
 */
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an <AuthProvider>');
    }
    return context;
}
