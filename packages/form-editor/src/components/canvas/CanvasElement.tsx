/**
 * CanvasElement — Renders the actual M3 UI control based on element type.
 * Used inside the Canvas to show real form fields (not just type badges).
 */
import { Show, For, Switch as SwitchFlow, Match } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormElement } from '@formanywhere/shared/types';
import { TextField } from '@formanywhere/ui/textfield';
import { Switch } from '@formanywhere/ui/switch';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';

import { CanvasRegion } from './CanvasRegion';
import type { Accessor } from 'solid-js';

export interface CanvasElementProps {
    element: FormElement;
    dragSource: Accessor<'toolbar' | 'canvas' | null>;
    onCanvasDragStart?: (id: string) => void;
    onDragEnd?: () => void;
}

export const CanvasElement: Component<CanvasElementProps> = (props) => {
    const el = () => props.element;

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
                    <Switch disabled />
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
                    <Show when={el().label && el().type !== 'grid-column'}>
                        <div class="canvas-element__label-row">
                            <Icon name={el().type === 'card' ? 'credit-card' : 'box'} size={16} />
                            <Typography variant="label-medium">{el().label}</Typography>
                        </div>
                    </Show>

                    <CanvasRegion
                        elements={() => el().elements || []}
                        parentId={el().id}
                        dragSource={props.dragSource}
                        onCanvasDragStart={props.onCanvasDragStart}
                        onDragEnd={props.onDragEnd}
                        placeholder={`Drop content in ${el().type.replace('-', ' ')}`}
                    />
                </div>
            </Match>

            <Match when={el().type === 'grid'}>
                <div class="canvas-element__grid">
                    <div class="canvas-element__grid-columns">
                        {/* 
                            For Grid, we render children directly as they are columns.
                            We don't use CanvasRegion here because we want a specific DOM structure (flex row).
                            However, to allow reordering columns, we would need a horizontal properties/drag support.
                            For MVP, let's assume columns are fixed or use a horizontal list.
                            
                            Actually, to keep it consistent, we can map over elements manually here
                            or use a horizontal CanvasRegion if we supported it.
                            Let's just iterate and render each column (which is a grid-column element).
                        */}
                        <For each={el().elements || []}>
                            {(col) => (
                                <div class="canvas-element__grid-col">
                                    <CanvasElement
                                        element={col}
                                        dragSource={props.dragSource}
                                        onCanvasDragStart={props.onCanvasDragStart}
                                        onDragEnd={props.onDragEnd}
                                    />
                                </div>
                            )}
                        </For>
                    </div>
                </div>
            </Match>
        </SwitchFlow>
    );
};
