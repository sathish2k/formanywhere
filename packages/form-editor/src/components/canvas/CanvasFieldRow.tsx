import { createSignal, Show, type Accessor } from 'solid-js';
import type { Component } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { IconButton } from '@formanywhere/ui/icon-button';
import { getElement } from '../elements/registry';
import { CanvasElement } from './CanvasElement';
import { useFormEditor } from '../FormEditor';
import type { FormElement } from '@formanywhere/shared/types';
import '../../styles.scss';

export interface CanvasFieldRowProps {
    element: FormElement;
    index: number;
    parentId: string | null;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
    onCanvasDragStart?: (id: string) => void;
    onDragEnd?: () => void;
    dragSource: Accessor<'toolbar' | 'canvas' | null>;
}

/** A single field row on the canvas — supports drag reorder + drop indicator */
export const CanvasFieldRow: Component<CanvasFieldRowProps> = (props) => {
    const { addElement, moveElement } = useFormEditor();
    const [isDragOver, setIsDragOver] = createSignal(false);

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
            // Drop on a row = insert BEFORE this row
            addElement(newType as any, props.parentId, props.index);
        } else if (existingId) {
            // Don't move if dropping on itself
            if (existingId === props.element.id) return;
            moveElement(existingId, props.parentId, props.index);
        }
    };

    return (
        <div
            class="canvas-field"
            classList={{
                'canvas-field--selected': props.isSelected,
                'canvas-field--drop-target': isDragOver(),
            }}
            draggable={true}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={() => props.onDragEnd?.()}
            onClick={(e) => {
                e.stopPropagation();
                props.onSelect();
            }}
        >
            {/* Drag handle */}
            <div class="canvas-field__drag-handle">
                <Icon name="grip-vertical" size={14} />
            </div>

            {/* M3 field content (recursive CanvasElement) */}
            <div class="canvas-field__content">
                <CanvasElement
                    element={props.element}
                    dragSource={props.dragSource}
                    onCanvasDragStart={props.onCanvasDragStart}
                    onDragEnd={props.onDragEnd}
                />
            </div>

            {/* Actions */}
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
        </div>
    );
};
