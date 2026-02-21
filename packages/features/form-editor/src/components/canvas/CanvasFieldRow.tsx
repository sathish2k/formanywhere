import { splitProps } from 'solid-js';
import { createSignal, Show, type Accessor } from 'solid-js';
import type { Component } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { IconButton } from '@formanywhere/ui/icon-button';
import { getElement } from '../../registry';
import { isLayoutElement } from '@formanywhere/domain/form';
import { CanvasElement } from './CanvasElement';
import { useFormEditor } from '../FormEditor';
import type { FormElement } from '@formanywhere/shared/types';
import { generateId } from '@formanywhere/shared/utils';
import './styles.scss';

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
    const [local] = splitProps(props, ['element', 'index', 'isSelected', 'onSelect', 'onRemove', 'parentId', 'dragSource', 'onCanvasDragStart', 'onDragEnd']);
    const { addElement, moveElement, updateElement } = useFormEditor();
    const [isDragOver, setIsDragOver] = createSignal(false);
    const [showColPicker, setShowColPicker] = createSignal(false);

    // Helper to get element definition if needed
    const def = () => getElement(local.element.type);

    const handleDragStart = (e: DragEvent) => {
        e.stopPropagation(); // Prevent parent draggable from dragging
        // We set the element ID as data
        e.dataTransfer?.setData('application/x-form-id', local.element.id);
        e.dataTransfer!.effectAllowed = 'move';

        // Notify parent we started dragging this element ID
        local.onCanvasDragStart?.(local.element.id);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent parent region from handling this

        const hasType = e.dataTransfer?.types.includes('application/x-form-type');
        const hasId = e.dataTransfer?.types.includes('application/x-form-id');

        if (hasType || hasId) {
            const effect = local.dragSource() === 'toolbar' ? 'copy' : 'move';
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
            if (!local.parentId && !isLayoutElement(newType)) {
                return;
            }
            addElement(newType as any, local.parentId, local.index);
        } else if (existingId) {
            if (existingId === local.element.id) return;
            moveElement(existingId, local.parentId, local.index);
        }
    };

    const isGridType = () => ['grid', 'container', 'section', 'card'].includes(local.element.type);

    /**
     * Handle column selection from dropdown.
     * Adds a new row of N columns inside the same grid element.
     */
    const handleColumnSelect = (count: number) => {
        const existing = local.element.elements || [];
        const newSpan = Math.floor(12 / count);
        const newCols: FormElement[] = Array.from({ length: count }, (_, i) => ({
            id: generateId(),
            type: 'grid-column' as FormElement['type'],
            label: `Column ${existing.length + i + 1}`,
            required: false,
            span: newSpan,
            elements: [],
        }));
        updateElement(local.element.id, { elements: [...existing, ...newCols] });
        setShowColPicker(false);
    };

    return (
        <div
            class="canvas-field"
            classList={{
                'canvas-field--selected': local.isSelected,
                'canvas-field--drop-target': isDragOver(),
                'canvas-field--grid-type': isGridType(),
                'canvas-field--hidden': !!(local.element as any).hidden,
            }}
            draggable={true}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={() => local.onDragEnd?.()}
            onClick={(e) => {
                e.stopPropagation();
                local.onSelect(e.metaKey || e.ctrlKey);
            }}
        >
            {/* Floating label on outline for grid-type elements */}
            <Show when={isGridType()}>
                <span class="canvas-field__outline-label">
                    <Icon name={def()?.icon ?? 'box'} size={12} />
                    {local.element.label}
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
                    element={local.element}
                    dragSource={local.dragSource}
                    onCanvasDragStart={local.onCanvasDragStart}
                    onDragEnd={local.onDragEnd}
                />
            </div>

            {/* Actions — visible on hover or select via CSS */}
            <div class="canvas-field__actions" onClick={(e) => e.stopPropagation()}>
                <IconButton
                    variant="standard"
                    size="sm"
                    icon={<Icon name="trash" size={14} />}
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        local.onRemove();
                    }}
                />
            </div>

            {/* Required badge */}
            <Show when={local.element.required}>
                <span class="canvas-field__required-badge">*</span>
            </Show>

            {/* Hidden badge */}
            <Show when={(local.element as any).hidden}>
                <span class="canvas-field__hidden-badge">
                    <Icon name="eye-off" size={10} />
                    Hidden
                </span>
            </Show>
        </div>
    );
};
