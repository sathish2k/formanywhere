/** Textarea Element */
import type { ElementDefinition } from '../types';

export const textareaElement: ElementDefinition = {
    type: 'textarea',
    label: 'Long Text',
    icon: 'align-left',
    category: 'text-inputs',
    color: '#03A9F4',
    defaults: { label: 'Long Text', placeholder: 'Enter detailed text...' },
    properties: [
        { key: 'label', label: 'Label', type: 'text', defaultValue: '', group: 'General' },
        { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: '' },
        { key: 'helperText', label: 'Helper Text', type: 'text', defaultValue: '' },
        { key: 'description', label: 'Description', type: 'textarea', defaultValue: '' },
        { key: 'defaultValue', label: 'Default Value', type: 'textarea', defaultValue: '' },
        { key: 'tooltip', label: 'Tooltip', type: 'text', defaultValue: '' },
        { key: 'required', label: 'Required', type: 'boolean', defaultValue: false, group: 'Validation' },
        { key: 'minLength', label: 'Min Length', type: 'number', group: 'Validation' },
        { key: 'maxLength', label: 'Max Length', type: 'number', group: 'Validation' },
        { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false, group: 'State' },
        { key: 'readOnly', label: 'Read Only', type: 'boolean', defaultValue: false },
        { key: 'hidden', label: 'Hidden', type: 'boolean', defaultValue: false },
        { key: 'customError', label: 'Custom Error', type: 'text', helpText: 'Shown when validation fails' },
        { key: 'rows', label: 'Rows', type: 'number', defaultValue: 4, group: 'Appearance' },
        { key: 'autoResize', label: 'Auto Resize', type: 'boolean', defaultValue: false, helpText: 'Expand height as user types' },
        { key: 'characterCounter', label: 'Character Counter', type: 'boolean', defaultValue: false, helpText: 'Show remaining characters' },
        {
            key: 'width', label: 'Width', type: 'select', options: [
                { label: '25%', value: '25' }, { label: '50%', value: '50' },
                { label: '75%', value: '75' }, { label: '100%', value: '100' },
            ], defaultValue: '100',
        },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};
