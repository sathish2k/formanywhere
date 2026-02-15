/**
 * Dashboard client-side mount script
 * Uses Better Auth session to get user data, then renders Dashboard island
 */
import { render } from 'solid-js/web';
import { Dashboard } from '@formanywhere/shared/dashboard';
import { AuthProvider } from '@formanywhere/shared/auth';
import { authClient } from '@formanywhere/shared/auth-client';

const root = document.getElementById('dashboard-root');
if (root) {
    // Fetch session from Better Auth
    authClient.getSession().then((result) => {
        const user = result.data?.user;

        render(
            () => (
                <AuthProvider>
                    <Dashboard
                        userId={user?.id || 'guest'}
                        userName={user?.name || 'Guest User'}
                        userEmail={user?.email || 'guest@formanywhere.com'}
                    />
                </AuthProvider>
            ),
            root
        );
    }).catch(() => {
        // Auth service unavailable — render dashboard with guest fallback
        render(
            () => (
                <AuthProvider>
                    <Dashboard
                        userId="guest"
                        userName="Guest User"
                        userEmail="guest@formanywhere.com"
                    />
                </AuthProvider>
            ),
            root
        );
    });
}
