/**
 * FormBuilderPage — Shared orchestrator for form building
 *
 * Composes:
 *   - BuilderHeader          (top app bar)
 *   - PageToolbar            (page navigation bar)
 *   - LogicDialog            (conditional logic rules)
 *   - WorkflowDialog         (visual workflow builder)
 *   - SchemaDialog           (view JSON schema)
 *   - IntegrationsDialog     (external service connections)
 *   - @formanywhere/form-editor  (editor panels)
 *   - @formanywhere/form-runtime (preview)
 */
import { splitProps, createSignal, Show, For, onMount, createEffect } from 'solid-js';
import type { Component } from 'solid-js';
import { FormEditor } from './FormEditor';
import { FormEditorLayout } from './layout/FormEditorLayout';
import { AIFormBuilder } from './ai/AIFormBuilder';
import { ImportForm } from './import/ImportForm';
import { FormPreview } from '@formanywhere/form-runtime';
import type { FormSchema, FormRule } from '@formanywhere/shared/types';
import { generateId, go } from '@formanywhere/shared/utils';
import { validateSchema } from '../engine/schema';
import { BuilderHeader } from './header/BuilderHeader';
import { PageToolbar } from './page-toolbar/PageToolbar';
import type { PageTab } from './page-toolbar/PageToolbar';
import { LogicDialog } from './dialogs/LogicDialog';
import { WorkflowDialog } from './dialogs/WorkflowDialog';
import { SchemaDialog } from './dialogs/SchemaDialog';
import { IntegrationsDialog } from './dialogs/IntegrationsDialog';
import { FormSettingsDialog } from './dialogs/FormSettingsDialog';
import { LogicDebuggerDialog } from './dialogs/LogicDebuggerDialog';
import type { FormSettings } from './dialogs/FormSettingsDialog';
import { LayoutBuilder } from '@formanywhere/shared/form-setup/layout-builder';
import type { LayoutConfig } from '@formanywhere/shared/form-setup/layout-builder/types';
import './form-builder.scss';

export type BuilderMode = 'blank' | 'template' | 'import' | 'ai';

export interface FormBuilderPageProps {
    /** The creation mode */
    mode?: BuilderMode;
    /** Form ID for editing existing forms */
    formId?: string;
    /** Template schema to pre-fill */
    templateSchema?: FormSchema;
    /** Initial form name (from URL param) */
    initialName?: string;
    /** Initial form description (from URL param) */
    initialDescription?: string;
}

