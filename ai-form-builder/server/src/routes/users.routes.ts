/**
 * Users Routes
 * User profile and settings endpoints
 */

import bcrypt from 'bcryptjs';
import { Elysia, t } from 'elysia';
import { User } from '../models';
import { Form } from '../models';

export const usersRoutes = new Elysia({ prefix: '/users' })
  // Get user profile
  .get(
    '/:id/profile',
    async ({ params, set }) => {
      try {
        const user = await User.findById(params.id);
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        return {
          success: true,
          profile: {
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            company: user.company || '',
            jobTitle: user.jobTitle || '',
            language: user.language || 'en',
            timezone: user.timezone || 'UTC',
          },
        };
      } catch (error) {
        console.error('Get profile error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to get profile' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Update user profile
  .put(
    '/:id/profile',
    async ({ params, body, set }) => {
      try {
        const user = await User.findById(params.id);
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        // Update fields
        if (body.name) user.name = body.name;
        if (body.email) user.email = body.email;
        if (body.phone !== undefined) user.phone = body.phone;
        if (body.company !== undefined) user.company = body.company;
        if (body.jobTitle !== undefined) user.jobTitle = body.jobTitle;
        if (body.language) user.language = body.language;
        if (body.timezone) user.timezone = body.timezone;

        await user.save();

        return {
          success: true,
          message: 'Profile updated successfully',
        };
      } catch (error) {
        console.error('Update profile error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to update profile' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
        email: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        company: t.Optional(t.String()),
        jobTitle: t.Optional(t.String()),
        language: t.Optional(t.String()),
        timezone: t.Optional(t.String()),
      }),
    }
  )

  // Get user stats
  .get(
    '/:id/stats',
    async ({ params, set }) => {
      try {
        const user = await User.findById(params.id);
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        // Get form count and total responses
        const forms = await Form.find({ creatorId: params.id });
        const formsCreated = forms.length;
        const totalResponses = forms.reduce(
          (sum, form) => sum + ((form as unknown as { responseCount?: number }).responseCount || 0),
          0
        );

        // Format member since date
        const memberSince = user.createdAt.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });

        return {
          success: true,
          stats: {
            formsCreated,
            totalResponses,
            memberSince,
          },
        };
      } catch (error) {
        console.error('Get stats error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to get stats' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Update password
  .put(
    '/:id/password',
    async ({ params, body, set }) => {
      try {
        const user = await User.findById(params.id).select('+password');
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        // Verify current password
        if (user.password) {
          const isValid = await user.comparePassword(body.currentPassword);
          if (!isValid) {
            set.status = 400;
            return { success: false, message: 'Current password is incorrect' };
          }
        }

        // Hash and set new password
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(body.newPassword, salt);
        await user.save();

        return {
          success: true,
          message: 'Password updated successfully',
        };
      } catch (error) {
        console.error('Update password error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to update password' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        currentPassword: t.String(),
        newPassword: t.String({ minLength: 8 }),
      }),
    }
  )

  // Get notification settings
  .get(
    '/:id/notifications',
    async ({ params, set }) => {
      try {
        const user = await User.findById(params.id);
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        return {
          success: true,
          settings: {
            emailNotifications: user.emailNotifications ?? true,
            pushNotifications: user.pushNotifications ?? false,
            marketingEmails: user.marketingEmails ?? true,
          },
        };
      } catch (error) {
        console.error('Get notifications error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to get notification settings' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Update notification settings
  .put(
    '/:id/notifications',
    async ({ params, body, set }) => {
      try {
        const user = await User.findById(params.id);
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        if (body.emailNotifications !== undefined) {
          user.emailNotifications = body.emailNotifications;
        }
        if (body.pushNotifications !== undefined) {
          user.pushNotifications = body.pushNotifications;
        }
        if (body.marketingEmails !== undefined) {
          user.marketingEmails = body.marketingEmails;
        }

        await user.save();

        return {
          success: true,
          message: 'Notification settings updated',
        };
      } catch (error) {
        console.error('Update notifications error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to update notification settings' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        emailNotifications: t.Optional(t.Boolean()),
        pushNotifications: t.Optional(t.Boolean()),
        marketingEmails: t.Optional(t.Boolean()),
      }),
    }
  );
