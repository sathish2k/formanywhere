/**
 * Form Setup Page — SolidJS
 * Pre-builder screen for configuring form name, description, pages, and layout.
 * After completing setup, navigates to the form builder with config.
 */
import { Component, createSignal, For, Show } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { TextField } from '@formanywhere/ui/input';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';
import { Card } from '@formanywhere/ui/card';
import { go, generateId } from '../../utils';
import { LayoutBuilder } from './layout-builder';
import type { LayoutConfig, PageData } from './layout-builder/types';
import { defaultLayout } from './layout-builder/types';

import './layout-builder/layout-builder.scss';

export interface FormSetupPageProps {
    mode?: 'blank' | 'ai' | 'import' | 'template';
}

export const FormSetupPage: Component<FormSetupPageProps> = (props) => {
    // Form setup state
    const [formName, setFormName] = createSignal('Untitled Form');
    const [formDescription, setFormDescription] = createSignal('');
    const [pages, setPages] = createSignal<PageData[]>([
        { id: generateId(), name: 'Page 1', description: 'First page of your form' },
    ]);
    const [layoutType, setLayoutType] = createSignal<'classic' | 'card'>('classic');
    const [layout, setLayout] = createSignal<LayoutConfig | null>(null);

    // Layout builder dialog
    const [layoutBuilderOpen, setLayoutBuilderOpen] = createSignal(false);

    // ── Page Management ────────────────────────────────────────

    const addPage = () => {
        const num = pages().length + 1;
        setPages((prev) => [
            ...prev,
            { id: generateId(), name: `Page ${num}`, description: '' },
        ]);
    };

    const removePage = (id: string) => {
        if (pages().length <= 1) return;
        setPages((prev) => prev.filter((p) => p.id !== id));
    };

    const updatePage = (id: string, updates: Partial<PageData>) => {
        setPages((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
    };

    // ── Layout Save ────────────────────────────────────────────

    const handleLayoutSave = (newLayout: LayoutConfig) => {
        setLayout(newLayout);
    };

    // ── Start Building ─────────────────────────────────────────

    const handleStartBuilding = () => {
        // Store form setup data in sessionStorage for the builder to pick up
        const setupData = {
            name: formName(),
            description: formDescription(),
            pages: pages(),
            layoutType: layoutType(),
            layout: layout(),
        };
        sessionStorage.setItem('formanywhere_form_setup', JSON.stringify(setupData));

        // Navigate to builder with mode
        const mode = props.mode || 'blank';
        go(`/app?mode=${mode}&setup=true`);
    };

    const handleCancel = () => {
        go('/dashboard');
    };

    // ── Render ─────────────────────────────────────────────────

    return (
        <div class="form-setup">
            {/* Header */}
            <div class="form-setup__header">
                <div class="form-setup__header-left">
                    <IconButton
                        variant="standard"
                        icon={<Icon name="arrow-left" size={20} />}
                        onClick={handleCancel}
                        aria-label="Back to Dashboard"
                    />
                    <div>
                        <Typography variant="title-large" style={{ "font-weight": "700" }}>
                            Form Setup
                        </Typography>
                        <Typography variant="label-small" color="secondary">
                            Configure your form before building
                        </Typography>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                    <Button variant="filled" onClick={handleStartBuilding}>
                        <Icon name="arrow-right" size={18} />
                        Start Building
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div class="form-setup__content">
                {/* Form Details */}
                <div class="form-setup__section">
                    <Typography variant="title-medium" class="form-setup__section-title" style={{ "font-weight": "700" }}>
                        Form Details
                    </Typography>
                    <div class="form-setup__form-fields">
                        <TextField
                            label="Form Name"
                            value={formName()}
                            onInput={(e) => setFormName((e.target as HTMLInputElement).value)}
                        />
                        <TextField
                            label="Description"
                            value={formDescription()}
                            onInput={(e) => setFormDescription((e.target as HTMLInputElement).value)}
                            type="textarea"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Pages */}
                <div class="form-setup__section">
                    <div style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between', "margin-bottom": '16px' }}>
                        <Typography variant="title-medium" style={{ "font-weight": "700" }}>
                            Pages
                        </Typography>
                        <Button variant="tonal" onClick={addPage}>
                            <Icon name="plus" size={16} />
                            Add Page
                        </Button>
                    </div>
                    <div class="form-setup__form-fields">
                        <For each={pages()}>
                            {(page, i) => (
                                <div style={{ display: 'flex', "align-items": 'flex-start', gap: '12px' }}>
                                    <div style={{ flex: '1', display: 'flex', "flex-direction": 'column', gap: '8px' }}>
                                        <TextField
                                            label={`Page ${i() + 1} Name`}
                                            value={page.name}
                                            onInput={(e) => updatePage(page.id, { name: (e.target as HTMLInputElement).value })}
                                            size="sm"
                                        />
                                        <TextField
                                            label="Description (optional)"
                                            value={page.description}
                                            onInput={(e) => updatePage(page.id, { description: (e.target as HTMLInputElement).value })}
                                            size="sm"
                                        />
                                    </div>
                                    <Show when={pages().length > 1}>
                                        <IconButton
                                            variant="standard"
                                            icon={<Icon name="trash" size={16} />}
                                            onClick={() => removePage(page.id)}
                                            aria-label={`Remove ${page.name}`}
                                            style={{ "margin-top": '8px' }}
                                        />
                                    </Show>
                                    <Show when={i() < pages().length - 1}>
                                        <Divider />
                                    </Show>
                                </div>
                            )}
                        </For>
                    </div>
                </div>

                {/* Layout Type */}
                <div class="form-setup__section">
                    <Typography variant="title-medium" class="form-setup__section-title" style={{ "font-weight": "700" }}>
                        Layout Type
                    </Typography>
                    <div class="form-setup__layout-type-grid">
                        <div
                            class="form-setup__layout-card"
                            classList={{ 'form-setup__layout-card--selected': layoutType() === 'classic' }}
                            onClick={() => setLayoutType('classic')}
                        >
                            <Icon name="layout" size={32} color="var(--m3-sys-primary)" />
                            <Typography variant="title-small" style={{ "margin-top": "8px", "font-weight": "600" }}>
                                Classic
                            </Typography>
                            <Typography variant="body-small" color="secondary">
                                Traditional multi-step form with separate pages
                            </Typography>
                        </div>
                        <div
                            class="form-setup__layout-card"
                            classList={{ 'form-setup__layout-card--selected': layoutType() === 'card' }}
                            onClick={() => setLayoutType('card')}
                        >
                            <Icon name="layers" size={32} color="var(--m3-sys-primary)" />
                            <Typography variant="title-small" style={{ "margin-top": "8px", "font-weight": "600" }}>
                                Card
                            </Typography>
                            <Typography variant="body-small" color="secondary">
                                Card-based layout with smooth transitions
                            </Typography>
                        </div>
                    </div>
                </div>

                {/* Layout Builder / Preview */}
                <div class="form-setup__section">
                    <Typography variant="title-medium" class="form-setup__section-title" style={{ "font-weight": "700" }}>
                        Form Layout
                    </Typography>

                    <Show
                        when={layout()}
                        fallback={
                            <div class="form-setup__layout-preview">
                                <Typography variant="body-medium" color="secondary" align="center">
                                    No layout configured yet. Use the Layout Builder to design your form's header, footer, navigation, and stepper.
                                </Typography>
                                <div class="form-setup__layout-actions" style={{ "justify-content": "center", "margin-top": "16px" }}>
                                    <Button variant="tonal" onClick={() => setLayoutBuilderOpen(true)}>
                                        <Icon name="layers" size={18} />
                                        Open Layout Builder
                                    </Button>
                                </div>
                            </div>
                        }
                    >
                        <div class="form-setup__layout-preview">
                            <div style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between', "margin-bottom": '12px' }}>
                                <div>
                                    <Typography variant="title-small" style={{ "font-weight": "600" }}>
                                        {layout()!.name}
                                    </Typography>
                                    <Show when={layout()!.description}>
                                        <Typography variant="body-small" color="secondary">
                                            {layout()!.description}
                                        </Typography>
                                    </Show>
                                </div>
                                <div class="form-setup__layout-actions">
                                    <Button variant="outlined" onClick={() => setLayoutBuilderOpen(true)}>
                                        <Icon name="edit" size={16} />
                                        Edit Layout
                                    </Button>
                                    <Button variant="text" onClick={() => setLayout(null)}>
                                        <Icon name="trash" size={16} />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                            <Divider />
                            <div style={{ "margin-top": "12px", display: 'flex', gap: '24px' }}>
                                <div>
                                    <Typography variant="label-small" color="secondary">Header Elements</Typography>
                                    <Typography variant="body-small">{layout()!.headerElements.length} element(s)</Typography>
                                </div>
                                <div>
                                    <Typography variant="label-small" color="secondary">Footer Elements</Typography>
                                    <Typography variant="body-small">{layout()!.footerElements.length} element(s)</Typography>
                                </div>
                                <div>
                                    <Typography variant="label-small" color="secondary">Stepper Position</Typography>
                                    <Typography variant="body-small">{layout()!.stepperPosition}</Typography>
                                </div>
                            </div>
                        </div>
                    </Show>
                </div>
            </div>

            {/* Footer */}
            <div class="form-setup__footer">
                <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                <Button variant="filled" onClick={handleStartBuilding}>
                    Start Building
                    <Icon name="arrow-right" size={18} />
                </Button>
            </div>

            {/* Layout Builder Dialog */}
            <LayoutBuilder
                open={layoutBuilderOpen()}
                onClose={() => setLayoutBuilderOpen(false)}
                onSave={handleLayoutSave}
                editingLayout={layout()}
                totalPages={pages().length}
                pages={pages()}
            />
        </div>
    );
};
