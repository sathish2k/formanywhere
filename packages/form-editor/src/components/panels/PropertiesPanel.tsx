import { Component, Show, createMemo } from 'solid-js';
import { Input } from '@formanywhere/ui/input';
import { useFormEditor } from '../FormEditor';

export const PropertiesPanel: Component = () => {
    const { schema, selectedElement, updateElement, removeElement } = useFormEditor();

    const currentElement = createMemo(() =>
        schema().elements.find((el) => el.id === selectedElement())
    );

    return (
        <div data-properties-panel>
            <h3>Properties</h3>
            <Show
                when={currentElement()}
                fallback={<p>Select an element to edit its properties</p>}
            >
                {(element) => (
                    <div data-properties-form>
                        <Input
                            label="Label"
                            value={element().label}
                            onInput={(e) => updateElement(element().id, { label: (e.currentTarget as HTMLInputElement)?.value })}
                        />
                        <Input
                            label="Placeholder"
                            value={element().placeholder ?? ''}
                            onInput={(e) => updateElement(element().id, { placeholder: (e.currentTarget as HTMLInputElement)?.value })}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={element().required}
                                onChange={(e) => updateElement(element().id, { required: e.currentTarget.checked })}
                            />
                            Required
                        </label>
                        <button
                            data-danger
                            onClick={() => removeElement(element().id)}
                        >
                            Delete Element
                        </button>
                    </div>
                )}
            </Show>
        </div>
    );
};
