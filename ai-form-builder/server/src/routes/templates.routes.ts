/**
 * Templates Routes
 * Template listing and usage endpoints
 */

import { Elysia, t } from 'elysia';
import mongoose from 'mongoose';
import { Form, Template } from '../models';

export const templatesRoutes = new Elysia({ prefix: '/templates' })
  // Get all templates
  .get(
    '/',
    async ({ query }) => {
      try {
        const { category, popular, search } = query;

        const filter: Record<string, unknown> = {};
        if (category && category !== 'all') {
          filter.category = category;
        }
        if (popular === 'true') {
          filter.popular = true;
        }
        if (search) {
          filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ];
        }

        const templates = await Template.find(filter).sort({ uses: -1 }).lean();

        return {
          success: true,
          templates: templates.map((template) => ({
            id: template._id.toString(),
            name: template.name,
            description: template.description,
            category: template.category,
            popular: template.popular,
            uses: template.uses.toLocaleString(),
            fields: template.fields.map((f) => f.label),
          })),
        };
      } catch (error) {
        console.error('Get templates error:', error);
        return { success: false, message: 'Failed to get templates', templates: [] };
      }
    },
    {
      query: t.Object({
        category: t.Optional(t.String()),
        popular: t.Optional(t.String()),
        search: t.Optional(t.String()),
      }),
    }
  )

  // Get single template
  .get(
    '/:id',
    async ({ params, set }) => {
      try {
        const template = await Template.findById(params.id).lean();
        if (!template) {
          set.status = 404;
          return { success: false, message: 'Template not found' };
        }

        return {
          success: true,
          template: {
            id: template._id.toString(),
            name: template.name,
            description: template.description,
            category: template.category,
            fields: template.fields,
            popular: template.popular,
            uses: template.uses,
          },
        };
      } catch (error) {
        console.error('Get template error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to get template' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Use template (create form from template)
  .post(
    '/:id/use',
    async ({ params, body, set }) => {
      try {
        const template = await Template.findById(params.id);
        if (!template) {
          set.status = 404;
          return { success: false, message: 'Template not found' };
        }

        // Create form from template
        const form = new Form({
          userId: new mongoose.Types.ObjectId(body.userId),
          title: template.name,
          description: template.description,
          fields: template.fields,
          settings: {},
        });
        await form.save();

        // Increment template uses
        await Template.findByIdAndUpdate(params.id, { $inc: { uses: 1 } });

        return {
          success: true,
          message: 'Form created from template',
          form: {
            id: form._id.toString(),
            title: form.title,
          },
        };
      } catch (error) {
        console.error('Use template error:', error);
        set.status = 500;
        return { success: false, message: 'Failed to use template' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        userId: t.String(),
      }),
    }
  );
