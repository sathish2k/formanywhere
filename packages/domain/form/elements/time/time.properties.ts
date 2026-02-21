/** Time Element */
import type { ElementDefinition } from '../types';

export const timeElement: ElementDefinition = {
    type: 'time',
    label: 'Time',
    icon: 'clock',
    category: 'date-time',
    color: '#673AB7',
    defaults: { label: 'Time' },
    properties: [
        { key: 'label', label: 'Label', type: 'text', defaultValue: '', group: 'General' },
        { key: 'helperText', label: 'Helper Text', type: 'text', defaultValue: '' },
        { key: 'description', label: 'Description', type: 'textarea', defaultValue: '' },
        { key: 'defaultValue', label: 'Default Value', type: 'text', defaultValue: '', helpText: 'HH:MM format' },
        { key: 'tooltip', label: 'Tooltip', type: 'text', defaultValue: '' },
        { key: 'required', label: 'Required', type: 'boolean', defaultValue: false, group: 'Validation' },
        { key: 'min', label: 'Min Time', type: 'text', helpText: 'HH:MM format', group: 'Validation' },
        { key: 'max', label: 'Max Time', type: 'text', helpText: 'HH:MM format' },
        { key: 'customError', label: 'Custom Error', type: 'text', helpText: 'Shown when validation fails' },
        { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false, group: 'State' },
        { key: 'readOnly', label: 'Read Only', type: 'boolean', defaultValue: false },
        { key: 'hidden', label: 'Hidden', type: 'boolean', defaultValue: false },
        {
            key: 'width', label: 'Width', type: 'select', options: [
                { label: '25%', value: '25' }, { label: '50%', value: '50' },
                { label: '75%', value: '75' }, { label: '100%', value: '100' },
            ], defaultValue: '100', group: 'Appearance',
        },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};
