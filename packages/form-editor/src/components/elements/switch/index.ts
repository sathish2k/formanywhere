/** Switch Element */
import type { ElementDefinition } from '../types';

export const switchElement: ElementDefinition = {
    type: 'switch',
    label: 'Yes/No',
    icon: 'toggle-left',
    category: 'choice',
    color: '#E91E63',
    defaults: { label: 'Toggle' },
    properties: [
        { key: 'label', label: 'Label', type: 'text', defaultValue: '', group: 'General' },
        { key: 'helperText', label: 'Helper Text', type: 'text', defaultValue: '' },
        { key: 'description', label: 'Description', type: 'textarea', defaultValue: '' },
        { key: 'defaultValue', label: 'Default Value', type: 'boolean', defaultValue: false },
        { key: 'tooltip', label: 'Tooltip', type: 'text', defaultValue: '' },
        { key: 'required', label: 'Required', type: 'boolean', defaultValue: false, group: 'Validation' },
        { key: 'customError', label: 'Custom Error', type: 'text', helpText: 'Shown when validation fails' },
        { key: 'onLabel', label: 'On Label', type: 'text', defaultValue: 'Yes', group: 'Labels' },
        { key: 'offLabel', label: 'Off Label', type: 'text', defaultValue: 'No' },
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
