import { Component, For } from 'solid-js';
import { useFormEditor } from '../FormEditor';

export const Canvas: Component = () => {
    const { schema, selectedElement, setSelectedElement } = useFormEditor();

    return (
        <div data-canvas>
            <For each={schema().elements}>
                {(element, index) => (
                    <div
                        data-canvas-element
                        data-selected={selectedElement() === element.id}
                        onClick={() => setSelectedElement(element.id)}
                    >
                        <span data-element-type>{element.type}</span>
                        <span data-element-label>{element.label}</span>
                    </div>
                )}
            </For>
            {schema().elements.length === 0 && (
                <div data-canvas-empty>
                    Drag elements here to build your form
                </div>
            )}
        </div>
    );
};
