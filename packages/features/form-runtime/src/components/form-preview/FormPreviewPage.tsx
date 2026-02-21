/**
 * FormPreviewPage — Standalone preview page
 * Reads ?form= query param via useSearchParams, fetches the schema, and renders FormPreview.
 */
import { createSignal, onMount, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { useSearchParams, useNavigate } from '@solidjs/router';
import { FormPreview } from '@formanywhere/form-runtime';
import { Typography } from '@formanywhere/ui/typography';
import { CircularProgress } from '@formanywhere/ui/progress';
import type { FormSchema } from '@formanywhere/shared/types';

export const FormPreviewPage: Component = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [schema, setSchema] = createSignal<FormSchema | null>(null);
    const [loading, setLoading] = createSignal(true);
    const [error, setError] = createSignal('');

    onMount(async () => {
        const formId = searchParams.form;

        if (!formId) {
            setError('No form ID provided.');
            setLoading(false);
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const res = await fetch(`${API_URL}/api/forms/${formId}`, { credentials: 'include' });
            const data = await res.json();

            if (data.success && data.form?.schema) {
                setSchema(JSON.parse(data.form.schema));
            } else {
                setError('Form not found.');
            }
        } catch {
            setError('Failed to load form.');
        } finally {
            setLoading(false);
        }
    });

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
                        onBackToEditor={() => {
                            navigate(`/app?form=${searchParams.form}`);
                        }}
                    />
                )}
            </Show>
        </Show>
    );
};
