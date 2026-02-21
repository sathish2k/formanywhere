/**
 * CanvasElement — Renders the actual M3 UI control based on element type.
 * Used inside the Canvas to show real form fields (not just type badges).
 */
import { splitProps, Show, For, Switch as SwitchFlow, Match, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormElement } from '@formanywhere/shared/types';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';
import {
    TextInputField, TextareaField, SelectField, CheckboxField,
    RadioField, SwitchField, FileField, RatingField, SignatureField,
} from '@formanywhere/domain/form';

import { CanvasRegion } from './CanvasRegion';
import { useFormEditor } from '../FormEditor';
import type { Accessor } from 'solid-js';

export interface CanvasElementProps {
    element: FormElement;
    dragSource: Accessor<'toolbar' | 'canvas' | null>;
    onCanvasDragStart?: (id: string) => void;
    onDragEnd?: () => void;
}

export const CanvasElement: Component<CanvasElementProps> = (props) => {
    const [local] = splitProps(props, ['element', 'dragSource', 'onCanvasDragStart', 'onDragEnd']);
    const { updateElement } = useFormEditor();
    const el = () => local.element;

    return (
        <SwitchFlow>
            {/* ── Form field elements — interactive, updates element.defaultValue ── */}
            <Match when={['text', 'email', 'phone', 'url', 'number', 'date', 'time'].includes(el().type)}>
                <TextInputField
                    mode="editor"
                    element={el()}
                    value={() => (el() as any).defaultValue ?? ''}
                    onValue={(v) => updateElement(el().id, { defaultValue: v })}
                />
            </Match>

            <Match when={el().type === 'textarea'}>
                <TextareaField
                    mode="editor"
                    element={el()}
                    value={() => (el() as any).defaultValue ?? ''}
                    onValue={(v) => updateElement(el().id, { defaultValue: v })}
                />
            </Match>

            <Match when={el().type === 'select'}>
                <SelectField
                    mode="editor"
                    element={el()}
                    value={() => (el() as any).defaultValue ?? ''}
                    onValue={(v) => updateElement(el().id, { defaultValue: v })}
                />
            </Match>

            <Match when={el().type === 'checkbox'}>
                <CheckboxField
                    mode="editor"
                    element={el()}
                    value={() => (el() as any).defaultValue ?? ''}
                    onValue={(v) => updateElement(el().id, { defaultValue: v })}
                />
            </Match>

            <Match when={el().type === 'radio'}>
                <RadioField
                    mode="editor"
                    element={el()}
                    value={() => (el() as any).defaultValue ?? ''}
                    onValue={(v) => updateElement(el().id, { defaultValue: v })}
                />
            </Match>

            <Match when={el().type === 'switch'}>
                <SwitchField
                    mode="editor"
                    element={el()}
                    value={() => (el() as any).defaultValue ?? ''}
                    onValue={(v) => updateElement(el().id, { defaultValue: v })}
                />
            </Match>

            <Match when={el().type === 'file'}>
                <FileField
                    mode="editor"
                    element={el()}
                    value={() => (el() as any).defaultValue ?? ''}
                    onValue={(v) => updateElement(el().id, { defaultValue: v })}
                />
            </Match>

            <Match when={el().type === 'rating'}>
                <RatingField
                    mode="editor"
                    element={el()}
                    value={() => (el() as any).defaultValue ?? ''}
                    onValue={(v) => updateElement(el().id, { defaultValue: v })}
                />
            </Match>

            <Match when={el().type === 'signature'}>
                <SignatureField
                    mode="editor"
                    element={el()}
                    value={() => (el() as any).defaultValue ?? ''}
                    onValue={(v) => updateElement(el().id, { defaultValue: v })}
                />
            </Match>

            {/* ── Layout elements ── */}
            <Match when={el().type === 'heading'}>
                <div
                    class="canvas-element__heading"
                    style={{
                        'font-size': ({ '1': '2rem', '2': '1.5rem', '3': '1.25rem', '4': '1.125rem' } as any)[(el() as any).level ?? '2'] ?? '1.5rem',
                        'font-weight': String((el() as any).headingWeight ?? '700'),
                        'text-align': (el() as any).alignment ?? 'left',
                        color: (el() as any).headingColor || 'inherit',
                        margin: '0',
                        'line-height': '1.25',
                    }}
                >
                    {el().label}
                </div>
            </Match>

            <Match when={el().type === 'divider'}>
                <Divider />
            </Match>

            <Match when={el().type === 'spacer'}>
                <div style={{ height: `${(el() as any).height ?? 24}px` }} />
            </Match>

            <Match when={el().type === 'text-block'}>
                <p
                    class="canvas-element__text-block"
                    style={{ 'text-align': (el() as any).alignment ?? 'left', margin: '0', color: 'var(--m3-color-on-surface-variant)' }}
                >
                    {el().label}
                </p>
            </Match>

            <Match when={el().type === 'logo'}>
                <div class="canvas-element__logo">
                    <Show when={(el() as any).src} fallback={
                        <div class="canvas-element__logo-placeholder">
                            <Icon name="image" size={32} />
                            <Typography variant="body-small">Logo</Typography>
                        </div>
                    }>
                        <img src={(el() as any).src} alt={el().label} style={{ 'max-width': '100%', height: 'auto' }} />
                    </Show>
                </div>
            </Match>

            {/* ── Layout elements ── */}
            <Match when={['container', 'section', 'card', 'grid-column'].includes(el().type)}>
                <div
                    class={`canvas-element__${el().type}`}
                    classList={{ 'canvas-element__nested-region': true }}
                    style={{
                        padding: el().type === 'container' ? `${(el() as any).padding ?? 16}px` : undefined,
                        margin: (el() as any).margin ? `${(el() as any).margin}px` : undefined,
                        'max-width': el().type === 'container' && (el() as any).maxWidth ? `${(el() as any).maxWidth}px` : undefined,
                    }}
                >
                    <CanvasRegion
                        elements={() => el().elements || []}
                        parentId={el().id}
                        dragSource={local.dragSource}
                        onCanvasDragStart={local.onCanvasDragStart}
                        onDragEnd={local.onDragEnd}
                        placeholder={`Drop content in ${el().type.replace('-', ' ')}`}
                    />
                </div>
            </Match>

            <Match when={el().type === 'grid'}>
                <GridElement
                    element={el()}
                    dragSource={local.dragSource}
                    onCanvasDragStart={local.onCanvasDragStart}
                    onDragEnd={local.onDragEnd}
                />
            </Match>
        </SwitchFlow>
    );
};

