import { Component } from 'solid-js';
import { FORM_ELEMENT_TYPES } from '@formanywhere/shared';
import { useFormEditor } from '../FormEditor';

export const Toolbar: Component = () => {
    const { addElement } = useFormEditor();

    return (
        <div data-toolbar>
            <h3>Elements</h3>
            <div data-toolbar-elements>
                {FORM_ELEMENT_TYPES.map((type) => (
                    <button
                        data-toolbar-element
                        onClick={() => addElement(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
};
