/**
 * Auth Routes
 * User registration and authentication endpoints
 */

import { Elysia, t } from 'elysia';
import { User } from '../models';

export const authRoutes = new Elysia({ prefix: '/auth' })
  // Register new user
  .post(
    '/register',
    async ({ body, set }) => {
      try {
        const { email, password, name } = body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          set.status = 400;
          return { success: false, message: 'User already exists' };
        }

        // Create new user
        const user = new User({
          email,
          password,
          name,
          provider: 'credentials',
        });
        await user.save();

        return {
          success: true,
          message: 'User registered successfully',
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          },
        };
      } catch (error) {
        console.error('Registration error:', error);
        set.status = 500;
        return { success: false, message: 'Registration failed' };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8 }),
        name: t.String({ minLength: 1 }),
      }),
    }
  )

  // Login user
  .post(
    '/login',
    async ({ body, set }) => {
      try {
        const { email, password } = body;

        // Find user with password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
          set.status = 401;
          return { success: false, message: 'Invalid credentials' };
        }

        // Check if user has password (credentials provider)
        if (!user.password) {
          set.status = 401;
          return { success: false, message: 'Please use social login' };
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
          set.status = 401;
          return { success: false, message: 'Invalid credentials' };
        }

        return {
          success: true,
          message: 'Login successful',
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          },
        };
      } catch (error) {
        console.error('Login error:', error);
        set.status = 500;
        return { success: false, message: 'Login failed' };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 1 }),
      }),
    }
  )

  // Get user by email (for NextAuth)
  .get(
    '/user/:email',
    async ({ params, set }) => {
      try {
        const user = await User.findOne({ email: params.email });
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        return {
          success: true,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          },
        };
      } catch (error) {
        console.error('Get user error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to get user' };
      }
    },
    {
      params: t.Object({
        email: t.String(),
      }),
    }
  )

  // OAuth user sync (for Google login)
  .post(
    '/oauth',
    async ({ body, set }) => {
      try {
        const { email, name, image, provider, providerId } = body;

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            email,
            name,
            image,
            provider,
            providerId,
          });
          await user.save();
        } else {
          // Update user if needed
          if (image && !user.image) {
            user.image = image;
            await user.save();
          }
        }

        return {
          success: true,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          },
        };
      } catch (error) {
        console.error('OAuth sync error:', error);
        set.status = 500;
        return { success: false, message: 'OAuth sync failed' };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        name: t.String(),
        image: t.Optional(t.String()),
        provider: t.String(),
        providerId: t.String(),
      }),
    }
  );
