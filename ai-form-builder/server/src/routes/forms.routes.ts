/**
 * Forms Routes
 * CRUD operations for user forms
 */

import { Elysia, t } from 'elysia';
import mongoose from 'mongoose';
import { Form, User } from '../models';

export const formsRoutes = new Elysia({ prefix: '/forms' })
  // Get all forms for a user
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const { userId, search, sortBy, sortOrder, page, limit } = query;
        if (!userId) {
          set.status = 400;
          return { success: false, message: 'User ID required' };
        }

        // Find the actual MongoDB user ID
        let mongoUserId: mongoose.Types.ObjectId | null = null;

        if (mongoose.Types.ObjectId.isValid(userId)) {
          mongoUserId = new mongoose.Types.ObjectId(userId);
        } else {
          // Try to find user by providerId (OAuth ID)
          const user = await User.findOne({ providerId: userId });
          if (user) {
            mongoUserId = user._id;
          }
        }

        if (!mongoUserId) {
          return { success: true, forms: [], total: 0, page: 1, totalPages: 0 };
        }

        // Build query
        const filter: Record<string, unknown> = { userId: mongoUserId };
        if (search) {
          filter.title = { $regex: search, $options: 'i' };
        }

        // Build sort
        const sortOptions: Record<string, 1 | -1> = {};
        const sortField = sortBy || 'updatedAt';
        const order = sortOrder === 'asc' ? 1 : -1;

        if (sortField === 'name') {
          sortOptions.title = order;
        } else if (sortField === 'responses') {
          sortOptions.submissions = order;
        } else {
          sortOptions.updatedAt = order;
        }

        // Pagination
        const pageNum = Math.max(1, Number.parseInt(page || '1'));
        const limitNum = Math.min(50, Math.max(1, Number.parseInt(limit || '12')));
        const skip = (pageNum - 1) * limitNum;

        // Get total count
        const total = await Form.countDocuments(filter);

        // Get forms
        const forms = await Form.find(filter).sort(sortOptions).skip(skip).limit(limitNum).lean();

        return {
          success: true,
          forms: forms.map((form) => ({
            id: form._id.toString(),
            title: form.title,
            description: form.description,
            isPublished: form.isPublished,
            submissions: form.submissions,
            createdAt: form.createdAt,
            updatedAt: form.updatedAt,
          })),
          total,
          page: pageNum,
          totalPages: Math.ceil(total / limitNum),
        };
      } catch (error) {
        console.error('Get forms error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to get forms' };
      }
    },
    {
      query: t.Object({
        userId: t.String(),
        search: t.Optional(t.String()),
        sortBy: t.Optional(t.String()),
        sortOrder: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    }
  )

  // Get single form
  .get(
    '/:id',
    async ({ params, set }) => {
      try {
        const form = await Form.findById(params.id).lean();
        if (!form) {
          set.status = 404;
          return { success: false, message: 'Form not found' };
        }

        return {
          id: form._id.toString(),
          name: form.title,
          description: form.description,
          pages: form.settings?.pages || [{ id: 'page-1', name: 'Page 1', description: '' }],
          pageElements: form.settings?.pageElements || {},
          layoutType: form.settings?.layoutType || 'classic',
          layout: form.settings?.layout || null,
          fields: form.fields || [],
          settings: {
            rules: form.settings?.rules || [],
            workflows: form.settings?.workflows || [],
          },
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
        };
      } catch (error) {
        console.error('Get form error:', error);
        console.error('Error details:', {
          message: (error as Error).message,
          stack: (error as Error).stack,
          formId: params.id,
        });
        set.status = 500;
        return { success: false, message: 'Failed to get form' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Create new form
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const { userId, name, description, pages, layoutType, layout } = body;

        // Use provided userId or create a default one for now
        // TODO: Get from session/authentication
        const userObjectId = userId
          ? new mongoose.Types.ObjectId(userId)
          : new mongoose.Types.ObjectId('000000000000000000000000'); // Default placeholder

        const form = new Form({
          userId: userObjectId,
          title: name,
          description,
          fields: [], // Will be populated when building the form
          settings: {
            layoutType,
            layout,
            pages,
          },
        });
        await form.save();

        console.log('Form created successfully:', form._id.toString());

        return {
          id: form._id.toString(),
          form: {
            id: form._id.toString(),
            name: form.title,
            description: form.description,
            pages: pages,
            layoutType,
            layout,
          },
        };
      } catch (error) {
        console.error('Create form error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to create form' };
      }
    },
    {
      body: t.Object({
        userId: t.Optional(t.String()),
        name: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
        pages: t.Array(
          t.Object({
            id: t.String(),
            name: t.String(),
            description: t.String(),
          })
        ),
        layoutType: t.Union([t.Literal('classic'), t.Literal('card')]),
        layout: t.Optional(t.Any()),
      }),
    }
  )

  // Update form
  .put(
    '/:id',
    async ({ params, body, set }) => {
      try {
        const form = await Form.findByIdAndUpdate(
          params.id,
          { $set: body },
          { new: true, runValidators: true }
        );

        if (!form) {
          set.status = 404;
          return { success: false, message: 'Form not found' };
        }

        return {
          success: true,
          message: 'Form updated successfully',
          form: {
            id: form._id.toString(),
            title: form.title,
          },
        };
      } catch (error) {
        console.error('Update form error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to update form' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        fields: t.Optional(t.Array(t.Any())),
        settings: t.Optional(t.Any()),
        isPublished: t.Optional(t.Boolean()),
      }),
    }
  )

  // PATCH form (partial update for auto-save)
  .patch(
    '/:id',
    async ({ params, body, set }) => {
      try {
        const form = await Form.findByIdAndUpdate(
          params.id,
          { $set: body },
          { new: true, runValidators: false }
        );

        if (!form) {
          set.status = 404;
          return { success: false, message: 'Form not found' };
        }

        return {
          success: true,
          message: 'Form updated successfully',
          form: {
            id: form._id.toString(),
            title: form.title,
          },
        };
      } catch (error) {
        console.error('Patch form error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to update form' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        fields: t.Optional(t.Array(t.Any())),
        settings: t.Optional(t.Any()),
        isPublished: t.Optional(t.Boolean()),
      }),
    }
  )

  // Delete form
  .delete(
    '/:id',
    async ({ params, set }) => {
      try {
        const form = await Form.findByIdAndDelete(params.id);
        if (!form) {
          set.status = 404;
          return { success: false, message: 'Form not found' };
        }

        return {
          success: true,
          message: 'Form deleted successfully',
        };
      } catch (error) {
        console.error('Delete form error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to delete form' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Publish/Unpublish form
  .patch(
    '/:id/publish',
    async ({ params, body, set }) => {
      try {
        const { isPublished } = body;

        const form = await Form.findByIdAndUpdate(params.id, { isPublished }, { new: true });

        if (!form) {
          set.status = 404;
          return { success: false, message: 'Form not found' };
        }

        return {
          success: true,
          message: `Form ${isPublished ? 'published' : 'unpublished'} successfully`,
          form: {
            id: form._id.toString(),
            isPublished: form.isPublished,
          },
        };
      } catch (error) {
        console.error('Publish form error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to update publish status' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        isPublished: t.Boolean(),
      }),
    }
  );
