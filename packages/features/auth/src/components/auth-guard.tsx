/**
 * AuthGuard — SolidJS component for protecting routes client-side.
 * 
 * Wraps content that requires authentication.
 * While loading, shows a spinner. If not authenticated, redirects to /signin.
 * 
 * Usage:
 *   <AuthProvider>
 *     <AuthGuard>
 *       <Dashboard />
 *     </AuthGuard>
 *   </AuthProvider>
 */
import { Show, createEffect, type ParentComponent } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../state/auth-provider';
import { CircularProgress } from '@formanywhere/ui/progress';
import { Typography } from '@formanywhere/ui/typography';

export interface AuthGuardProps {
    /** Where to redirect if not authenticated (default: /signin) */
    redirectTo?: string;
    /** Custom loading fallback */
    loadingFallback?: any;
}

export const AuthGuard: ParentComponent<AuthGuardProps> = (props) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const redirectTo = () => props.redirectTo || '/signin';

    // Redirect when loading is done and user is not authenticated
    createEffect(() => {
        if (!auth.loading() && !auth.isAuthenticated()) {
            navigate(redirectTo());
        }
    });

    return (
        <Show
            when={!auth.loading()}
            fallback={
                props.loadingFallback || (
                    <div style={{
                        display: 'flex',
                        'flex-direction': 'column',
                        'align-items': 'center',
                        'justify-content': 'center',
                        'min-height': '60vh',
                        gap: '16px',
                    }}>
                        <CircularProgress indeterminate />
                        <Typography variant="body-medium" color="on-surface-variant">
                            Checking authentication...
                        </Typography>
                    </div>
                )
            }
        >
            <Show when={auth.isAuthenticated()}>
                {props.children}
            </Show>
        </Show>
    );
};
