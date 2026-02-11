import { Show, createMemo, For } from 'solid-js';
import type { Component } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { TextField } from '@formanywhere/ui/textfield';
import { Switch } from '@formanywhere/ui/switch';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';
import { useFormEditor } from '../FormEditor';
import '../../styles.scss';

const ELEMENT_META: Record<string, { icon: string; label: string }> = {
    text: { icon: 'type', label: 'Text Field' },
    email: { icon: 'at-sign', label: 'Email' },
    number: { icon: 'hash', label: 'Number' },
    textarea: { icon: 'align-left', label: 'Text Area' },
    select: { icon: 'list', label: 'Dropdown' },
    checkbox: { icon: 'checkbox-checked', label: 'Checkbox' },
    radio: { icon: 'radio', label: 'Radio Group' },
    date: { icon: 'calendar', label: 'Date Picker' },
    file: { icon: 'upload', label: 'File Upload' },
    signature: { icon: 'pen-tool', label: 'Signature' },
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
    // Additional
    phone: { icon: 'phone', label: 'Phone' },
    url: { icon: 'link', label: 'URL' },
    switch: { icon: 'toggle-left', label: 'Switch' },
    time: { icon: 'clock', label: 'Time' },
    rating: { icon: 'star', label: 'Rating' },
};

export const PropertiesPanel: Component = () => {
    const { schema, selectedElement, updateElement, removeElement, setSelectedElement } = useFormEditor();

    const currentElement = createMemo(() =>
        schema().elements.find((el) => el.id === selectedElement())
    );

    return (
        <div class="form-properties">
            <div class="form-properties__header">
                <Icon name="settings" size={18} />
                <Typography variant="title-small">Properties</Typography>
            </div>

            <Show
                when={currentElement()}
                fallback={
                    <div class="form-properties__empty">
                        <div class="form-properties__empty-icon">
                            <Icon name="sliders" size={36} />
                        </div>
                        <Typography variant="body-medium" color="on-surface-variant">
                            Select a field to edit its properties
                        </Typography>
                    </div>
                }
            >
                {(element) => {
                    const meta = () => ELEMENT_META[element().type] || { icon: 'help-circle', label: element().type };

                    return (
                        <div class="form-properties__content">
                            {/* Element type header */}
                            <div class="form-properties__type-badge">
                                <Icon name={meta().icon} size={16} />
                                <Typography variant="label-medium">{meta().label}</Typography>
                            </div>

                            {/* Label */}
                            <div class="form-properties__section">
                                <TextField
                                    variant="outlined"
                                    label="Label"
                                    value={element().label}
                                    onInput={(e) => updateElement(element().id, { label: (e.target as HTMLInputElement).value })}
                                />
                            </div>

                            {/* Placeholder (not for checkbox) */}
                            <Show when={element().type !== 'checkbox' && element().type !== 'radio'}>
                                <div class="form-properties__section">
                                    <TextField
                                        variant="outlined"
                                        label="Placeholder"
                                        value={element().placeholder ?? ''}
                                        onInput={(e) => updateElement(element().id, { placeholder: (e.target as HTMLInputElement).value })}
                                    />
                                </div>
                            </Show>

                            <Divider />

                            {/* Validation */}
                            <div class="form-properties__section">
                                <Typography variant="label-medium" color="on-surface-variant" class="form-properties__section-title">
                                    Validation
                                </Typography>
                                <div class="form-properties__switch-row">
                                    <Typography variant="body-medium">Required</Typography>
                                    <Switch
                                        checked={element().required ?? false}
                                        onChange={(checked) => updateElement(element().id, { required: checked })}
                                    />
                                </div>
                            </div>

                            <Divider />

                            {/* Danger zone */}
                            <div class="form-properties__section form-properties__section--danger">
                                <Button
                                    variant="text"
                                    onClick={() => {
                                        removeElement(element().id);
                                        setSelectedElement(null);
                                    }}
                                    class="form-properties__delete-btn"
                                >
                                    <Icon name="trash" size={16} />
                                    Delete Field
                                </Button>
                            </div>
                        </div>
                    );
                }}
            </Show>
        </div>
    );
};
