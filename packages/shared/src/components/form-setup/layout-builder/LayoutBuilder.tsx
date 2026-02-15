/**
 * Layout Builder — Main Component
 * Full-screen Dialog for designing multi-step form layout.
 * Shows the existing canvas with fixed header & footer drop zones.
 * Reuses Toolbar from @formanywhere/form-editor for the element sidebar.
 * UI matches the form builder 3-column layout.
 */
import { Component, createSignal, createEffect, Show, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Button } from '@formanywhere/ui/button';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Divider } from '@formanywhere/ui/divider';
import { Chip } from '@formanywhere/ui/chip';
import { Toolbar } from '@formanywhere/form-editor';

import { ElementCard } from './ElementCard';
import { PropertiesPanel } from './PropertiesPanel';
import {
    HeadingElement,
    StepperElement,
    NextButtonElement,
    BackButtonElement,
    NextArrowElement,
    BackArrowElement,
    ProgressBarElement,
    BreadcrumbElement,
    PageIndicatorElement,
    TwoColumnElement,
    ThreeColumnElement,
} from './elements';

import {
    LAYOUT_ELEMENTS,
    getLayoutCategories,
    type LayoutElement,
    type LayoutConfig,
    type ElementDefinition,
    type PageData,
} from './types';

import './layout-builder.scss';

// ── Props ──────────────────────────────────────────────────────

export interface LayoutBuilderProps {
    open: boolean;
    onClose: () => void;
    onSave: (layout: LayoutConfig) => void;
    editingLayout?: LayoutConfig | null;
    totalPages: number;
    pages?: PageData[];
}

// ── Component ──────────────────────────────────────────────────

