/**
 * Properties Panel — reads property definitions from element registry
 */
import { Show, createMemo, For } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormElement } from '@formanywhere/shared/types';
import { Typography } from '@formanywhere/ui/typography';
import { TextField } from '@formanywhere/ui/textfield';
import { Switch } from '@formanywhere/ui/switch';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';
import { getElement } from '../elements/registry';
import type { PropertyField } from '../elements/types';
import { useFormEditor } from '../FormEditor';
import '../../styles.scss';

export const PropertiesPanel: Component = () => {
    const { schema, selectedElement, updateElement, removeElement, setSelectedElement } = useFormEditor();

    /** Recursively search the element tree (handles nested containers, grids, etc.) */
    const findElementById = (elements: FormElement[], id: string): FormElement | undefined => {
        for (const el of elements) {
            if (el.id === id) return el;
            if (el.elements) {
                const found = findElementById(el.elements, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    const currentElement = createMemo(() => {
        const id = selectedElement();
        return id ? findElementById(schema().elements, id) : undefined;
    });

    /** Get the element definition from the registry */
    const elementDef = createMemo(() => {
        const el = currentElement();
        return el ? getElement(el.type) : undefined;
    });

    /** Group property fields by their `group` key */
    const groupedProperties = createMemo(() => {
        const def = elementDef();
        if (!def) return [];

        const groups = new Map<string, PropertyField[]>();
        for (const field of def.properties) {
            const group = field.group || 'General';
            if (!groups.has(group)) groups.set(group, []);
            groups.get(group)!.push(field);
        }
        return Array.from(groups.entries()).map(([title, fields]) => ({ title, fields }));
    });

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
                    const def = () => elementDef();

                    return (
                        <div class="form-properties__content">
                            {/* Element type header */}
                            <div class="form-properties__type-badge">
                                <Icon name={def()?.icon ?? 'help-circle'} size={16} />
                                <Typography variant="label-medium">{def()?.label ?? element().type}</Typography>
                            </div>

                            {/* Render property groups from the registry */}
                            <For each={groupedProperties()}>
                                {(group, idx) => (
                                    <>
                                        <Show when={idx() > 0}>
                                            <Divider />
                                        </Show>
                                        <div class="form-properties__section">
                                            <Typography variant="label-medium" color="on-surface-variant" class="form-properties__section-title">
                                                {group.title}
                                            </Typography>
                                            <For each={group.fields}>
                                                {(field) => (
                                                    <PropertyFieldRenderer
                                                        field={field}
                                                        value={(element() as any)[field.key]}
                                                        onChange={(val) => updateElement(element().id, { [field.key]: val } as any)}
                                                    />
                                                )}
                                            </For>
                                        </div>
                                    </>
                                )}
                            </For>

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

/** Generic property field renderer — renders the appropriate control based on PropertyField.type */
const PropertyFieldRenderer: Component<{
    field: PropertyField;
    value: any;
    onChange: (val: any) => void;
}> = (props) => {
    // Boolean → Switch
    if (props.field.type === 'boolean') {
        return (
            <div class="form-properties__switch-row">
                <Typography variant="body-medium">{props.field.label}</Typography>
                <Switch
                    checked={props.value ?? props.field.defaultValue ?? false}
                    onChange={(checked) => props.onChange(checked)}
                />
            </div>
        );
    }

    // Select → Dropdown
    if (props.field.type === 'select') {
        return (
            <div class="form-properties__field">
                <label class="form-properties__select-label">
                    <Typography variant="body-small" color="on-surface-variant">{props.field.label}</Typography>
                    <select
                        class="form-properties__select"
                        value={String(props.value ?? props.field.defaultValue ?? '')}
                        onChange={(e) => props.onChange(e.currentTarget.value)}
                    >
                        <For each={props.field.options ?? []}>
                            {(opt) => <option value={opt.value}>{opt.label}</option>}
                        </For>
                    </select>
                </label>
            </div>
        );
    }

    // Textarea → Multi-line input
    if (props.field.type === 'textarea') {
        return (
            <div class="form-properties__field">
                <label class="form-properties__textarea-label">
                    <Typography variant="body-small" color="on-surface-variant">{props.field.label}</Typography>
                    <textarea
                        class="form-properties__textarea"
                        rows={3}
                        value={String(props.value ?? props.field.defaultValue ?? '')}
                        onInput={(e) => props.onChange(e.currentTarget.value)}
                    />
                </label>
                <Show when={props.field.helpText}>
                    <Typography variant="body-small" color="on-surface-variant" class="form-properties__help-text">
                        {props.field.helpText}
                    </Typography>
                </Show>
            </div>
        );
    }

    // Color → Color picker
    if (props.field.type === 'color') {
        return (
            <div class="form-properties__field form-properties__color-row">
                <Typography variant="body-medium">{props.field.label}</Typography>
                <input
                    type="color"
                    class="form-properties__color-input"
                    value={String(props.value ?? props.field.defaultValue ?? '#000000')}
                    onInput={(e) => props.onChange(e.currentTarget.value)}
                />
            </div>
        );
    }

    // Default: text or number → TextField
    return (
        <div class="form-properties__field">
            <TextField
                variant="outlined"
                label={props.field.label}
                type={props.field.type === 'number' ? 'number' : 'text'}
                value={String(props.value ?? props.field.defaultValue ?? '')}
                onInput={(e) => {
                    const raw = (e.target as HTMLInputElement).value;
                    props.onChange(props.field.type === 'number' ? Number(raw) : raw);
                }}
            />
            <Show when={props.field.helpText}>
                <Typography variant="body-small" color="on-surface-variant" class="form-properties__help-text">
                    {props.field.helpText}
                </Typography>
            </Show>
        </div>
    );
};
