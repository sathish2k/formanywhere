/**
 * Email service — sends transactional emails via Resend.
 *
 * Falls back to console.log when RESEND_API_KEY is not set (dev mode).
 *
 * Setup:
 *   1. Sign up at https://resend.com
 *   2. Create an API key
 *   3. Verify your domain
 *   4. Set RESEND_API_KEY and EMAIL_FROM in .env
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'FormAnywhere <noreply@formanywhere.com>';
const RESEND_API_URL = 'https://api.resend.com/emails';

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

/**
 * Send a transactional email via Resend API.
 * Falls back to console.log in development.
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
    if (!RESEND_API_KEY) {
        console.log(`[Email] (dev mode — no RESEND_API_KEY)`);
        console.log(`  To: ${options.to}`);
        console.log(`  Subject: ${options.subject}`);
        console.log(`  Body: ${options.text || options.html.slice(0, 200)}...`);
        return true;
    }

    try {
        const res = await fetch(RESEND_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: EMAIL_FROM,
                to: [options.to],
                subject: options.subject,
                html: options.html,
                text: options.text,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error(`[Email] Resend error (${res.status}):`, err);
            return false;
        }

        return true;
    } catch (err) {
        console.error('[Email] Failed to send:', err);
        return false;
    }
}

/**
 * Send a password reset email.
 */
export async function sendPasswordResetEmail(
    resetUrl: string,
    user: { email: string; name: string }
): Promise<boolean> {
    return sendEmail({
        to: user.email,
        subject: 'Reset your FormAnywhere password',
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #006A6A 0%, #004D4D 100%); border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 24px;">
    <h1 style="color: #fff; margin: 0; font-size: 24px;">FormAnywhere</h1>
  </div>
  <h2 style="color: #1C252E; margin-bottom: 16px;">Reset your password</h2>
  <p style="color: #49454F; line-height: 1.6;">
    Hi ${user.name || 'there'},
  </p>
  <p style="color: #49454F; line-height: 1.6;">
    We received a request to reset your password. Click the button below to choose a new one.
    This link expires in 1 hour.
  </p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="${resetUrl}" style="background: #006A6A; color: #fff; padding: 14px 32px; border-radius: 100px; text-decoration: none; font-weight: 600; display: inline-block;">
      Reset Password
    </a>
  </div>
  <p style="color: #79747E; font-size: 14px; line-height: 1.5;">
    If you didn't request this, you can safely ignore this email. Your password won't be changed.
  </p>
  <hr style="border: none; border-top: 1px solid #E7E0EC; margin: 24px 0;" />
  <p style="color: #AEA9B4; font-size: 12px; text-align: center;">
    &copy; ${new Date().getFullYear()} FormAnywhere. All rights reserved.
  </p>
</body>
</html>`,
        text: `Hi ${user.name || 'there'},\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.`,
    });
}

/**
 * Send a welcome email to new users.
 */
export async function sendWelcomeEmail(user: { email: string; name: string }): Promise<boolean> {
    return sendEmail({
        to: user.email,
        subject: 'Welcome to FormAnywhere! 🎉',
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #006A6A 0%, #004D4D 100%); border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 24px;">
    <h1 style="color: #fff; margin: 0; font-size: 24px;">Welcome to FormAnywhere!</h1>
  </div>
  <h2 style="color: #1C252E; margin-bottom: 16px;">Hey ${user.name || 'there'} 👋</h2>
  <p style="color: #49454F; line-height: 1.6;">
    Thanks for joining FormAnywhere! You can now create beautiful forms that work anywhere — even offline.
  </p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://formanywhere.com/dashboard" style="background: #006A6A; color: #fff; padding: 14px 32px; border-radius: 100px; text-decoration: none; font-weight: 600; display: inline-block;">
      Go to Dashboard
    </a>
  </div>
  <p style="color: #79747E; font-size: 14px; line-height: 1.5;">
    Need help? Just reply to this email — we're happy to assist.
  </p>
  <hr style="border: none; border-top: 1px solid #E7E0EC; margin: 24px 0;" />
  <p style="color: #AEA9B4; font-size: 12px; text-align: center;">
    &copy; ${new Date().getFullYear()} FormAnywhere. All rights reserved.
  </p>
</body>
</html>`,
        text: `Hey ${user.name || 'there'}!\n\nThanks for joining FormAnywhere! Start creating forms at https://formanywhere.com/dashboard`,
    });
}
