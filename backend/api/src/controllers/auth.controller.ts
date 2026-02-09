import { db } from '../db';
import { users } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { Context } from 'elysia';

export class AuthController {
    static async signUp({ body, set }: Context<{ body: { email: string; password: string; name?: string } }>) {
        const { email, password, name } = body;

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            set.status = 400;
            return { error: 'User already exists' };
        }

        const hashedPassword = await Bun.password.hash(password);

        const [newUser] = await db
            .insert(users)
            .values({
                email,
                password: hashedPassword,
                name,
                provider: 'email',
            })
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
            });

        return newUser;
    }

    static async signIn({ body, set, cookie: { auth } }: Context<{ body: { email: string; password: string } }>) {
        const { email, password } = body;

        const user = await db.query.users.findFirst({
            where: and(eq(users.email, email), eq(users.provider, 'email')),
        });

        if (!user || !user.password) {
            set.status = 401;
            return { error: 'Invalid credentials' };
        }

        const isMatch = await Bun.password.verify(password, user.password);

        if (!isMatch) {
            set.status = 401;
            return { error: 'Invalid credentials' };
        }

        auth.set({
            value: user.id,
            httpOnly: true,
            maxAge: 7 * 86400, // 7 days
            path: '/',
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }

    static async me({ cookie: { auth }, set }: Context) {
        if (!auth.value) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, auth.value as string),
            columns: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        if (!user) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }

        return user;
    }

    static signOut({ cookie: { auth } }: Context) {
        auth.remove();
        return { success: true };
    }

    // Social Login Placeholders
    static async googleSignIn({ query, set }: Context) {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = 'http://localhost:3001/api/auth/google/callback';

        if (!clientId) {
            set.status = 500;
            return { error: 'Missing GOOGLE_CLIENT_ID' };
        }

        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`;

        return { url };
    }

    static async googleCallback({ query, set, cookie: { auth } }: Context) {
        const code = query.code as string;
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = 'http://localhost:3001/api/auth/google/callback';

        if (!code || !clientId || !clientSecret) {
            set.status = 400;
            return { error: 'Invalid request or missing config' };
        }

        try {
            // Exchange code for token
            const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code',
                }),
            });

            const tokens = await tokenResponse.json();

            // Get user info
            const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });

            const googleUser = await userResponse.json();

            // Find or create user
            let user = await db.query.users.findFirst({
                where: and(eq(users.email, googleUser.email), eq(users.provider, 'google')),
            });

            if (!user) {
                // Check if user exists with email but different provider
                const existingEmailUser = await db.query.users.findFirst({
                    where: eq(users.email, googleUser.email),
                });

                if (existingEmailUser) {
                    // TODO: Link accounts logic? For now, just error or log in
                    user = existingEmailUser;
                } else {
                    [user] = await db.insert(users).values({
                        email: googleUser.email,
                        name: googleUser.name,
                        provider: 'google',
                        providerId: googleUser.id,
                    }).returning();
                }
            }

            auth.set({
                value: user.id,
                httpOnly: true,
                maxAge: 7 * 86400,
                path: '/',
            });

            set.redirect = 'http://localhost:3000/app'; // Redirect to frontend app
        } catch (error) {
            console.error('Google Auth Error:', error);
            set.status = 500;
            return { error: 'Authentication failed' };
        }
    }

    static async githubSignIn({ set }: Context) {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const redirectUri = 'http://localhost:3001/api/auth/github/callback';

        if (!clientId) {
            set.status = 500;
            return { error: 'Missing GITHUB_CLIENT_ID' };
        }

        const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
        return { url };
    }

    static async githubCallback({ query, set, cookie: { auth } }: Context) {
        const code = query.code as string;
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        if (!code || !clientId || !clientSecret) {
            set.status = 400;
            return { error: 'Invalid request or missing config' };
        }

        try {
            const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    client_id: clientId,
                    client_secret: clientSecret,
                    code,
                }),
            });

            const tokens = await tokenResponse.json();

            const userResponse = await fetch('https://api.github.com/user', {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });
            const githubUser = await userResponse.json();

            // Get email separately if private
            const emailResponse = await fetch('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });
            const emails = await emailResponse.json();
            const primaryEmail = emails.find((e: any) => e.primary)?.email || githubUser.email;


            let user = await db.query.users.findFirst({
                where: and(eq(users.email, primaryEmail), eq(users.provider, 'github')),
            });

            if (!user) {
                const existingEmailUser = await db.query.users.findFirst({
                    where: eq(users.email, primaryEmail),
                });

                if (existingEmailUser) {
                    user = existingEmailUser;
                } else {
                    [user] = await db.insert(users).values({
                        email: primaryEmail,
                        name: githubUser.name || githubUser.login,
                        provider: 'github',
                        providerId: githubUser.id.toString(),
                    }).returning();
                }
            }

            auth.set({
                value: user.id,
                httpOnly: true,
                maxAge: 7 * 86400,
                path: '/',
            });

            set.redirect = 'http://localhost:3000/app';
        } catch (error) {
            console.error('GitHub Auth Error:', error);
            set.status = 500;
            return { error: 'Authentication failed' };
        }
    }
}
