/**
 * Layout Element Renderers — SolidJS
 * Visual previews for each layout element type
 */
import { Component, Show, For, JSX } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Chip } from '@formanywhere/ui/chip';
import { LinearProgress } from '@formanywhere/ui/progress';
import type { LayoutElement, ElementRenderProps } from './types';

// ── Heading ────────────────────────────────────────────────────

export const HeadingElement: Component<ElementRenderProps> = (props) => {
    const variant = () => props.element.typographyVariant || 'headline-medium';
    const align = () => props.element.align || 'center';

    return (
        <Show when={!props.isSmall} fallback={
            <Typography variant="title-small" style={{ "font-weight": "700" }}>
                {props.element.label || 'Heading'}
            </Typography>
        }>
            <Typography variant={variant()} align={align()} style={{ "font-weight": "700" }}>
                {props.element.label || 'Page Heading'}
            </Typography>
        </Show>
    );
};

// ── Stepper ────────────────────────────────────────────────────

export const StepperElement: Component<ElementRenderProps> = (props) => {
    const stepperVariant = () => props.element.stepperVariant || 'dots';
    const totalSteps = () => props.element.steps?.length || props.totalPages || 3;

    return (
        <Show when={!props.isSmall} fallback={
            <Typography variant="label-small" color="secondary">
                Stepper ({stepperVariant()})
            </Typography>
        }>
            <div class="layout-stepper" data-variant={stepperVariant()}>
                <Show when={stepperVariant() === 'dots'}>
                    <div class="layout-stepper__dots">
                        <For each={Array.from({ length: totalSteps() })}>
                            {(_, i) => (
                                <div
                                    class="layout-stepper__dot"
                                    classList={{
                                        'layout-stepper__dot--active': i() === 0,
                                        'layout-stepper__dot--completed': false,
                                    }}
                                />
                            )}
                        </For>
                    </div>
                </Show>

                <Show when={stepperVariant() === 'numbers'}>
                    <div class="layout-stepper__numbers">
                        <For each={Array.from({ length: totalSteps() })}>
                            {(_, i) => (
                                <div class="layout-stepper__step" classList={{ 'layout-stepper__step--active': i() === 0 }}>
                                    <div class="layout-stepper__step-number">
                                        {i() + 1}
                                    </div>
                                    <Typography variant="label-small">
                                        {props.element.steps?.[i()]?.label || `Step ${i() + 1}`}
                                    </Typography>
                                    <Show when={i() < totalSteps() - 1}>
                                        <div class="layout-stepper__connector" />
                                    </Show>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>

                <Show when={stepperVariant() === 'progress'}>
                    <div class="layout-stepper__progress">
                        <LinearProgress value={Math.round((1 / totalSteps()) * 100)} />
                        <Typography variant="label-small" color="secondary" align="center">
                            Step 1 of {totalSteps()}
                        </Typography>
                    </div>
                </Show>

                <Show when={stepperVariant() === 'text'}>
                    <div class="layout-stepper__text">
                        <For each={Array.from({ length: totalSteps() })}>
                            {(_, i) => (
                                <div class="layout-stepper__text-step" classList={{ 'layout-stepper__text-step--active': i() === 0 }}>
                                    <Typography variant="label-medium">
                                        {props.element.steps?.[i()]?.label || `Step ${i() + 1}`}
                                    </Typography>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </div>
        </Show>
    );
};

// ── Next / Back Buttons ────────────────────────────────────────

export const NextButtonElement: Component<ElementRenderProps> = (props) => {
    const variant = () => props.element.variant || 'filled';
    const label = () => props.element.showLabel !== false ? (props.element.label || 'Next') : undefined;
    const pos = () => props.element.position || 'right';

    return (
        <div style={{ display: 'flex', "justify-content": pos() === 'left' ? 'flex-start' : pos() === 'right' ? 'flex-end' : 'center' }}>
            <Button variant={variant()}>
                {label()}
                <Icon name="chevron-right" size={18} />
            </Button>
        </div>
    );
};

export const BackButtonElement: Component<ElementRenderProps> = (props) => {
    const variant = () => props.element.variant || 'outlined';
    const label = () => props.element.showLabel !== false ? (props.element.label || 'Back') : undefined;
    const pos = () => props.element.position || 'left';

    return (
        <div style={{ display: 'flex', "justify-content": pos() === 'left' ? 'flex-start' : pos() === 'right' ? 'flex-end' : 'center' }}>
            <Button variant={variant()}>
                <Icon name="chevron-left" size={18} />
                {label()}
            </Button>
        </div>
    );
};

// ── Arrow Buttons ──────────────────────────────────────────────

export const NextArrowElement: Component<ElementRenderProps> = (props) => {
    return (
        <div style={{ display: 'flex', "justify-content": 'flex-end' }}>
            <IconButton
                variant="filled"
                icon={<Icon name="arrow-right" size={20} />}
                aria-label="Next"
            />
        </div>
    );
};

export const BackArrowElement: Component<ElementRenderProps> = (props) => {
    return (
        <div style={{ display: 'flex', "justify-content": 'flex-start' }}>
            <IconButton
                variant="outlined"
                icon={<Icon name="arrow-left" size={20} />}
                aria-label="Back"
            />
        </div>
    );
};

// ── Progress Bar ───────────────────────────────────────────────

export const ProgressBarElement: Component<ElementRenderProps> = (props) => {
    const pages = () => props.totalPages || 3;

    return (
        <Show when={!props.isSmall} fallback={
            <div class="layout-progress-bar layout-progress-bar--small">
                <div class="layout-progress-bar__track">
                    <div class="layout-progress-bar__fill" style={{ width: '33%' }} />
                </div>
            </div>
        }>
            <div class="layout-progress-bar">
                <LinearProgress value={Math.round((1 / pages()) * 100)} />
                <Typography variant="label-small" color="secondary" align="center">
                    Step 1 of {pages()}
                </Typography>
            </div>
        </Show>
    );
};

// ── Breadcrumb ─────────────────────────────────────────────────

export const BreadcrumbElement: Component<ElementRenderProps> = (props) => {
    return (
        <Show when={!props.isSmall} fallback={
            <div class="layout-breadcrumb">
                <span class="layout-breadcrumb__step">Step 1</span>
                <Icon name="chevron-right" size={12} />
                <span class="layout-breadcrumb__step layout-breadcrumb__step--active">Step 2</span>
            </div>
        }>
            <div class="layout-breadcrumb">
                <span class="layout-breadcrumb__step">Personal Info</span>
                <Icon name="chevron-right" size={14} />
                <span class="layout-breadcrumb__step layout-breadcrumb__step--active">Contact Details</span>
                <Icon name="chevron-right" size={14} />
                <span class="layout-breadcrumb__step layout-breadcrumb__step--disabled">Review</span>
            </div>
        </Show>
    );
};

// ── Page Indicator ─────────────────────────────────────────────

export const PageIndicatorElement: Component<ElementRenderProps> = (props) => {
    const pages = () => props.totalPages || 3;

    return (
        <Chip
            variant="label"
            label={`Page 1 of ${pages()}`}
            size="sm"
            color="primary"
        />
    );
};

// ── Column Layouts ─────────────────────────────────────────────

export interface ColumnElementProps extends ElementRenderProps {
    target?: 'header' | 'footer';
    onDropInColumn?: (e: DragEvent, parentId: string, columnKey: 'column1' | 'column2' | 'column3', target: 'header' | 'footer') => void;
    renderChild?: (child: LayoutElement) => JSX.Element;
}

export const TwoColumnElement: Component<ColumnElementProps> = (props) => {
    const column1 = () => props.element.children?.column1 || [];
    const column2 = () => props.element.children?.column2 || [];
    const gap = () => {
        switch (props.element.columnGap) {
            case 'none': return '0';
            case 'small': return '8px';
            case 'large': return '24px';
            default: return '16px';
        }
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    };

    return (
        <div class="layout-columns layout-columns--two" style={{ gap: gap() }}>
            <div
                class="layout-column"
                onDragOver={handleDragOver}
                onDrop={(e) => props.onDropInColumn?.(e, props.element.id, 'column1', props.target || 'header')}
            >
                <Show when={column1().length > 0} fallback={
                    <div class="layout-column__empty">
                        <Icon name="plus" size={16} />
                        <Typography variant="label-small" color="secondary">Drop here</Typography>
                    </div>
                }>
                    <For each={column1()}>
                        {(child) => props.renderChild?.(child)}
                    </For>
                </Show>
            </div>
            <div
                class="layout-column"
                onDragOver={handleDragOver}
                onDrop={(e) => props.onDropInColumn?.(e, props.element.id, 'column2', props.target || 'header')}
            >
                <Show when={column2().length > 0} fallback={
                    <div class="layout-column__empty">
                        <Icon name="plus" size={16} />
                        <Typography variant="label-small" color="secondary">Drop here</Typography>
                    </div>
                }>
                    <For each={column2()}>
                        {(child) => props.renderChild?.(child)}
                    </For>
                </Show>
            </div>
        </div>
    );
};

export const ThreeColumnElement: Component<ColumnElementProps> = (props) => {
    const column1 = () => props.element.children?.column1 || [];
    const column2 = () => props.element.children?.column2 || [];
    const column3 = () => props.element.children?.column3 || [];
    const gap = () => {
        switch (props.element.columnGap) {
            case 'none': return '0';
            case 'small': return '8px';
            case 'large': return '24px';
            default: return '16px';
        }
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    };

    return (
        <div class="layout-columns layout-columns--three" style={{ gap: gap() }}>
            <div class="layout-column" onDragOver={handleDragOver}
                onDrop={(e) => props.onDropInColumn?.(e, props.element.id, 'column1', props.target || 'header')}>
                <Show when={column1().length > 0} fallback={
                    <div class="layout-column__empty">
                        <Icon name="plus" size={16} />
                        <Typography variant="label-small" color="secondary">Drop here</Typography>
                    </div>
                }>
                    <For each={column1()}>{(child) => props.renderChild?.(child)}</For>
                </Show>
            </div>
            <div class="layout-column" onDragOver={handleDragOver}
                onDrop={(e) => props.onDropInColumn?.(e, props.element.id, 'column2', props.target || 'header')}>
                <Show when={column2().length > 0} fallback={
                    <div class="layout-column__empty">
                        <Icon name="plus" size={16} />
                        <Typography variant="label-small" color="secondary">Drop here</Typography>
                    </div>
                }>
                    <For each={column2()}>{(child) => props.renderChild?.(child)}</For>
                </Show>
            </div>
            <div class="layout-column" onDragOver={handleDragOver}
                onDrop={(e) => props.onDropInColumn?.(e, props.element.id, 'column3', props.target || 'header')}>
                <Show when={column3().length > 0} fallback={
                    <div class="layout-column__empty">
                        <Icon name="plus" size={16} />
                        <Typography variant="label-small" color="secondary">Drop here</Typography>
                    </div>
                }>
                    <For each={column3()}>{(child) => props.renderChild?.(child)}</For>
                </Show>
            </div>
        </div>
    );
};
