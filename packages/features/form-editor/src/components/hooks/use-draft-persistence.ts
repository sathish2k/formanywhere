/**
 * useDraftPersistence — LocalStorage draft autosave / restore for FormBuilderPage.
 *
 * Saves schema, rules, workflows, and form settings to localStorage with
 * debounced writes. Restores on mount if the draft is < 24 h old.
 */
import { createEffect } from 'solid-js';
import type { Accessor } from 'solid-js';
import type { FormSchema, FormRule, FormWorkflow } from '@formanywhere/shared/types';
import type { FormSettings } from '../dialogs/FormSettingsDialog';

export interface UseDraftPersistenceOptions {
    /** Storage key suffix (usually formId or 'new') */
    formId: string | undefined;
    schema: Accessor<FormSchema | null>;
    formRules: Accessor<FormRule[]>;
    workflows: Accessor<FormWorkflow[]>;
    formSettings: Accessor<FormSettings>;
}

export interface DraftRestorePayload {
    schema?: FormSchema;
    rules?: FormRule[];
    workflows?: FormWorkflow[];
    settings?: FormSettings;
}

export interface DraftPersistenceState {
    /** Try to restore a draft. Returns the payload if successful, null otherwise. */
    restoreDraft: () => DraftRestorePayload | null;
    /** Clear the draft from localStorage. */
    clearDraft: () => void;
}

const AUTOSAVE_INTERVAL = 5_000; // 5 seconds

export function useDraftPersistence(opts: UseDraftPersistenceOptions): DraftPersistenceState {
    const key = `formanywhere_draft_${opts.formId ?? 'new'}`;
    let autosaveTimer: ReturnType<typeof setTimeout> | null = null;

    const saveDraft = () => {
        const s = opts.schema();
        if (!s) return;
        try {
            localStorage.setItem(key, JSON.stringify({
                schema: s,
                rules: opts.formRules(),
                workflows: opts.workflows(),
                settings: opts.formSettings(),
                savedAt: Date.now(),
            }));
        } catch { /* quota exceeded — silently fail */ }
    };

    // Debounced autosave whenever schema changes
    createEffect(() => {
        const s = opts.schema();
        if (!s) return;
        if (autosaveTimer) clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(saveDraft, AUTOSAVE_INTERVAL);
    });

    const restoreDraft = (): DraftRestorePayload | null => {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const draft = JSON.parse(raw);
            if (Date.now() - (draft.savedAt ?? 0) > 86_400_000) {
                localStorage.removeItem(key);
                return null;
            }
            return {
                schema: draft.schema,
                rules: draft.rules,
                workflows: draft.workflows,
                settings: draft.settings,
            };
        } catch { return null; }
    };

    const clearDraft = () => {
        try { localStorage.removeItem(key); } catch { /* noop */ }
    };

    return { restoreDraft, clearDraft };
}