export const LayoutBuilder: Component<LayoutBuilderProps> = (props) => {
    // Layout settings
    const [layoutName, setLayoutName] = createSignal('Default Layout');
    const [layoutDescription, setLayoutDescription] = createSignal('');
    const [stepperPosition, setStepperPosition] = createSignal<'top' | 'left' | 'none'>('none');
    const [stepperStyle, setStepperStyle] = createSignal<'dots' | 'numbers' | 'progress' | 'arrows'>('numbers');

    // Canvas state
    const [headerElements, setHeaderElements] = createSignal<LayoutElement[]>([]);
    const [footerElements, setFooterElements] = createSignal<LayoutElement[]>([]);
    const [selectedElementId, setSelectedElementId] = createSignal<string | null>(null);

    // Drag state
    const [draggedElement, setDraggedElement] = createSignal<ElementDefinition | null>(null);
    const [headerDragOver, setHeaderDragOver] = createSignal(false);
    const [footerDragOver, setFooterDragOver] = createSignal(false);

    // ── Initialize from editing layout ─────────────────────────

    createEffect(() => {
        if (!props.open) return;
        const editing = props.editingLayout;
        if (editing) {
            setLayoutName(editing.name);
            setLayoutDescription(editing.description);
            setStepperPosition(editing.stepperPosition);
            setStepperStyle(editing.stepperStyle);
            setHeaderElements([...editing.headerElements]);
            setFooterElements([...editing.footerElements]);
        } else {
            setLayoutName('Default Layout');
            setLayoutDescription('');
            setStepperPosition('none');
            setStepperStyle('numbers');
            setHeaderElements([]);
            setFooterElements([]);
        }
        setSelectedElementId(null);
    });

    // ── Drag & Drop Handlers ───────────────────────────────────

    const handleDragOver = (e: DragEvent, zone: 'header' | 'footer') => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (zone === 'header') setHeaderDragOver(true);
        else setFooterDragOver(true);
    };

    const handleDragLeave = (zone: 'header' | 'footer') => {
        if (zone === 'header') setHeaderDragOver(false);
        else setFooterDragOver(false);
    };

    const handleDrop = (e: DragEvent, target: 'header' | 'footer') => {
        e.preventDefault();
        setHeaderDragOver(false);
        setFooterDragOver(false);
        const dragged = draggedElement();
        if (!dragged) return;

        const newElement: LayoutElement = {
            id: `${dragged.type}-${Date.now()}`,
            type: dragged.type,
            label: dragged.label,
            position: 'center',
            variant: 'filled',
            showLabel: true,
        };

        if (dragged.type === 'twoColumn') {
            newElement.children = { column1: [], column2: [] };
        } else if (dragged.type === 'threeColumn') {
            newElement.children = { column1: [], column2: [], column3: [] };
        }

        if (target === 'header') {
            setHeaderElements((prev) => [...prev, newElement]);
        } else {
            setFooterElements((prev) => [...prev, newElement]);
        }
        setDraggedElement(null);
    };

    const handleDropInColumn = (
        e: DragEvent,
        parentId: string,
        columnKey: 'column1' | 'column2' | 'column3',
        target: 'header' | 'footer'
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setHeaderDragOver(false);
        setFooterDragOver(false);
        const dragged = draggedElement();
        if (!dragged) return;

        const newElement: LayoutElement = {
            id: `${dragged.type}-${Date.now()}`,
            type: dragged.type,
            label: dragged.label,
            position: 'center',
            variant: 'filled',
            showLabel: true,
        };

        const updateColumnChildren = (list: LayoutElement[]): LayoutElement[] =>
            list.map((el) => {
                if (el.id === parentId) {
                    const existingChildren = el.children?.[columnKey] || [];
                    return {
                        ...el,
                        children: {
                            ...el.children,
                            [columnKey]: [...existingChildren, newElement],
                        },
                    };
                }
                return el;
            });

        if (target === 'header') {
            setHeaderElements(updateColumnChildren(headerElements()));
        } else {
            setFooterElements(updateColumnChildren(footerElements()));
        }
        setDraggedElement(null);
    };

    // ── Element CRUD ───────────────────────────────────────────

    const handleRemoveElement = (elementId: string, target: 'header' | 'footer') => {
        const removeFromList = (list: LayoutElement[]): LayoutElement[] =>
            list
                .filter((e) => e.id !== elementId)
                .map((el) => {
                    if (el.children) {
                        return {
                            ...el,
                            children: {
                                column1: el.children.column1 ? removeFromList(el.children.column1) : undefined,
                                column2: el.children.column2 ? removeFromList(el.children.column2) : undefined,
                                column3: el.children.column3 ? removeFromList(el.children.column3) : undefined,
                            },
                        };
                    }
                    return el;
                });

        if (target === 'header') {
            setHeaderElements(removeFromList(headerElements()));
        } else {
            setFooterElements(removeFromList(footerElements()));
        }
        if (selectedElementId() === elementId) {
            setSelectedElementId(null);
        }
    };

    const handleUpdateElement = (updates: Partial<LayoutElement>) => {
        const selId = selectedElementId();
        if (!selId) return;

        const updateInList = (list: LayoutElement[]): LayoutElement[] =>
            list.map((el) => {
                if (el.id === selId) return { ...el, ...updates };
                if (el.children) {
                    return {
                        ...el,
                        children: {
                            column1: el.children.column1 ? updateInList(el.children.column1) : undefined,
                            column2: el.children.column2 ? updateInList(el.children.column2) : undefined,
                            column3: el.children.column3 ? updateInList(el.children.column3) : undefined,
                        },
                    };
                }
                return el;
            });

        setHeaderElements(updateInList(headerElements()));
        setFooterElements(updateInList(footerElements()));
    };

    // ── Find selected element ──────────────────────────────────

    const findElement = (list: LayoutElement[], id: string): LayoutElement | null => {
        for (const el of list) {
            if (el.id === id) return el;
            if (el.children) {
                const found =
                    findElement(el.children.column1 || [], id) ||
                    findElement(el.children.column2 || [], id) ||
                    findElement(el.children.column3 || [], id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedElement = () => {
        const selId = selectedElementId();
        if (!selId) return null;
        return findElement([...headerElements(), ...footerElements()], selId);
    };

    // ── Save handler ───────────────────────────────────────────

    const handleSave = () => {
        const layout: LayoutConfig = {
            id: props.editingLayout?.id || `layout-${Date.now()}`,
            name: layoutName(),
            description: layoutDescription(),
            headerElements: headerElements(),
            footerElements: footerElements(),
            stepperPosition: stepperPosition(),
            stepperStyle: stepperStyle(),
        };
        props.onSave(layout);
        props.onClose();
    };

    // ── Render element using modular components ────────────────

    const renderElement = (element: LayoutElement, target?: 'header' | 'footer') => {
        const renderProps = { element, totalPages: props.totalPages, isSmall: false };

        switch (element.type) {
            case 'heading':
                return <HeadingElement {...renderProps} />;
            case 'stepper':
                return <StepperElement {...renderProps} />;
            case 'nextButton':
                return <NextButtonElement {...renderProps} />;
            case 'backButton':
                return <BackButtonElement {...renderProps} />;
            case 'nextArrow':
                return <NextArrowElement {...renderProps} />;
            case 'backArrow':
                return <BackArrowElement {...renderProps} />;
            case 'progressBar':
                return <ProgressBarElement {...renderProps} />;
            case 'breadcrumb':
                return <BreadcrumbElement {...renderProps} />;
            case 'pageIndicator':
                return <PageIndicatorElement {...renderProps} />;
            case 'twoColumn':
                return (
                    <TwoColumnElement
                        {...renderProps}
                        target={target}
                        onDropInColumn={handleDropInColumn}
                        renderChild={(child) => renderNestedElementCard(child, target!)}
                    />
                );
            case 'threeColumn':
                return (
                    <ThreeColumnElement
                        {...renderProps}
                        target={target}
                        onDropInColumn={handleDropInColumn}
                        renderChild={(child) => renderNestedElementCard(child, target!)}
                    />
                );
            default:
                return <Typography variant="label-small">{element.label}</Typography>;
        }
    };

    const renderElementCard = (element: LayoutElement, target: 'header' | 'footer') => (
        <ElementCard
            isSelected={selectedElementId() === element.id}
            label={LAYOUT_ELEMENTS.find((e) => e.type === element.type)?.label}
            align={element.position}
            onSelect={() => setSelectedElementId(element.id)}
            onRemove={() => handleRemoveElement(element.id, target)}
        >
            {renderElement(element, target)}
        </ElementCard>
    );

    const renderNestedElementCard = (element: LayoutElement, target: 'header' | 'footer') => (
        <ElementCard
            isSelected={selectedElementId() === element.id}
            label={LAYOUT_ELEMENTS.find((e) => e.type === element.type)?.label}
            align={element.position}
            onSelect={(e) => {
                e?.stopPropagation();
                setSelectedElementId(element.id);
            }}
            onRemove={(e) => {
                e?.stopPropagation();
                handleRemoveElement(element.id, target);
            }}
        >
            {renderElement(element, target)}
        </ElementCard>
    );

    const handleCanvasClick = () => {
        if (selectedElementId()) setSelectedElementId(null);
    };

    // ── Toolbar integration ────────────────────────────────────

    const toolbarCategories = getLayoutCategories();

    const handleToolbarDragStart = (type: string) => {
        const def = LAYOUT_ELEMENTS.find((e) => e.type === type) ?? null;
        setDraggedElement(def);
    };

    const handleToolbarAdd = (type: string) => {
        const def = LAYOUT_ELEMENTS.find((e) => e.type === type);
        if (!def) return;
        const newElement: LayoutElement = {
            id: `${def.type}-${Date.now()}`,
            type: def.type,
            label: def.label,
            position: 'center',
            variant: 'filled',
            showLabel: true,
        };
        if (def.type === 'twoColumn') {
            newElement.children = { column1: [], column2: [] };
        } else if (def.type === 'threeColumn') {
            newElement.children = { column1: [], column2: [], column3: [] };
        }
        // Add to footer by default on click
        setFooterElements((prev) => [...prev, newElement]);
    };

    // ── Fake form field rows for the canvas placeholder ────────
    const fakeFields = [
        { type: 'text', label: 'Full Name', icon: 'type' },
        { type: 'email', label: 'Email Address', icon: 'mail' },
        { type: 'select', label: 'Department', icon: 'list' },
        { type: 'textarea', label: 'Message', icon: 'align-left' },
    ];

    // Escape key handler
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') props.onClose();
    };

    // ── Render ─────────────────────────────────────────────────

    return (
        <Show when={props.open}>
            <Portal>
                <div class="lb-dialog-backdrop" onClick={props.onClose} onKeyDown={handleKeyDown}>
                    <div class="lb-dialog" onClick={(e) => e.stopPropagation()}>
                        {/* ── Header bar — matches builder-header ── */}
                        <header class="builder-header">
                            <div class="builder-header__left">
                                <IconButton
                                    variant="standard"
                                    size="sm"
                                    icon={<Icon name="x" size={18} />}
                                    onClick={props.onClose}
                                    title="Close"
                                />
                                <Icon name="layers" size={20} />
                                <Typography variant="title-medium">
                                    Layout Builder
                                </Typography>
                            </div>
                            <div class="builder-header__right">
                                <Button variant="text" size="sm" onClick={props.onClose}>
                                    Cancel
                                </Button>
                                <Button variant="filled" size="sm" onClick={handleSave}>
                                    <Icon name="check" size={16} />
                                    Apply Layout
                                </Button>
                            </div>
                        </header>

                        {/* ── 3-column editor layout ── */}
                        <div class="form-editor-layout">
                            {/* Left sidebar — Toolbar */}
                            <aside class="form-editor-layout__sidebar form-editor-layout__sidebar--left">
                                <Toolbar
                                    categories={toolbarCategories}
                                    onClickAdd={handleToolbarAdd}
                                    onDragStart={handleToolbarDragStart}
                                    headerTitle="Layout Elements"
                                    headerIcon="layers"
                                />
                            </aside>

                            {/* Canvas — shows form with header/footer zones */}
                            <main class="form-editor-layout__canvas-area" onClick={handleCanvasClick}>
                                <div class="lb-canvas">
                                    {/* ── HEADER ZONE (drop target) ── */}
                                    <div
                                        class="lb-zone"
                                        classList={{
                                            'lb-zone--drag-over': headerDragOver(),
                                            'lb-zone--has-elements': headerElements().length > 0,
                                        }}
                                        onDragOver={(e) => handleDragOver(e, 'header')}
                                        onDragLeave={() => handleDragLeave('header')}
                                        onDrop={(e) => handleDrop(e, 'header')}
                                    >
                                        <div class="lb-zone__label">
                                            <Chip variant="label" label="HEADER" size="sm" color="primary" />
                                            <Show when={headerElements().length === 0}>
                                                <Typography variant="label-small" color="on-surface-variant">
                                                    Drop elements here
                                                </Typography>
                                            </Show>
                                        </div>
                                        <Show when={headerElements().length > 0}>
                                            <div class="lb-zone__elements">
                                                <For each={headerElements()}>
                                                    {(el) => renderElementCard(el, 'header')}
                                                </For>
                                            </div>
                                        </Show>
                                        <Show when={headerElements().length === 0}>
                                            <div class="lb-zone__empty">
                                                <Icon name="arrow-down" size={20} color="var(--m3-color-outline)" style={{ opacity: '0.4' }} />
                                            </div>
                                        </Show>
                                    </div>

                                    {/* ── FORM CONTENT (fixed canvas placeholder) ── */}
                                    <div class="lb-form-canvas">
                                        <div class="lb-form-canvas__card">
                                            <For each={fakeFields}>
                                                {(field) => (
                                                    <div class="lb-form-canvas__field">
                                                        <div class="lb-form-canvas__field-handle">
                                                            <Icon name="grip-vertical" size={14} />
                                                        </div>
                                                        <span class="lb-form-canvas__field-type">{field.type}</span>
                                                        <span class="lb-form-canvas__field-label">{field.label}</span>
                                                    </div>
                                                )}
                                            </For>
                                            <div class="lb-form-canvas__overlay">
                                                <Icon name="lock" size={18} />
                                                <Typography variant="label-medium">Form Content — edit in Form Builder</Typography>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── FOOTER ZONE (drop target) ── */}
                                    <div
                                        class="lb-zone lb-zone--footer"
                                        classList={{
                                            'lb-zone--drag-over': footerDragOver(),
                                            'lb-zone--has-elements': footerElements().length > 0,
                                        }}
                                        onDragOver={(e) => handleDragOver(e, 'footer')}
                                        onDragLeave={() => handleDragLeave('footer')}
                                        onDrop={(e) => handleDrop(e, 'footer')}
                                    >
                                        <div class="lb-zone__label">
                                            <Chip variant="label" label="FOOTER" size="sm" color="primary" />
                                            <Show when={footerElements().length === 0}>
                                                <Typography variant="label-small" color="on-surface-variant">
                                                    Drop elements here
                                                </Typography>
                                            </Show>
                                        </div>
                                        <Show when={footerElements().length > 0}>
                                            <div class="lb-zone__elements">
                                                <For each={footerElements()}>
                                                    {(el) => renderElementCard(el, 'footer')}
                                                </For>
                                            </div>
                                        </Show>
                                        <Show when={footerElements().length === 0}>
                                            <div class="lb-zone__empty">
                                                <Icon name="arrow-up" size={20} color="var(--m3-color-outline)" style={{ opacity: '0.4' }} />
                                            </div>
                                        </Show>
                                    </div>
                                </div>
                            </main>

                            {/* Right sidebar — Properties Panel */}
                            <aside class="form-editor-layout__sidebar form-editor-layout__sidebar--right">
                                <PropertiesPanel
                                    selectedElement={selectedElement()}
                                    onUpdateElement={handleUpdateElement}
                                    onCloseElement={() => setSelectedElementId(null)}
                                    layoutName={layoutName()}
                                    layoutDescription={layoutDescription()}
                                    onLayoutNameChange={setLayoutName}
                                    onLayoutDescriptionChange={setLayoutDescription}
                                    pages={props.pages}
                                />
                            </aside>
                        </div>
                    </div>
                </div>
            </Portal>
        </Show>
    );
};
