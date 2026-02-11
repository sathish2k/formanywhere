import { For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Button } from '@formanywhere/ui/button';
import type { FormElementType } from '@formanywhere/shared/types';
import { useFormEditor } from '../FormEditor';
import '../../styles.scss';

/** Map element types to display-friendly labels */
const ELEMENT_META: Record<string, { icon: string; label: string }> = {
    // Layout
    container: { icon: 'box', label: 'Container' },
    grid: { icon: 'grid-3x3', label: 'Grid' },
    section: { icon: 'layout', label: 'Section' },
    card: { icon: 'credit-card', label: 'Card' },
    'grid-column': { icon: 'columns', label: 'Column' },
    divider: { icon: 'minus', label: 'Divider' },
    spacer: { icon: 'move-vertical', label: 'Spacer' },
    heading: { icon: 'heading', label: 'Heading' },
    logo: { icon: 'image', label: 'Logo' },
    'text-block': { icon: 'align-left', label: 'Text Block' },
    // Text
    text: { icon: 'type', label: 'Text' },
    textarea: { icon: 'align-left', label: 'Textarea' },
    email: { icon: 'at-sign', label: 'Email' },
    phone: { icon: 'phone', label: 'Phone' },
    number: { icon: 'hash', label: 'Number' },
    url: { icon: 'link', label: 'URL' },
    // Choice
    select: { icon: 'list', label: 'Select' },
    radio: { icon: 'radio', label: 'Radio' },
    checkbox: { icon: 'checkbox-checked', label: 'Checkbox' },
    switch: { icon: 'toggle-left', label: 'Switch' },
    // Date & Time
    date: { icon: 'calendar', label: 'Date' },
    time: { icon: 'clock', label: 'Time' },
    // Advanced
    file: { icon: 'upload', label: 'File' },
    rating: { icon: 'star', label: 'Rating' },
    signature: { icon: 'pen-tool', label: 'Signature' },
};

export const Canvas: Component = () => {
    const { schema, selectedElement, setSelectedElement, removeElement, moveElement, addElement } = useFormEditor();

    const handleCreateGrid = () => {
        addElement('grid');
    };

    return (
        <div class="form-canvas">
            {/* Fields list */}
            <Show when={schema().elements.length > 0}>
                <div class="form-canvas__fields-container">
                    <For each={schema().elements}>
                        {(element, index) => {
                            const meta = () => ELEMENT_META[element.type] || { icon: 'help-circle', label: element.type };
                            const isSelected = () => selectedElement() === element.id;

                            return (
                                <div
                                    class={`form-canvas__field-item ${isSelected() ? 'form-canvas__field-item--selected' : ''}`}
                                    onClick={() => setSelectedElement(element.id)}
                                >
                                    <span class="form-canvas__drag-handle">
                                        <Icon name="grip-vertical" size={14} />
                                    </span>
                                    <span class="form-canvas__field-type">{meta().label}</span>
                                    <span class="form-canvas__field-label">{element.label}</span>
                                    <Show when={element.required}>
                                        <span class="form-canvas__field-required">Required</span>
                                    </Show>

                                    <Show when={isSelected()}>
                                        <div class="form-canvas__field-actions">
                                            <Show when={index() > 0}>
                                                <IconButton
                                                    variant="standard"
                                                    icon={<Icon name="arrow-up" size={14} />}
                                                    onClick={(e: MouseEvent) => { e.stopPropagation(); moveElement(index(), index() - 1); }}
                                                />
                                            </Show>
                                            <Show when={index() < schema().elements.length - 1}>
                                                <IconButton
                                                    variant="standard"
                                                    icon={<Icon name="arrow-down" size={14} />}
                                                    onClick={(e: MouseEvent) => { e.stopPropagation(); moveElement(index(), index() + 1); }}
                                                />
                                            </Show>
                                            <IconButton
                                                variant="standard"
                                                icon={<Icon name="trash" size={14} />}
                                                onClick={(e: MouseEvent) => { e.stopPropagation(); removeElement(element.id); }}
                                            />
                                        </div>
                                    </Show>
                                </div>
                            );
                        }}
                    </For>
                </div>
            </Show>

            {/* Empty state — matching reference design */}
            <Show when={schema().elements.length === 0}>
                <div class="form-canvas__empty">
                    <div class="form-canvas__empty-icon">
                        <Icon name="sparkle" size={56} />
                    </div>
                    <Typography variant="headline-small">
                        Start Building Your Form
                    </Typography>
                    <Typography variant="body-medium" color="on-surface-variant">
                        Create a responsive grid layout to organize your form elements, or drag elements from the sidebar.
                    </Typography>

                    <Button
                        variant="filled"
                        class="form-canvas__empty-cta"
                        onClick={handleCreateGrid}
                    >
                        <Icon name="grid-3x3" size={18} />
                        Create Grid Layout
                    </Button>

                    <div class="form-canvas__empty-divider">
                        <span class="form-canvas__empty-divider-line" />
                        <span class="form-canvas__empty-divider-text">OR</span>
                        <span class="form-canvas__empty-divider-line" />
                    </div>

                    <div class="form-canvas__empty-hint">
                        <Icon name="mouse-pointer" size={18} />
                        <span>Drag elements from the left sidebar to start building</span>
                    </div>
                </div>
            </Show>
        </div>
    );
};
