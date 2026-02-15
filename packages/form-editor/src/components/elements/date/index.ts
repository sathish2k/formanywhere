/** Date Element */
import type { ElementDefinition } from '../types';

export const dateElement: ElementDefinition = {
    type: 'date',
    label: 'Date',
    icon: 'calendar',
    category: 'date-time',
    color: '#9C27B0',
    defaults: { label: 'Date' },
    properties: [
        { key: 'label', label: 'Label', type: 'text', defaultValue: '', group: 'General' },
        { key: 'helperText', label: 'Helper Text', type: 'text', defaultValue: '' },
        { key: 'description', label: 'Description', type: 'textarea', defaultValue: '' },
        { key: 'defaultValue', label: 'Default Value', type: 'text', defaultValue: '', helpText: 'YYYY-MM-DD format' },
        { key: 'tooltip', label: 'Tooltip', type: 'text', defaultValue: '' },
        { key: 'required', label: 'Required', type: 'boolean', defaultValue: false, group: 'Validation' },
        { key: 'min', label: 'Min Date', type: 'text', helpText: 'YYYY-MM-DD format', group: 'Validation' },
        { key: 'max', label: 'Max Date', type: 'text', helpText: 'YYYY-MM-DD format' },
        { key: 'dateFormat', label: 'Date Format', type: 'select', options: [
            { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' }, { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
            { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
        ], defaultValue: 'YYYY-MM-DD' },
        { key: 'disablePastDates', label: 'Disable Past Dates', type: 'boolean', defaultValue: false },
        { key: 'disableFutureDates', label: 'Disable Future Dates', type: 'boolean', defaultValue: false },
        { key: 'customError', label: 'Custom Error', type: 'text', helpText: 'Shown when validation fails' },
        { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false, group: 'State' },
        { key: 'readOnly', label: 'Read Only', type: 'boolean', defaultValue: false },
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
