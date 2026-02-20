/**
 * FormPreviewPage — Standalone preview page
 * Reads ?form= query param, fetches the schema, and renders FormPreview.
 */
import { createSignal, onMount, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { FormPreview } from '@formanywhere/form-runtime';
import { Typography } from '@formanywhere/ui/typography';
import { CircularProgress } from '@formanywhere/ui/progress';
import type { FormSchema } from '@formanywhere/shared/types';
import { go } from '@formanywhere/shared/utils';

export const FormPreviewPage: Component = () => {
    const [schema, setSchema] = createSignal<FormSchema | null>(null);
    const [loading, setLoading] = createSignal(true);
    const [error, setError] = createSignal('');

    onMount(async () => {
        const params = new URLSearchParams(window.location.search);
        const formId = params.get('form');

        if (!formId) {
            setError('No form ID provided.');
            setLoading(false);
            return;
        }

        try {
            const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4000';
            const res = await fetch(`${API_URL}/forms/${formId}`);
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
                            const params = new URLSearchParams(window.location.search);
                            go(`/app?form=${params.get('form')}`);
                        }}
                    />
                )}
            </Show>
        </Show>
    );
};
