/**
 * FormPreviewPage — Standalone preview page
 * Reads ?form= or ?template= query param, fetches the schema, and renders FormPreview.
 * - ?form=<id>      → fetch from /api/forms/:id   (authenticated)
 * - ?template=<id>  → fetch from /api/templates/:id (public)
 */
import { createSignal, onMount, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { useSearchParams, useNavigate } from '@solidjs/router';
import { FormPreview } from '../../renderer/FormPreview';
import { Typography } from '@formanywhere/ui/typography';
import { CircularProgress } from '@formanywhere/ui/progress';
import type { FormSchema } from '@formanywhere/shared/types';
import { fetchWithAuth } from '@formanywhere/shared/auth-client';

export const FormPreviewPage: Component = () => {
    console.log('FormPreviewPage mounted');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [schema, setSchema] = createSignal<FormSchema | null>(null);
    const [loading, setLoading] = createSignal(true);
    const [error, setError] = createSignal('');

    onMount(async () => {
        const formId = searchParams.form;
        const templateId = searchParams.template;

        if (!formId && !templateId) {
            setError('No form or template ID provided.');
            setLoading(false);
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

            if (templateId) {
                // Public endpoint — no auth required
                const res = await fetch(`${API_URL}/api/templates/${templateId}`);
                const data = await res.json();
                if (data.success && data.template?.schema) {
                    setSchema(data.template.schema as FormSchema);
                } else {
                    setError('Template not found.');
                }
            } else {
                // Authenticated form endpoint
                const res = await fetchWithAuth(`${API_URL}/api/forms/${formId}`);
                const data = await res.json();
                console.log('FormPreviewPage mounted');
                if (data.success && data.form?.schema) {
                    console.log('Fetched form schema:', JSON.parse(data.form.schema));
                    setSchema(JSON.parse(data.form.schema));
                } else {
                    setError('Form not found.');
                }
            }
        } catch {
            setError('Failed to load form.');
        } finally {
            setLoading(false);
        }
    });

    const handleBack = () => {
        if (searchParams.template) {
            // Came from template browser — go back there
            navigate('/templates');
        } else {
            navigate(`/app?form=${searchParams.form}`);
        }
    };

    return (
        <Show
            when={!loading()}
            fallback={
                <div style={{ display: 'flex', 'align-items': 'center', 'justify-content': 'center', 'min-height': '100vh', gap: '12px', 'flex-direction': 'column' }}>
                    <CircularProgress indeterminate />
                    <Typography variant="body-medium" color="on-surface-variant">Loading form...</Typography>
                </div>
            }
        >
            <Show
                when={schema()}
                fallback={
                    <div style={{ 'text-align': 'center', padding: '64px 16px' }}>
                        <Typography variant="title-large" color="on-surface-variant">{error()}</Typography>
                    </div>
                }
            >
                {(s) => (
                    <FormPreview
                        schema={s()}
                        onBackToEditor={handleBack}
                        backLabel={searchParams.template ? 'Back to Templates' : 'Back to Editor'}
                    />
                )}
            </Show>
        </Show>
    );
};

