/** File Upload Element */
import type { ElementDefinition } from '../types';

export const fileElement: ElementDefinition = {
    type: 'file',
    label: 'File Upload',
    icon: 'upload',
    category: 'advanced',
    color: '#795548',
    defaults: { label: 'File Upload' },
    properties: [
        { key: 'label', label: 'Label', type: 'text', defaultValue: '', group: 'General' },
        { key: 'helperText', label: 'Helper Text', type: 'text', defaultValue: '' },
        { key: 'description', label: 'Description', type: 'textarea', defaultValue: '' },
        { key: 'tooltip', label: 'Tooltip', type: 'text', defaultValue: '' },
        { key: 'required', label: 'Required', type: 'boolean', defaultValue: false, group: 'Validation' },
        { key: 'accept', label: 'Accepted Types', type: 'text', defaultValue: '', helpText: 'e.g. .pdf,.jpg,.png', group: 'File' },
        { key: 'multiple', label: 'Allow Multiple', type: 'boolean', defaultValue: false },
        { key: 'maxSize', label: 'Max Size (MB)', type: 'number', defaultValue: 10 },
        { key: 'dragDropEnabled', label: 'Drag & Drop', type: 'boolean', defaultValue: true, helpText: 'Allow drag-and-drop upload' },
        { key: 'previewEnabled', label: 'Preview Files', type: 'boolean', defaultValue: true, helpText: 'Show file previews after upload' },
        { key: 'customError', label: 'Custom Error', type: 'text', helpText: 'Shown when validation fails' },
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