/** Grid element with visual columns and width adjustment */
const GridElement: Component<{
    element: FormElement;
    dragSource: Accessor<'toolbar' | 'canvas' | null>;
    onCanvasDragStart?: (id: string) => void;
    onDragEnd?: () => void;
}> = (props) => {
    const [local] = splitProps(props, ['element', 'dragSource', 'onCanvasDragStart', 'onDragEnd']);
    const { updateElement, selectedElement, setSelectedElement } = useFormEditor();

    const columns = () => local.element.elements || [];
    const totalSpan = () => columns().reduce((sum, c) => sum + ((c as any).span || 1), 0);

    const updateColumnWidth = (colId: string, newSpan: number) => {
        const updatedCols = columns().map((col) =>
            col.id === colId ? { ...col, span: newSpan } : col
        );
        updateElement(local.element.id, { elements: updatedCols });
    };

    const deleteColumn = (colId: string) => {
        const remaining = columns().filter((col) => col.id !== colId);
        updateElement(local.element.id, { elements: remaining });
        if (selectedElement() === colId) setSelectedElement(local.element.id);
    };

    return (
        <div class="canvas-element__grid">
            <div class="canvas-element__grid-columns">
                <For each={columns()}>
                    {(col) => (
                        <GridColumnEl
                            col={col}
                            totalSpan={totalSpan()}
                            isSelected={selectedElement() === col.id}
                            onSelect={() => setSelectedElement(col.id)}
                            onDelete={() => deleteColumn(col.id)}
                            onUpdateWidth={(span) => updateColumnWidth(col.id, span)}
                            dragSource={local.dragSource}
                            onCanvasDragStart={local.onCanvasDragStart}
                            onDragEnd={local.onDragEnd}
                        />
                    )}
                </For>
            </div>
        </div>
    );
};

/** Individual grid column with width badge and popover */
const GridColumnEl: Component<{
    col: FormElement;
    totalSpan: number;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onUpdateWidth: (span: number) => void;
    dragSource: Accessor<'toolbar' | 'canvas' | null>;
    onCanvasDragStart?: (id: string) => void;
    onDragEnd?: () => void;
}> = (props) => {
    const [local] = splitProps(props, ['col', 'totalSpan', 'isSelected', 'onSelect', 'onDelete', 'onUpdateWidth', 'dragSource', 'onCanvasDragStart', 'onDragEnd']);
    const [showWidthPopup, setShowWidthPopup] = createSignal(false);
    const span = () => (local.col as any).span || 1;

    return (
        <div
            class="canvas-element__grid-col"
            classList={{ 'canvas-element__grid-col--selected': local.isSelected }}
            style={{ width: `${(span() / 12) * 100}%` }}
            onClick={(e) => {
                e.stopPropagation();
                local.onSelect();
            }}
        >
            {/* Delete column button */}
            <button
                class="canvas-element__grid-col-delete"
                onClick={(e) => {
                    e.stopPropagation();
                    local.onDelete();
                }}
            >
                <Icon name="minus" size={12} />
            </button>

            {/* Width badge */}
            <div
                class="canvas-element__grid-col-badge"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowWidthPopup(!showWidthPopup());
                }}
            >
                {span()}/12
            </div>

            {/* Width popup */}
            <Show when={showWidthPopup()}>
                <div class="canvas-element__grid-col-width-popup" onClick={(e) => e.stopPropagation()}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((v) => (
                        <button
                            classList={{ active: span() === v }}
                            onClick={() => {
                                local.onUpdateWidth(v);
                                setShowWidthPopup(false);
                            }}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </Show>

            {/* Column drop zone */}
            <div class="canvas-element__grid-col-inner">
                <CanvasRegion
                    elements={() => local.col.elements || []}
                    parentId={local.col.id}
                    dragSource={local.dragSource}
                    onCanvasDragStart={local.onCanvasDragStart}
                    onDragEnd={local.onDragEnd}
                    placeholder="Drop elements here"
                />
            </div>
        </div>
    );
};
