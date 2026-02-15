/**
 * Form Setup — Island Wrapper
 * Reads URL query params and passes them to FormSetupPage.
 */
import { createSignal, onMount, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { FormSetupPage } from '@formanywhere/shared/form-setup';
import type { FormSetupPageProps } from '@formanywhere/shared/form-setup';

export const FormSetupWrapper: Component = () => {
    const [mode, setMode] = createSignal<FormSetupPageProps['mode']>('blank');
    const [ready, setReady] = createSignal(false);

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        const m = params.get('mode');
        if (m === 'ai' || m === 'blank' || m === 'template' || m === 'import') {
            setMode(m);
        }
        setReady(true);
    });

    return (
        <Show when={ready()}>
            <FormSetupPage mode={mode()} />
        </Show>
    );
};
