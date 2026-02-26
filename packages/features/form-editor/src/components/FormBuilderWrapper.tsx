/**
 * FormBuilderWrapper — Island wrapper
 * Reads URL query params via useSearchParams and passes them
 * to the FormBuilderPage component.
 */
import type { Component } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import { FormBuilderPage } from './FormBuilderPage';
import type { BuilderMode } from './FormBuilderPage';

export const FormBuilderWrapper: Component = () => {
    const [searchParams] = useSearchParams();

    // When coming from FormSetupPage it stores data in sessionStorage and
    // navigates with ?setup=true — read it synchronously so we can pass the
    // correct name/description before FormEditor ever mounts.
    const setupData = (() => {
        if (searchParams.setup !== 'true') return null;
        try {
            const raw = sessionStorage.getItem('formanywhere_form_setup');
            if (!raw) return null;
            const data = JSON.parse(raw);
            // Clear it so stale data doesn't bleed into the next new form
            sessionStorage.removeItem('formanywhere_form_setup');
            return data;
        } catch { return null; }
    })();

    const mode = (): BuilderMode => {
        const m = searchParams.mode;
        if (m === 'ai' || m === 'blank' || m === 'template' || m === 'import') {
            return m;
        }
        return 'blank';
    };

    // Map FormSetupPage's PageData[] (name field) → FormBuilderPage's PageTab[] (title field)
    const initialPages = setupData?.pages?.map((p: { id: string; name: string }) => ({
        id: p.id,
        title: p.name,
    })) || undefined;

    return (
        <FormBuilderPage
            mode={mode()}
            formId={(searchParams.form as string) || undefined}
            templateId={(searchParams.template as string) || undefined}
            initialName={(searchParams.name as string) || setupData?.name || undefined}
            initialDescription={(searchParams.desc as string) || setupData?.description || undefined}
            initialPages={initialPages}
        />
    );
};
