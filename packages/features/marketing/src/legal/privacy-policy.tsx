/**
 * Privacy Policy page component.
 */
import type { Component } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';

export const PrivacyPolicy: Component = () => {
    return (
        <Box padding="xl" style={{ "max-width": "800px", margin: "0 auto", "padding-top": "48px", "padding-bottom": "96px" }}>
            <Typography variant="display-small" style={{ "font-weight": "900", "margin-bottom": "16px" }}>
                Privacy Policy
            </Typography>
            <Typography variant="body-medium" style={{ color: "var(--m3-color-on-surface-variant)", "margin-bottom": "48px" }}>
                Last updated: February 2026
            </Typography>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    1. Information We Collect
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    When you create an account, we collect your name, email address, and password (hashed).
                    If you sign in via Google or GitHub, we receive your public profile name, email, and avatar.
                    We also collect usage data such as pages visited, forms created, and feature interactions to improve the service.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    2. How We Use Your Information
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    We use your information to: provide and maintain the service; authenticate your identity;
                    send transactional emails (password resets, account notifications); improve our product through anonymized analytics;
                    and display relevant advertisements via Google AdSense. We do not sell your personal data to third parties.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    3. Cookies & Tracking
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    We use essential cookies for authentication and session management. With your consent, we also use
                    Google Analytics for usage statistics and Google AdSense for personalized advertising.
                    You can manage your cookie preferences at any time via the consent banner.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    4. Data Storage & Security
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    Your data is stored in encrypted PostgreSQL databases. Passwords are hashed using industry-standard
                    algorithms. All communication is encrypted via TLS/SSL. We regularly review our security practices
                    and implement safeguards to protect your information.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    5. Your Rights (GDPR)
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    If you are in the EU/EEA, you have the right to: access your personal data; request correction or deletion;
                    object to processing; withdraw consent; and data portability. To exercise these rights,
                    contact us at privacy@formanywhere.com.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    6. Third-Party Services
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    We use the following third-party services: Google Analytics (usage analytics), Google AdSense (advertising),
                    Google OAuth and GitHub OAuth (authentication), and Resend (transactional emails).
                    Each service has its own privacy policy that governs their use of your data.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    7. Data Retention
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    We retain your account data for as long as your account is active. Form submissions are retained
                    according to your plan. You may delete your account and all associated data at any time from your dashboard settings.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    8. Contact Us
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    For privacy inquiries, contact us at privacy@formanywhere.com.
                </Typography>
            </section>
        </Box>
    );
};

export default PrivacyPolicy;
