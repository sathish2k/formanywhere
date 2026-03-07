/**
 * useFormSave — Save, publish, and load logic for FormBuilderPage.
 *
 * Handles:
 *   - Loading an existing form from the API
 *   - Loading a template (by schema or by ID)
 *   - Saving / publishing a form
 *   - Mapping FormSettings to schema-level settings
 *   - Schema validation before publish
 */
import { createSignal } from 'solid-js';
import type { Accessor, Setter } from 'solid-js';
import type { FormSchema, FormRule, FormWorkflow } from '@formanywhere/shared/types';
import { generateId, go } from '@formanywhere/shared/utils';
import { fetchWithAuth } from '@formanywhere/shared/auth-client';
import { validateSchema } from '@formanywhere/domain/form';
import type { FormSettings } from '../dialogs/FormSettingsDialog';
import type { PageTab } from '../page-toolbar/PageToolbar';

export interface UseFormSaveOptions {
    formId: string | undefined;
    schema: Accessor<FormSchema | null>;
    setSchema: Setter<FormSchema | null>;
    formRules: Accessor<FormRule[]>;
    setFormRules: Setter<FormRule[]>;
    workflows: Accessor<FormWorkflow[]>;
    setWorkflows: Setter<FormWorkflow[]>;
    formSettings: Accessor<FormSettings>;
    setFormSettings: Setter<FormSettings>;
    pages: Accessor<PageTab[]>;
    syncPagesFromSchema: (s: FormSchema) => void;
    clearDraft: () => void;
}

export interface FormSaveState {
    saving: Accessor<boolean>;
    validationErrors: Accessor<string[]>;
    setValidationErrors: Setter<string[]>;
    handleSave: () => Promise<void>;
    loadExistingForm: (formId: string) => Promise<void>;
    loadTemplateById: (templateId: string) => Promise<void>;
    buildSettingsFromFormSettings: (fs: FormSettings) => Record<string, unknown>;
}

/** Map FormSettings dialog values into schema-level settings */
function buildSettingsFromFormSettings(fs: FormSettings): Record<string, unknown> {
    return {
        theme: {
            primaryColor: fs.primaryColor,
            secondaryColor: fs.secondaryColor,
            backgroundColor: fs.backgroundColor,
            surfaceColor: fs.surfaceColor,
            borderRadius: fs.borderRadius,
            fontFamily: fs.fontFamily,
        },
        customCSS: fs.customCSS,
        googleFontUrl: fs.googleFontUrl,
        customHeadTags: fs.customHeadTags,
        externalCSS: fs.externalCSS,
        externalJS: fs.externalJS,
        successHeading: fs.successHeading,
        successMessage: fs.successMessage,
        successShowData: fs.successShowData,
        successButtonText: fs.successButtonText,
        successButtonUrl: fs.successButtonUrl,
        redirectUrl: fs.redirectUrl,
        redirectDelay: fs.redirectDelay,
    };
}

export function useFormSave(opts: UseFormSaveOptions): FormSaveState {
    const [saving, setSaving] = createSignal(false);
    const [validationErrors, setValidationErrors] = createSignal<string[]>([]);

    const loadTemplateById = async (templateId: string) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const res = await fetch(`${API_URL}/api/templates/${templateId}`);
            if (!res.ok) return;
            const data = await res.json();
            if (!data.success || !data.template?.schema) return;
            const templateSchema = typeof data.template.schema === 'string'
                ? JSON.parse(data.template.schema)
                : data.template.schema;
            templateSchema.id = generateId();
            templateSchema.updatedAt = new Date();
            if (data.template.name) templateSchema.name = data.template.name;
            if (data.template.description) templateSchema.description = data.template.description;
            opts.setSchema(templateSchema);
            opts.syncPagesFromSchema(templateSchema);
            if (templateSchema.rules) opts.setFormRules(templateSchema.rules);
            if (templateSchema.workflows) opts.setWorkflows(templateSchema.workflows);
        } catch (err) {
            console.error('Failed to load template:', err);
        }
    };

    const loadExistingForm = async (formId: string) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const res = await fetchWithAuth(`${API_URL}/api/forms/${formId}`);
            const data = await res.json();
            if (!data.success || !data.form) return;

            if (data.form.schema) {
                const loadedSchema = typeof data.form.schema === 'string'
                    ? JSON.parse(data.form.schema)
                    : data.form.schema;
                if (data.form.title) loadedSchema.name = data.form.title;
                if (data.form.description) loadedSchema.description = data.form.description;
                opts.setSchema(loadedSchema);
                opts.syncPagesFromSchema(loadedSchema);
                if (loadedSchema.rules) opts.setFormRules(loadedSchema.rules);
                if (loadedSchema.workflows) opts.setWorkflows(loadedSchema.workflows);
            } else {
                opts.setSchema({
                    id: formId,
                    name: data.form.title || 'Untitled Form',
                    description: data.form.description || '',
                    elements: [],
                    settings: {
                        pages: opts.pages().map((p) => ({ id: p.id, title: p.title, elements: [] })),
                        submitButtonText: 'Submit',
                        successMessage: 'Thank you!',
                    },
                    version: 1,
                    createdAt: new Date(data.form.createdAt || Date.now()),
                    updatedAt: new Date(),
                } as FormSchema);
            }
        } catch (e) {
            console.error('Failed to load form:', e);
        }
    };

    const handleSave = async () => {
        const currentSchema = opts.schema();
        if (!currentSchema) return;

        const schemaToSave: FormSchema = {
            ...currentSchema,
            name: currentSchema.name || 'Untitled Form',
            rules: opts.formRules(),
            workflows: opts.workflows(),
            settings: {
                ...currentSchema.settings,
                ...buildSettingsFromFormSettings(opts.formSettings()),
                pages: currentSchema.settings.pages,
                multiPage: (currentSchema.settings.pages?.length ?? 0) > 1,
            },
        };

        const validation = validateSchema(schemaToSave);
        if (!validation.valid) {
            setValidationErrors(validation.errors);
            return;
        }
        setValidationErrors([]);

        setSaving(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const endpoint = opts.formId
                ? `${API_URL}/api/forms/${opts.formId}`
                : `${API_URL}/api/forms`;
            await fetchWithAuth(endpoint, {
                method: opts.formId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: schemaToSave.name,
                    description: schemaToSave.description,
                    schema: JSON.stringify(schemaToSave),
                }),
            });
            opts.clearDraft();
            go('/dashboard');
        } catch (e) {
            console.error('Failed to save form:', e);
        } finally {
            setSaving(false);
        }
    };

    return {
        saving,
        validationErrors,
        setValidationErrors,
        handleSave,
        loadExistingForm,
        loadTemplateById,
        buildSettingsFromFormSettings,
    };
}
