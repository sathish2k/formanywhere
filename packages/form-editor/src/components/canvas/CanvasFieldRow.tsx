import { createSignal, Show, type Accessor } from 'solid-js';
import type { Component } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { IconButton } from '@formanywhere/ui/icon-button';
import { getElement } from '../elements/registry';
import { CanvasElement } from './CanvasElement';
import { useFormEditor } from '../FormEditor';
import type { FormElement } from '@formanywhere/shared/types';
import { generateId } from '@formanywhere/shared/utils';
import '../../styles.scss';

/** Layout types that can be dropped at root level */
const LAYOUT_TYPES = new Set([
    'container', 'grid', 'section', 'card', 'grid-column',
    'divider', 'spacer', 'heading', 'logo', 'text-block',
]);

export interface CanvasFieldRowProps {
    element: FormElement;
    index: number;
    parentId: string | null;
    isSelected: boolean;
    onSelect: (multi?: boolean) => void;
    onRemove: () => void;
    onCanvasDragStart?: (id: string) => void;
    onDragEnd?: () => void;
    dragSource: Accessor<'toolbar' | 'canvas' | null>;
}

/** A single field row on the canvas — supports drag reorder + drop indicator */
export const CanvasFieldRow: Component<CanvasFieldRowProps> = (props) => {
    const { addElement, moveElement, updateElement } = useFormEditor();
    const [isDragOver, setIsDragOver] = createSignal(false);
    const [showColPicker, setShowColPicker] = createSignal(false);

    // Helper to get element definition if needed
    const def = () => getElement(props.element.type);

    const handleDragStart = (e: DragEvent) => {
        e.stopPropagation(); // Prevent parent draggable from dragging
        // We set the element ID as data
        e.dataTransfer?.setData('application/x-form-id', props.element.id);
        e.dataTransfer!.effectAllowed = 'move';

        // Notify parent we started dragging this element ID
        props.onCanvasDragStart?.(props.element.id);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent parent region from handling this

        const hasType = e.dataTransfer?.types.includes('application/x-form-type');
        const hasId = e.dataTransfer?.types.includes('application/x-form-id');

        if (hasType || hasId) {
            const effect = props.dragSource() === 'toolbar' ? 'copy' : 'move';
            e.dataTransfer!.dropEffect = effect;
            setIsDragOver(true);
        }
    };

    const handleDragLeave = () => setIsDragOver(false);

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const newType = e.dataTransfer?.getData('application/x-form-type');
        const existingId = e.dataTransfer?.getData('application/x-form-id');

        if (newType) {
            // At root level (parentId === null), only allow layout elements
            if (!props.parentId && !LAYOUT_TYPES.has(newType)) {
                return;
            }
            addElement(newType as any, props.parentId, props.index);
        } else if (existingId) {
            if (existingId === props.element.id) return;
            moveElement(existingId, props.parentId, props.index);
        }
    };

    const isGridType = () => ['grid', 'container', 'section', 'card'].includes(props.element.type);

    /**
     * Handle column selection from dropdown.
     * Adds a new row of N columns inside the same grid element.
     */
    const handleColumnSelect = (count: number) => {
        const existing = props.element.elements || [];
        const newSpan = Math.floor(12 / count);
        const newCols: FormElement[] = Array.from({ length: count }, (_, i) => ({
            id: generateId(),
            type: 'grid-column' as FormElement['type'],
            label: `Column ${existing.length + i + 1}`,
            required: false,
            span: newSpan,
            elements: [],
        }));
        updateElement(props.element.id, { elements: [...existing, ...newCols] });
        setShowColPicker(false);
    };

    return (
        <div
            class="canvas-field"
            classList={{
                'canvas-field--selected': props.isSelected,
                'canvas-field--drop-target': isDragOver(),
                'canvas-field--grid-type': isGridType(),
                'canvas-field--hidden': !!(props.element as any).hidden,
            }}
            draggable={true}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={() => props.onDragEnd?.()}
            onClick={(e) => {
                e.stopPropagation();
                props.onSelect(e.metaKey || e.ctrlKey);
            }}
        >
            {/* Floating label on outline for grid-type elements */}
            <Show when={isGridType()}>
                <span class="canvas-field__outline-label">
                    <Icon name={def()?.icon ?? 'box'} size={12} />
                    {props.element.label}
                </span>
            </Show>

            {/* Drag handle */}
            <div class="canvas-field__drag-handle">
                <Icon name="grip-vertical" size={14} />
            </div>

            {/* Add column menu on outline — grid-type only */}
            <Show when={isGridType()}>
                <div
                    class="canvas-field__add-col-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowColPicker(!showColPicker());
                    }}
                >
                    <Icon name="plus" size={14} />
                </div>
                <Show when={showColPicker()}>
                    <div class="canvas-field__col-picker" onClick={(e) => e.stopPropagation()}>
                        <button class="canvas-field__col-option" onClick={() => handleColumnSelect(1)}>
                            <Icon name="square" size={14} />
                            1 Column
                        </button>
                        <button class="canvas-field__col-option" onClick={() => handleColumnSelect(2)}>
                            <Icon name="columns" size={14} />
                            2 Columns
                        </button>
                        <button class="canvas-field__col-option" onClick={() => handleColumnSelect(3)}>
                            <Icon name="grid-3x3" size={14} />
                            3 Columns
                        </button>
                    </div>
                </Show>
            </Show>

            {/* M3 field content (recursive CanvasElement) */}
            <div class="canvas-field__content">
                <CanvasElement
                    element={props.element}
                    dragSource={props.dragSource}
                    onCanvasDragStart={props.onCanvasDragStart}
                    onDragEnd={props.onDragEnd}
                />
            </div>

            {/* Actions — only on select (CSS handles visibility for grid-type) */}
            <Show when={props.isSelected}>
                <div class="canvas-field__actions">
                    <IconButton
                        variant="standard"
                        size="sm"
                        icon={<Icon name="trash" size={14} />}
                        onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            props.onRemove();
                        }}
                    />
                </div>
            </Show>

            {/* Required badge */}
            <Show when={props.element.required}>
                <span class="canvas-field__required-badge">*</span>
            </Show>

            {/* Hidden badge */}
            <Show when={(props.element as any).hidden}>
                <span class="canvas-field__hidden-badge">
                    <Icon name="eye-off" size={10} />
                    Hidden
                </span>
            </Show>
        </div>
    );
};
