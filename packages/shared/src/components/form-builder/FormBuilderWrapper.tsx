/**
 * FormBuilderWrapper — Island wrapper
 * Reads URL query params on the client and passes them
 * to the FormBuilderPage component.
 */
import { createSignal, onMount, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { FormBuilderPage } from './FormBuilderPage';
import type { BuilderMode } from './FormBuilderPage';

export const FormBuilderWrapper: Component = () => {
    const [mode, setMode] = createSignal<BuilderMode>('blank');
    const [formId, setFormId] = createSignal<string | undefined>(undefined);
    const [ready, setReady] = createSignal(false);

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        const m = params.get('mode');
        if (m === 'ai' || m === 'blank' || m === 'template' || m === 'import') {
            setMode(m);
        }
        const fid = params.get('form');
        if (fid) setFormId(fid);
        setReady(true);
    });

    return (
        <Show when={ready()}>
            <FormBuilderPage mode={mode()} formId={formId()} />
        </Show>
    );
};
