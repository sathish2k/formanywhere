/**
 * FormBuilderPage — Shared orchestrator for form building
 *
 * Composes:
 *   - BuilderHeader          (top app bar)
 *   - PageToolbar            (page navigation bar)
 *   - @formanywhere/form-editor  (editor panels)
 *   - @formanywhere/form-runtime (preview)
 */
import { createSignal, Show, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import {
    FormEditor,
    FormEditorLayout,
    AIFormBuilder,
    ImportForm,
} from '@formanywhere/form-editor';
import { FormPreview } from '@formanywhere/form-runtime';
import type { FormSchema } from '../../types';
import { generateId, go } from '../../utils';
import { BuilderHeader } from './header/BuilderHeader';
import { PageToolbar } from './page-toolbar/PageToolbar';
import type { PageTab } from './page-toolbar/PageToolbar';

export type BuilderMode = 'blank' | 'template' | 'import' | 'ai';

export interface FormBuilderPageProps {
    /** The creation mode */
    mode?: BuilderMode;
    /** Form ID for editing existing forms */
    formId?: string;
    /** Template schema to pre-fill */
    templateSchema?: FormSchema;
}

export const FormBuilderPage: Component<FormBuilderPageProps> = (props) => {
    const mode = () => props.mode ?? 'blank';
    const [schema, setSchema] = createSignal<FormSchema | null>(null);
    const [previewing, setPreviewing] = createSignal(false);
    const [saving, setSaving] = createSignal(false);
    const [showOverlay, setShowOverlay] = createSignal<'ai' | 'import' | null>(null);

    // Page management
    const [pages, setPages] = createSignal<PageTab[]>([{ id: generateId(), title: 'Page 1' }]);
    const [activePageId, setActivePageId] = createSignal<string>('');

    onMount(() => {
        const firstPage = pages()[0];
        if (firstPage) setActivePageId(firstPage.id);

        if (mode() === 'ai') {
            setShowOverlay('ai');
        } else if (mode() === 'import') {
            setShowOverlay('import');
        } else if (mode() === 'template' && props.templateSchema) {
            setSchema({ ...props.templateSchema, id: generateId(), updatedAt: new Date() });
        } else if (props.formId) {
            loadExistingForm(props.formId);
        }
    });

    const loadExistingForm = async (formId: string) => {
        try {
            const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4000';
            const res = await fetch(`${API_URL}/forms/${formId}`);
            const data = await res.json();
            if (data.success && data.form?.schema) {
                setSchema(JSON.parse(data.form.schema));
            }
        } catch (e) {
            console.error('Failed to load form:', e);
        }
    };

    const handleSchemaChange = (updated: FormSchema) => setSchema(updated);
    const handleOverlayResult = (s: FormSchema) => { setSchema(s); setShowOverlay(null); };
    const handleOverlayCancel = () => { setShowOverlay(null); if (!schema()) go('/dashboard'); };

    // Page management handlers
    const addPage = () => {
        const p: PageTab = { id: generateId(), title: `Page ${pages().length + 1}` };
        setPages((prev) => [...prev, p]);
        setActivePageId(p.id);
    };

    const duplicatePage = (pageId: string) => {
        const page = pages().find((p) => p.id === pageId);
        if (!page) return;
        const dup: PageTab = { id: generateId(), title: `${page.title} (Copy)` };
        const idx = pages().findIndex((p) => p.id === pageId);
        setPages((prev) => [...prev.slice(0, idx + 1), dup, ...prev.slice(idx + 1)]);
        setActivePageId(dup.id);
    };

    const deletePage = (pageId: string) => {
        if (pages().length <= 1) return;
        const idx = pages().findIndex((p) => p.id === pageId);
        setPages((prev) => prev.filter((p) => p.id !== pageId));
        if (activePageId() === pageId) {
            const remaining = pages().filter((p) => p.id !== pageId);
            setActivePageId(remaining[Math.min(idx, remaining.length - 1)]?.id ?? '');
        }
    };

    const handleSave = async () => {
        const currentSchema = schema();
        if (!currentSchema) return;
        setSaving(true);
        try {
            const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4000';
            const endpoint = props.formId
                ? `${API_URL}/forms/${props.formId}`
                : `${API_URL}/forms`;
            await fetch(endpoint, {
                method: props.formId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: currentSchema.name,
                    description: currentSchema.description,
                    schema: JSON.stringify(currentSchema),
                }),
            });
            go('/dashboard');
        } catch (e) {
            console.error('Failed to save form:', e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div class="form-builder-page">
            <BuilderHeader
                formName={schema()?.name ?? 'New Form'}
                previewing={previewing()}
                saving={saving()}
                hasSchema={!!schema()}
                onTogglePreview={() => setPreviewing(!previewing())}
                onSave={handleSave}
                onBack={() => go('/dashboard')}
            />

            <Show when={!showOverlay() && !previewing()}>
                <PageToolbar
                    pages={pages()}
                    activePageId={activePageId()}
                    onSetActivePage={setActivePageId}
                    onAddPage={addPage}
                    onDuplicatePage={duplicatePage}
                    onDeletePage={deletePage}
                />
            </Show>

            {/* Overlay: AI / Import */}
            <Show when={showOverlay() === 'ai'}>
                <AIFormBuilder onGenerated={handleOverlayResult} onCancel={handleOverlayCancel} />
            </Show>
            <Show when={showOverlay() === 'import'}>
                <ImportForm onImport={handleOverlayResult} onCancel={handleOverlayCancel} />
            </Show>

            {/* Main content */}
            <Show when={!showOverlay()}>
                <Show
                    when={!previewing()}
                    fallback={
                        <Show when={schema()}>
                            {(s) => (
                                <FormPreview
                                    schema={s()}
                                    onBackToEditor={() => setPreviewing(false)}
                                    onSubmit={(data) => console.log('[preview]', data)}
                                />
                            )}
                        </Show>
                    }
                >
                    <FormEditor initialSchema={schema() ?? undefined} onChange={handleSchemaChange}>
                        <FormEditorLayout />
                    </FormEditor>
                </Show>
            </Show>
        </div>
    );
};