export const FormBuilderPage: Component<FormBuilderPageProps> = (props) => {
    const [local] = splitProps(props, ['formId', 'mode', 'templateSchema', 'initialName', 'initialDescription']);
    const mode = () => local.mode ?? 'blank';
    const [schema, setSchema] = createSignal<FormSchema | null>(null);
    const [previewing, setPreviewing] = createSignal(false);
    const [saving, setSaving] = createSignal(false);
    const [showOverlay, setShowOverlay] = createSignal<'ai' | 'import' | null>(null);
    const [validationErrors, setValidationErrors] = createSignal<string[]>([]);

    // Page management
    const [pages, setPages] = createSignal<PageTab[]>([{ id: generateId(), title: 'Page 1' }]);
    const [activePageId, setActivePageId] = createSignal<string>('');

    // Layout Builder overlay
    const [layoutBuilderOpen, setLayoutBuilderOpen] = createSignal(false);
    const [layoutConfig, setLayoutConfig] = createSignal<LayoutConfig | null>(null);

    // Dialog state
    const [logicOpen, setLogicOpen] = createSignal(false);
    const [workflowOpen, setWorkflowOpen] = createSignal(false);
    const [schemaDialogOpen, setSchemaDialogOpen] = createSignal(false);
    const [integrationsOpen, setIntegrationsOpen] = createSignal(false);
    const [formSettingsOpen, setFormSettingsOpen] = createSignal(false);
    const [debuggerOpen, setDebuggerOpen] = createSignal(false);
    const [formRules, setFormRules] = createSignal<FormRule[]>([]);
    const [formSettings, setFormSettings] = createSignal<FormSettings>({
        // M3 baseline palette defaults — data values for user-customizable theme, not CSS styling
        primaryColor: '#6750A4',
        secondaryColor: '#625B71',
        backgroundColor: '#FFFBFE',
        surfaceColor: '#FFFFFF',
        borderRadius: 12,
        fontFamily: 'Inter',
        customCSS: '',
        googleFontUrl: '',
        customHeadTags: '',
        externalCSS: [],
        externalJS: [],
        successHeading: 'Thank You!',
        successMessage: 'Your response has been recorded.',
        successShowData: false,
        successButtonText: '',
        successButtonUrl: '',
        redirectUrl: '',
        redirectDelay: 0,
    });

    // Rule management handlers
    const addRule = (rule: FormRule) => setFormRules((prev) => [...prev, rule]);
    const updateRule = (id: string, rule: FormRule) => setFormRules((prev) => prev.map((r) => r.id === id ? rule : r));
    const deleteRule = (id: string) => setFormRules((prev) => prev.filter((r) => r.id !== id));

    // ── Autosave to localStorage (debounced) ──────────────────────────────
    const AUTOSAVE_KEY = `formanywhere_draft_${local.formId ?? 'new'}`;
    const AUTOSAVE_INTERVAL = 5_000; // 5 seconds
    let autosaveTimer: ReturnType<typeof setTimeout> | null = null;

    const saveDraft = () => {
        const s = schema();
        if (!s) return;
        try {
            localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
                schema: s,
                rules: formRules(),
                settings: formSettings(),
                savedAt: Date.now(),
            }));
        } catch { /* quota exceeded — silently fail */ }
    };

    createEffect(() => {
        // Track changes to schema signal
        const s = schema();
        if (!s) return;
        // Debounce autosave
        if (autosaveTimer) clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(saveDraft, AUTOSAVE_INTERVAL);
    });

    /** Try to restore a draft from localStorage on mount */
    const restoreDraft = (): boolean => {
        try {
            const raw = localStorage.getItem(AUTOSAVE_KEY);
            if (!raw) return false;
            const draft = JSON.parse(raw);
            // Only restore if less than 24h old
            if (Date.now() - (draft.savedAt ?? 0) > 86_400_000) {
                localStorage.removeItem(AUTOSAVE_KEY);
                return false;
            }
            if (draft.schema) setSchema(draft.schema);
            if (draft.rules) setFormRules(draft.rules);
            if (draft.settings) setFormSettings(draft.settings);
            return true;
        } catch { return false; }
    };

    const clearDraft = () => {
        try { localStorage.removeItem(AUTOSAVE_KEY); } catch { /* noop */ }
    };

    /** Handle inline form rename from the header */
    const handleFormNameChange = (name: string) => {
        setSchema((prev) => prev ? { ...prev, name } : prev);
    };

    /** Handle layout builder save */
    const handleLayoutSave = (layout: LayoutConfig) => {
        setLayoutConfig(layout);
        setLayoutBuilderOpen(false);
        // Store layout config in schema settings
        setSchema((prev) => {
            if (!prev) return prev;
            return { ...prev, settings: { ...prev.settings, layout } };
        });
    };

    onMount(() => {
        const firstPage = pages()[0];
        if (firstPage) setActivePageId(firstPage.id);

        // Ensure schema has pages entry
        syncPagesToSchema();

        // Apply initial name/description from URL params
        if (local.initialName) {
            setSchema((prev) => {
                const base = prev ?? { id: generateId(), name: '', description: '', elements: [], settings: { pages: [], submitButtonText: 'Submit', successMessage: 'Thank you!' }, version: 1, createdAt: new Date(), updatedAt: new Date() } as FormSchema;
                return { ...base, name: local.initialName!, description: local.initialDescription ?? base.description ?? '' };
            });
        }

        if (mode() === 'ai') {
            setShowOverlay('ai');
        } else if (mode() === 'import') {
            setShowOverlay('import');
        } else if (mode() === 'template' && local.templateSchema) {
            setSchema({ ...local.templateSchema, id: generateId(), updatedAt: new Date() });
        } else if (local.formId) {
            loadExistingForm(local.formId);
        } else {
            // For blank mode, try restoring a draft
            restoreDraft();
        }
    });

    const loadExistingForm = async (formId: string) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const res = await fetch(`${API_URL}/api/forms/${formId}`, { credentials: 'include' });
            const data = await res.json();
            if (!data.success || !data.form) return;

            if (data.form.schema) {
                // Form has saved schema JSON — load it
                const loadedSchema = typeof data.form.schema === 'string'
                    ? JSON.parse(data.form.schema)
                    : data.form.schema;
                // Merge API-level title/description into schema so the header shows the correct name
                if (data.form.title) loadedSchema.name = data.form.title;
                if (data.form.description) loadedSchema.description = data.form.description;
                setSchema(loadedSchema);
                if (loadedSchema.rules) setFormRules(loadedSchema.rules);
            } else {
                // Freshly created form with no schema yet — initialize a blank schema with API title
                setSchema({
                    id: formId,
                    name: data.form.title || 'Untitled Form',
                    description: data.form.description || '',
                    elements: [],
                    settings: {
                        pages: pages().map((p) => ({ id: p.id, title: p.title, elements: [] })),
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

    const handleSchemaChange = (updated: FormSchema) => setSchema(updated);
    const handleOverlayResult = (s: FormSchema) => { setSchema(s); setShowOverlay(null); };
    const handleOverlayCancel = () => { setShowOverlay(null); if (!schema()) go('/dashboard'); };

    /** Keep schema.settings.pages in sync with page tabs */
    const syncPagesToSchema = () => {
        setSchema((prev) => {
            if (!prev) return prev;
            const formPages = pages().map((p) => {
                const existing = prev.settings.pages?.find((ep) => ep.id === p.id);
                return { id: p.id, title: p.title, elements: existing?.elements ?? [] };
            });
            return { ...prev, settings: { ...prev.settings, pages: formPages, multiPage: pages().length > 1 } };
        });
    };

    // Page management handlers
    const addPage = () => {
        const p: PageTab = { id: generateId(), title: `Page ${pages().length + 1}` };
        setPages((prev) => [...prev, p]);
        setActivePageId(p.id);
        syncPagesToSchema();
    };

    const duplicatePage = (pageId: string) => {
        const page = pages().find((p) => p.id === pageId);
        if (!page) return;
        const dup: PageTab = { id: generateId(), title: `${page.title} (Copy)` };
        const idx = pages().findIndex((p) => p.id === pageId);
        setPages((prev) => [...prev.slice(0, idx + 1), dup, ...prev.slice(idx + 1)]);
        setActivePageId(dup.id);
        syncPagesToSchema();
    };

    const deletePage = (pageId: string) => {
        if (pages().length <= 1) return;
        const idx = pages().findIndex((p) => p.id === pageId);
        setPages((prev) => prev.filter((p) => p.id !== pageId));
        if (activePageId() === pageId) {
            const remaining = pages().filter((p) => p.id !== pageId);
            setActivePageId(remaining[Math.min(idx, remaining.length - 1)]?.id ?? '');
        }
        syncPagesToSchema();
    };

    const editPage = (pageId: string) => {
        // Legacy fallback — handled by PageToolbar's onRenamePage dialog now
        const page = pages().find((p) => p.id === pageId);
        if (!page) return;
    };

    const renamePage = (pageId: string, newTitle: string) => {
        if (newTitle.trim()) {
            setPages((prev) => prev.map((p) => p.id === pageId ? { ...p, title: newTitle.trim() } : p));
        }
    };

    const handleSave = async () => {
        const currentSchema = schema();
        if (!currentSchema) return;

        // Merge rules and form settings into schema before saving
        const schemaToSave: FormSchema = {
            ...currentSchema,
            name: currentSchema.name || 'Untitled Form',
            rules: formRules(),
            settings: {
                ...currentSchema.settings,
                ...buildSettingsFromFormSettings(formSettings()),
                pages: currentSchema.settings.pages,
                multiPage: (currentSchema.settings.pages?.length ?? 0) > 1,
            },
        };

        // Validate schema before publishing
        const validation = validateSchema(schemaToSave);
        if (!validation.valid) {
            setValidationErrors(validation.errors);
            return;
        }
        setValidationErrors([]);

        setSaving(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const endpoint = local.formId
                ? `${API_URL}/api/forms/${local.formId}`
                : `${API_URL}/api/forms`;
            await fetch(endpoint, {
                method: local.formId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title: schemaToSave.name,
                    description: schemaToSave.description,
                    schema: JSON.stringify(schemaToSave),
                }),
            });
            clearDraft();
            go('/dashboard');
        } catch (e) {
            console.error('Failed to save form:', e);
        } finally {
            setSaving(false);
        }
    };

    /** Map FormSettings dialog values into schema-level settings */
    const buildSettingsFromFormSettings = (fs: FormSettings) => ({
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
    });

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
                onDashboard={() => go('/dashboard')}
                onViewSchema={() => setSchemaDialogOpen(true)}
                onIntegrations={() => setIntegrationsOpen(true)}
                onSettings={() => setFormSettingsOpen(true)}
                onLayoutBuilder={() => setLayoutBuilderOpen(true)}
                onFormNameChange={handleFormNameChange}
            />

            {/* Validation errors banner */}
            <Show when={validationErrors().length > 0}>
                <div class="form-builder-page__validation-banner">
                    <div class="form-builder-page__validation-content">
                        <strong>Cannot publish — please fix these issues:</strong>
                        <ul>
                            <For each={validationErrors()}>
                                {(err) => <li>{err}</li>}
                            </For>
                        </ul>
                    </div>
                    <button class="form-builder-page__validation-dismiss" onClick={() => setValidationErrors([])}>
                        &times;
                    </button>
                </div>
            </Show>

            <Show when={!showOverlay() && !previewing()}>
                <PageToolbar
                    pages={pages()}
                    activePageId={activePageId()}
                    onSetActivePage={setActivePageId}
                    onAddPage={addPage}
                    onEditPage={editPage}
                    onRenamePage={renamePage}
                    onDuplicatePage={duplicatePage}
                    onDeletePage={deletePage}
                    onLogic={() => setLogicOpen(true)}
                    onWorkflow={() => setWorkflowOpen(true)}
                    onDebug={() => setDebuggerOpen(true)}
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
                    <FormEditor initialSchema={schema() ?? undefined} onChange={handleSchemaChange} activePageId={activePageId()} pages={pages()}>
                        <FormEditorLayout />
                    </FormEditor>
                </Show>
            </Show>

            {/* Dialogs */}
            <LogicDialog
                open={logicOpen()}
                onClose={() => setLogicOpen(false)}
                rules={formRules()}
                onAddRule={addRule}
                onUpdateRule={updateRule}
                onDeleteRule={deleteRule}
                pages={pages()}
            />
            <WorkflowDialog
                open={workflowOpen()}
                onClose={() => setWorkflowOpen(false)}
                rules={formRules()}
                onAddRule={addRule}
                onUpdateRule={updateRule}
                onDeleteRule={deleteRule}
                pages={pages()}
            />
            <SchemaDialog
                open={schemaDialogOpen()}
                onClose={() => setSchemaDialogOpen(false)}
                schema={schema()}
            />
            <IntegrationsDialog
                open={integrationsOpen()}
                onClose={() => setIntegrationsOpen(false)}
            />
            <FormSettingsDialog
                open={formSettingsOpen()}
                onClose={() => setFormSettingsOpen(false)}
                settings={formSettings()}
                onSave={setFormSettings}
            />
            <LogicDebuggerDialog
                open={debuggerOpen()}
                onClose={() => setDebuggerOpen(false)}
                rules={formRules()}
                elements={schema()?.elements ?? []}
            />

            {/* Layout Builder overlay */}
            <LayoutBuilder
                open={layoutBuilderOpen()}
                onClose={() => setLayoutBuilderOpen(false)}
                onSave={handleLayoutSave}
                editingLayout={layoutConfig()}
                totalPages={pages().length}
                pages={pages().map((p) => ({ id: p.id, name: p.title, description: '' }))}
            />
        </div>
    );
};
