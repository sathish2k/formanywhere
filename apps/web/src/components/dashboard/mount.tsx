/**
 * Dashboard client-side mount script
 * Reads session from localStorage and renders the Dashboard island
 */
import { render } from 'solid-js/web';
import { Dashboard } from '@formanywhere/shared/dashboard';

const root = document.getElementById('dashboard-root');
if (root) {
    // Try reading session; fall back to guest
    const sessionRaw = localStorage.getItem('formanywhere-session');
    let sessionData: { userId?: string; userName?: string; userEmail?: string } = {};

    if (sessionRaw) {
        try {
            sessionData = JSON.parse(sessionRaw);
        } catch {
            // ignore
        }
    }

    // Allow dashboard without login — use guest defaults
    render(
        () => Dashboard({
            userId: sessionData.userId || 'guest',
            userName: sessionData.userName || 'Guest User',
            userEmail: sessionData.userEmail || 'guest@formanywhere.com',
        }),
        root
    );
}
