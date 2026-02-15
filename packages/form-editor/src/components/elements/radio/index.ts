/** Radio Element */
import type { ElementDefinition } from '../types';

export const radioElement: ElementDefinition = {
    type: 'radio',
    label: 'Multiple Choice',
    icon: 'radio',
    category: 'choice',
    color: '#FF5722',
    defaults: { label: 'Radio Group', options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] },
    properties: [
        { key: 'label', label: 'Label', type: 'text', defaultValue: '', group: 'General' },
        { key: 'helperText', label: 'Helper Text', type: 'text', defaultValue: '' },
        { key: 'description', label: 'Description', type: 'textarea', defaultValue: '' },
        { key: 'defaultValue', label: 'Default Value', type: 'text', defaultValue: '' },
        { key: 'tooltip', label: 'Tooltip', type: 'text', defaultValue: '' },
        { key: 'required', label: 'Required', type: 'boolean', defaultValue: false, group: 'Validation' },
        { key: 'customError', label: 'Custom Error', type: 'text', helpText: 'Shown when validation fails' },
        {
            key: 'layout', label: 'Layout', type: 'select', options: [
                { label: 'Vertical', value: 'vertical' }, { label: 'Horizontal', value: 'horizontal' },
            ], defaultValue: 'vertical', group: 'Appearance'
        },
        { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false, group: 'State' },
        { key: 'hidden', label: 'Hidden', type: 'boolean', defaultValue: false },
        {
            key: 'width', label: 'Width', type: 'select', options: [
                { label: '25%', value: '25' }, { label: '50%', value: '50' },
                { label: '75%', value: '75' }, { label: '100%', value: '100' },
            ], defaultValue: '100', group: 'Appearance'
        },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};
