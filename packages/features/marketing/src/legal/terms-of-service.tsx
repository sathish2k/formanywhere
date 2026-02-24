/**
 * Terms of Service page component.
 */
import type { Component } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';

export const TermsOfService: Component = () => {
    return (
        <Box padding="xl" style={{ "max-width": "800px", margin: "0 auto", "padding-top": "48px", "padding-bottom": "96px" }}>
            <Typography variant="display-small" style={{ "font-weight": "900", "margin-bottom": "16px" }}>
                Terms of Service
            </Typography>
            <Typography variant="body-medium" style={{ color: "var(--m3-color-on-surface-variant)", "margin-bottom": "48px" }}>
                Last updated: February 2026
            </Typography>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    1. Acceptance of Terms
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    By accessing or using FormAnywhere ("the Service"), you agree to be bound by these Terms of Service.
                    If you do not agree, do not use the Service. We reserve the right to update these terms at any time.
                    Continued use after changes constitutes acceptance of the modified terms.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    2. Account Registration
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    To use certain features, you must create an account. You agree to provide accurate information,
                    keep your password secure, and notify us of any unauthorized access. You are responsible for all
                    activity under your account.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    3. Acceptable Use
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    You agree not to: use the Service for illegal purposes; distribute malware or spam via forms;
                    attempt to access other users' data; interfere with the Service's infrastructure;
                    collect personal data without consent; or violate any applicable laws or regulations.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    4. Your Content
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    You retain ownership of all forms, submissions, and content you create. By using the Service,
                    you grant us a limited license to host and display your content as necessary to provide the Service.
                    We do not claim ownership of your data.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    5. AI-Generated Content
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    Some features use AI to generate content (blog posts, form suggestions, etc.).
                    AI-generated content is provided "as is" without warranties of accuracy.
                    You are responsible for reviewing and verifying any AI-generated content before publishing.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    6. Service Availability
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    We strive for high availability but do not guarantee uninterrupted service.
                    We may perform maintenance with reasonable notice. The Service is provided "as is"
                    without warranties of any kind, express or implied.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    7. Limitation of Liability
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    To the maximum extent permitted by law, FormAnywhere shall not be liable for any indirect,
                    incidental, special, consequential, or punitive damages, including but not limited to loss of data,
                    revenue, or business opportunities, arising from your use of the Service.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    8. Termination
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    We may suspend or terminate your account if you violate these terms. You may delete your account
                    at any time. Upon termination, your data will be deleted in accordance with our Privacy Policy.
                </Typography>
            </section>

            <section style={{ "margin-bottom": "40px" }}>
                <Typography variant="headline-small" style={{ "font-weight": "700", "margin-bottom": "16px" }}>
                    9. Contact
                </Typography>
                <Typography variant="body-large" style={{ "line-height": "1.7", color: "var(--m3-color-on-surface-variant)" }}>
                    For questions about these Terms, contact us at legal@formanywhere.com.
                </Typography>
            </section>
        </Box>
    );
};

export default TermsOfService;
