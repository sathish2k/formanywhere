import { Elysia, t } from 'elysia';
import { AuthController } from '../controllers/auth.controller';

export const authRoutes = new Elysia({ prefix: '/auth' })
    .model({
        signUp: t.Object({
            email: t.String(),
            password: t.String(),
            name: t.Optional(t.String()),
        }),
        signIn: t.Object({
            email: t.String(),
            password: t.String(),
        }),
    })
    .post('/sign-up', AuthController.signUp, { body: 'signUp' })
    .post('/sign-in', AuthController.signIn, { body: 'signIn' })
    .get('/me', AuthController.me)
    .post('/sign-out', AuthController.signOut)
    .get('/google', AuthController.googleSignIn)
    .get('/google/callback', AuthController.googleCallback)
    .get('/github', AuthController.githubSignIn)
    .get('/github/callback', AuthController.githubCallback);
