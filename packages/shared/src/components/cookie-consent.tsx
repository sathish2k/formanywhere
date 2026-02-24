/**
 * Cookie consent banner — GDPR / ePrivacy compliant.
 *
 * Shows a bottom banner on first visit. Saves preference to localStorage.
 * When declined, Google Analytics and AdSense scripts won't load.
 *
 * Import:
 *   import { CookieConsent } from '@formanywhere/shared/components/cookie-consent';
 */
import { createSignal, Show, onMount, type Component } from 'solid-js';

const CONSENT_KEY = 'fa_cookie_consent';

type ConsentValue = 'accepted' | 'declined' | null;

/** Check if user has given cookie consent */
export function hasConsent(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(CONSENT_KEY) === 'accepted';
}

/** Get the current consent state */
export function getConsentState(): ConsentValue {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CONSENT_KEY) as ConsentValue;
}

export const CookieConsent: Component = () => {
    const [visible, setVisible] = createSignal(false);

    onMount(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            // Delay showing to avoid layout shift on initial load
            setTimeout(() => setVisible(true), 1500);
        }
    });

    const accept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);
        // Reload to allow analytics/ads to initialize
        window.location.reload();
    };

    const decline = () => {
        localStorage.setItem(CONSENT_KEY, 'declined');
        setVisible(false);
    };

    return (
        <Show when={visible()}>
            <div
                role="dialog"
                aria-label="Cookie consent"
                style={{
                    position: 'fixed',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    'z-index': '9999',
                    padding: '16px 24px',
                    background: 'var(--m3-color-inverse-surface, #313033)',
                    color: 'var(--m3-color-inverse-on-surface, #F4EFF4)',
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'space-between',
                    'flex-wrap': 'wrap',
                    gap: '12px',
                    'box-shadow': '0 -2px 16px rgba(0,0,0,0.15)',
                    'font-family': 'var(--m3-typescale-body-medium-font, inherit)',
                    'font-size': '14px',
                    'line-height': '1.5',
                }}
            >
                <p style={{ margin: '0', flex: '1', 'min-width': '200px' }}>
                    We use cookies for analytics and ads to improve your experience.
                    See our{' '}
                    <a
                        href="/privacy"
                        style={{ color: 'var(--m3-color-inverse-primary, #9ECFCF)', 'text-decoration': 'underline' }}
                    >
                        Privacy Policy
                    </a>.
                </p>
                <div style={{ display: 'flex', gap: '8px', 'flex-shrink': '0' }}>
                    <button
                        onClick={decline}
                        style={{
                            padding: '8px 20px',
                            'border-radius': '100px',
                            border: '1px solid var(--m3-color-outline, #79747E)',
                            background: 'transparent',
                            color: 'var(--m3-color-inverse-on-surface, #F4EFF4)',
                            cursor: 'pointer',
                            'font-size': '14px',
                            'font-weight': '500',
                        }}
                    >
                        Decline
                    </button>
                    <button
                        onClick={accept}
                        style={{
                            padding: '8px 20px',
                            'border-radius': '100px',
                            border: 'none',
                            background: 'var(--m3-color-inverse-primary, #9ECFCF)',
                            color: 'var(--m3-color-on-primary, #003737)',
                            cursor: 'pointer',
                            'font-size': '14px',
                            'font-weight': '600',
                        }}
                    >
                        Accept
                    </button>
                </div>
            </div>
        </Show>
    );
};

export default CookieConsent;
