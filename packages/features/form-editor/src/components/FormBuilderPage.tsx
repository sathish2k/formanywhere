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
 *
 * State management is delegated to extracted hooks:
 *   - usePageManagement   (page CRUD & schema sync)
 *   - useDraftPersistence (localStorage autosave/restore)
 *   - useFormSave         (API load/save + validation)
 */
import { splitProps, createSignal, Show, For, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import { FormEditor } from './FormEditor';
import { FormEditorLayout } from './layout/FormEditorLayout';
import { AIFormBuilder } from './ai/AIFormBuilder';
import { ImportForm } from './import/ImportForm';
import { FormPreview } from '@formanywhere/form-runtime';
import type { FormSchema, FormRule, FormWorkflow } from '@formanywhere/shared/types';
import { generateId, go } from '@formanywhere/shared/utils';
import { BuilderHeader } from './header/BuilderHeader';
import { PageToolbar } from './page-toolbar/PageToolbar';
import { LogicDialog } from './dialogs/LogicDialog';
import { WorkflowDialog } from './dialogs/WorkflowDialog';
import { SchemaDialog } from './dialogs/SchemaDialog';
import { IntegrationsDialog } from './dialogs/IntegrationsDialog';
import { FormSettingsDialog } from './dialogs/FormSettingsDialog';
import { LogicDebuggerDialog } from './dialogs/LogicDebuggerDialog';
import type { FormSettings } from './dialogs/FormSettingsDialog';
import { LayoutBuilder } from '@formanywhere/shared/form-setup/layout-builder';
import type { LayoutConfig } from '@formanywhere/shared/form-setup/layout-builder/types';
import { usePageManagement } from './hooks/use-page-management';
import { useDraftPersistence } from './hooks/use-draft-persistence';
import { useFormSave } from './hooks/use-form-save';
import './form-builder.scss';

export type BuilderMode = 'blank' | 'template' | 'import' | 'ai';

export interface FormBuilderPageProps {
    mode?: BuilderMode;
    formId?: string;
    templateId?: string;
    templateSchema?: FormSchema;
    initialName?: string;
    initialDescription?: string;
    initialPages?: Array<{ id: string; title: string }>;
}

export const FormBuilderPage: Component<FormBuilderPageProps> = (props) => {
    const [local] = splitProps(props, ['formId', 'templateId', 'mode', 'templateSchema', 'initialName', 'initialDescription', 'initialPages']);
    const mode = () => local.mode ?? 'blank';

    // ── Schema Signal ─────────────────────────────────────────────────────────

    const makeInitialSchema = (): FormSchema | null => {
        if (!local.initialName) return null;
        return {
            id: generateId(),
            name: local.initialName,
            description: local.initialDescription ?? '',
            elements: [],
            settings: { pages: [], submitButtonText: 'Submit', successMessage: 'Thank you!' },
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as unknown as FormSchema;
    };

    const [schema, setSchema] = createSignal<FormSchema | null>(makeInitialSchema());
    const [previewing, setPreviewing] = createSignal(false);
    const [showOverlay, setShowOverlay] = createSignal<'ai' | 'import' | null>(null);

    // ── Rules & Workflows ─────────────────────────────────────────────────────

    const [formRules, setFormRules] = createSignal<FormRule[]>([]);
    const [workflows, setWorkflows] = createSignal<FormWorkflow[]>([]);
    const addRule = (rule: FormRule) => setFormRules((prev) => [...prev, rule]);
    const updateRule = (id: string, rule: FormRule) => setFormRules((prev) => prev.map((r) => r.id === id ? rule : r));
    const deleteRule = (id: string) => setFormRules((prev) => prev.filter((r) => r.id !== id));
    const addWorkflow = (wf: FormWorkflow) => setWorkflows((prev) => [...prev, wf]);
    const updateWorkflow = (id: string, wf: FormWorkflow) => setWorkflows((prev) => prev.map((w) => w.id === id ? wf : w));
    const deleteWorkflow = (id: string) => setWorkflows((prev) => prev.filter((w) => w.id !== id));

    // ── Form Settings & Layout ────────────────────────────────────────────────

    const [formSettings, setFormSettings] = createSignal<FormSettings>({
        primaryColor: '#6750A4', secondaryColor: '#625B71',
        backgroundColor: '#FFFBFE', surfaceColor: '#FFFFFF',
        borderRadius: 12, fontFamily: 'Inter', customCSS: '', googleFontUrl: '',
        customHeadTags: '', externalCSS: [], externalJS: [],
        successHeading: 'Thank You!', successMessage: 'Your response has been recorded.',
        successShowData: false, successButtonText: '', successButtonUrl: '',
        redirectUrl: '', redirectDelay: 0,
    });
    const [layoutBuilderOpen, setLayoutBuilderOpen] = createSignal(false);
    const [layoutConfig, setLayoutConfig] = createSignal<LayoutConfig | null>(null);

    // ── Dialog State ──────────────────────────────────────────────────────────

    const [logicOpen, setLogicOpen] = createSignal(false);
    const [workflowOpen, setWorkflowOpen] = createSignal(false);
    const [schemaDialogOpen, setSchemaDialogOpen] = createSignal(false);
    const [integrationsOpen, setIntegrationsOpen] = createSignal(false);
    const [formSettingsOpen, setFormSettingsOpen] = createSignal(false);
    const [debuggerOpen, setDebuggerOpen] = createSignal(false);

    // ── Hooks ─────────────────────────────────────────────────────────────────

    const pm = usePageManagement({ initialPages: local.initialPages, setSchema });

    const draft = useDraftPersistence({
        formId: local.formId,
        schema, formRules, workflows, formSettings,
    });

    const save = useFormSave({
        formId: local.formId,
        schema, setSchema,
        formRules, setFormRules,
        workflows, setWorkflows,
        formSettings, setFormSettings,
        pages: pm.pages,
        syncPagesFromSchema: pm.syncPagesFromSchema,
        clearDraft: draft.clearDraft,
    });

    // ── Event Handlers ────────────────────────────────────────────────────────

    const handleFormNameChange = (name: string) => setSchema((prev) => prev ? { ...prev, name } : prev);

    const handleLayoutSave = (layout: LayoutConfig) => {
        setLayoutConfig(layout);
        setLayoutBuilderOpen(false);
        setSchema((prev) => prev ? { ...prev, settings: { ...prev.settings, layout } } : prev);
    };

    const handleSchemaChange = (updated: FormSchema) => setSchema(updated);
    const handleOverlayResult = (s: FormSchema) => { setSchema(s); setShowOverlay(null); };
    const handleOverlayCancel = () => { setShowOverlay(null); if (!schema()) go('/dashboard'); };

    // ── Mount ─────────────────────────────────────────────────────────────────

    onMount(() => {
        const firstPage = pm.pages()[0];
        if (firstPage) pm.setActivePageId(firstPage.id);
        pm.syncPagesToSchema();

        if (mode() === 'ai') {
            setShowOverlay('ai');
        } else if (mode() === 'import') {
            setShowOverlay('import');
        } else if (mode() === 'template' && local.templateSchema) {
            setSchema({ ...local.templateSchema, id: generateId(), updatedAt: new Date() });
        } else if (mode() === 'template' && local.templateId) {
            save.loadTemplateById(local.templateId);
        } else if (local.formId) {
            save.loadExistingForm(local.formId);
        } else {
            const restored = draft.restoreDraft();
            if (restored) {
                if (restored.schema) {
                    setSchema(restored.schema);
                    pm.syncPagesFromSchema(restored.schema);
                }
                if (restored.rules) setFormRules(restored.rules);
                if (restored.workflows) setWorkflows(restored.workflows);
                if (restored.settings) setFormSettings(restored.settings);
            }
        }
    });

    // ── JSX ───────────────────────────────────────────────────────────────────

    return (
        <div class="form-builder-page">
            <BuilderHeader
                formName={schema()?.name ?? 'New Form'}
                previewing={previewing()}
                saving={save.saving()}
                hasSchema={!!schema()}
                onTogglePreview={() => setPreviewing(!previewing())}
                onSave={save.handleSave}
                onBack={() => go('/dashboard')}
                onDashboard={() => go('/dashboard')}
                onViewSchema={() => setSchemaDialogOpen(true)}
                onIntegrations={() => setIntegrationsOpen(true)}
                onSettings={() => setFormSettingsOpen(true)}
                onLayoutBuilder={() => setLayoutBuilderOpen(true)}
                onFormNameChange={handleFormNameChange}
            />

            {/* Validation errors banner */}
            <Show when={save.validationErrors().length > 0}>
                <div class="form-builder-page__validation-banner">
                    <div class="form-builder-page__validation-content">
                        <strong>Cannot publish — please fix these issues:</strong>
                        <ul>
                            <For each={save.validationErrors()}>
                                {(err) => <li>{err}</li>}
                            </For>
                        </ul>
                    </div>
                    <button class="form-builder-page__validation-dismiss" onClick={() => save.setValidationErrors([])}>
                        &times;
                    </button>
                </div>
            </Show>

            <Show when={!showOverlay() && !previewing()}>
                <PageToolbar
                    pages={pm.pages()}
                    activePageId={pm.activePageId()}
                    onSetActivePage={pm.setActivePageId}
                    onAddPage={pm.addPage}
                    onEditPage={pm.editPage}
                    onRenamePage={pm.renamePage}
                    onDuplicatePage={pm.duplicatePage}
                    onDeletePage={pm.deletePage}
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
                    <Show when={!local.formId || schema()}>
                        <FormEditor initialSchema={schema() ?? undefined} onChange={handleSchemaChange} activePageId={pm.activePageId()} pages={pm.pages()}>
                            <FormEditorLayout />
                        </FormEditor>
                    </Show>
                </Show>
            </Show>

            {/* Dialogs */}
            <LogicDialog
                open={logicOpen()} onClose={() => setLogicOpen(false)}
                rules={formRules()} onAddRule={addRule} onUpdateRule={updateRule} onDeleteRule={deleteRule}
                pages={pm.pages()}
            />
            <WorkflowDialog
                open={workflowOpen()} onClose={() => setWorkflowOpen(false)}
                workflows={workflows()} pages={pm.pages()} elements={schema()?.elements ?? []}
                onAddWorkflow={addWorkflow} onUpdateWorkflow={updateWorkflow} onDeleteWorkflow={deleteWorkflow}
            />
            <SchemaDialog open={schemaDialogOpen()} onClose={() => setSchemaDialogOpen(false)} schema={schema()} />
            <IntegrationsDialog open={integrationsOpen()} onClose={() => setIntegrationsOpen(false)} />
            <FormSettingsDialog
                open={formSettingsOpen()} onClose={() => setFormSettingsOpen(false)}
                settings={formSettings()} onSave={setFormSettings}
            />
            <LogicDebuggerDialog
                open={debuggerOpen()} onClose={() => setDebuggerOpen(false)}
                rules={formRules()} elements={schema()?.elements ?? []}
            />

            {/* Layout Builder overlay */}
            <LayoutBuilder
                open={layoutBuilderOpen()} onClose={() => setLayoutBuilderOpen(false)}
                onSave={handleLayoutSave} editingLayout={layoutConfig()}
                totalPages={pm.pages().length}
                pages={pm.pages().map((p) => ({ id: p.id, name: p.title, description: '' }))}
            />
        </div>
    );
};
