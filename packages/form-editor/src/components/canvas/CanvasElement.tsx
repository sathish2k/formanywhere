/**
 * CanvasElement — Renders the actual M3 UI control based on element type.
 * Used inside the Canvas to show real form fields (not just type badges).
 */
import { splitProps, Show, For, Switch as SwitchFlow, Match, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormElement } from '@formanywhere/shared/types';
import { TextField } from '@formanywhere/ui/textfield';
import { Switch } from '@formanywhere/ui/switch';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';

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
    const el = () => local.element;

    return (
        <SwitchFlow>
            {/* ── Text-based inputs ── */}
            <Match when={['text', 'email', 'phone', 'url'].includes(el().type)}>
                <TextField
                    variant="outlined"
                    label={el().label}
                    placeholder={el().placeholder || ''}
                    disabled
                />
            </Match>

            <Match when={el().type === 'number'}>
                <TextField
                    variant="outlined"
                    label={el().label}
                    placeholder={el().placeholder || '0'}
                    type="number"
                    disabled
                />
            </Match>

            <Match when={el().type === 'textarea'}>
                <div class="canvas-element__textarea-wrapper">
                    <Typography variant="body-small" color="on-surface-variant">{el().label}</Typography>
                    <textarea
                        class="canvas-element__textarea"
                        placeholder={el().placeholder || 'Enter text...'}
                        rows={3}
                        disabled
                    />
                </div>
            </Match>

            {/* ── Choice elements ── */}
            <Match when={el().type === 'select'}>
                <div class="canvas-element__select-wrapper">
                    <Typography variant="body-small" color="on-surface-variant">{el().label}</Typography>
                    <select class="canvas-element__select" disabled>
                        <option>{el().placeholder || 'Choose...'}</option>
                        <For each={el().options ?? []}>
                            {(opt) => <option value={opt.value}>{opt.label}</option>}
                        </For>
                    </select>
                </div>
            </Match>

            <Match when={el().type === 'checkbox'}>
                <div class="canvas-element__choice-group">
                    <Typography variant="body-medium">{el().label}</Typography>
                    <For each={el().options ?? []}>
                        {(opt) => (
                            <label class="canvas-element__choice-item">
                                <input type="checkbox" disabled />
                                <span>{opt.label}</span>
                            </label>
                        )}
                    </For>
                </div>
            </Match>

            <Match when={el().type === 'radio'}>
                <div class="canvas-element__choice-group">
                    <Typography variant="body-medium">{el().label}</Typography>
                    <For each={el().options ?? []}>
                        {(opt) => (
                            <label class="canvas-element__choice-item">
                                <input type="radio" name={el().id} disabled />
                                <span>{opt.label}</span>
                            </label>
                        )}
                    </For>
                </div>
            </Match>

            <Match when={el().type === 'switch'}>
                <div class="canvas-element__switch-row">
                    <Typography variant="body-medium">{el().label}</Typography>
                    <Switch size="sm" disabled />
                </div>
            </Match>

            {/* ── Date / Time ── */}
            <Match when={el().type === 'date'}>
                <TextField
                    variant="outlined"
                    label={el().label}
                    type="date"
                    disabled
                />
            </Match>

            <Match when={el().type === 'time'}>
                <TextField
                    variant="outlined"
                    label={el().label}
                    type="time"
                    disabled
                />
            </Match>

            {/* ── Advanced ── */}
            <Match when={el().type === 'file'}>
                <div class="canvas-element__file-upload">
                    <Typography variant="body-small" color="on-surface-variant">{el().label}</Typography>
                    <div class="canvas-element__file-dropzone">
                        <Icon name="upload" size={24} />
                        <Typography variant="body-small">Click or drag to upload</Typography>
                    </div>
                </div>
            </Match>

            <Match when={el().type === 'rating'}>
                <div class="canvas-element__rating">
                    <Typography variant="body-small" color="on-surface-variant">{el().label}</Typography>
                    <div class="canvas-element__stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Icon name="star" size={20} />
                        ))}
                    </div>
                </div>
            </Match>

            <Match when={el().type === 'signature'}>
                <div class="canvas-element__signature">
                    <Typography variant="body-small" color="on-surface-variant">{el().label}</Typography>
                    <div class="canvas-element__signature-pad">
                        <Icon name="pen-tool" size={20} />
                        <Typography variant="body-small" color="on-surface-variant">Sign here</Typography>
                    </div>
                </div>
            </Match>

            {/* ── Layout elements ── */}
            <Match when={el().type === 'heading'}>
                <Typography variant="headline-small">{el().label}</Typography>
            </Match>

            <Match when={el().type === 'divider'}>
                <Divider />
            </Match>

            <Match when={el().type === 'spacer'}>
                <div style={{ height: `${(el() as any).height ?? 24}px` }} />
            </Match>

            <Match when={el().type === 'text-block'}>
                <Typography variant="body-medium">{el().label}</Typography>
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
