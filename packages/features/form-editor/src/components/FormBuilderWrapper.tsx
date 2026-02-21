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

    const mode = (): BuilderMode => {
        const m = searchParams.mode;
        if (m === 'ai' || m === 'blank' || m === 'template' || m === 'import') {
            return m;
        }
        return 'blank';
    };

    return (
        <FormBuilderPage
            mode={mode()}
            formId={(searchParams.form as string) || undefined}
            initialName={(searchParams.name as string) || undefined}
            initialDescription={(searchParams.desc as string) || undefined}
        />
    );
};
