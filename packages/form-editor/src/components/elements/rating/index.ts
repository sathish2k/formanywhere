import type { ElementDefinition } from '../types';

export const ratingElement: ElementDefinition = {
    type: 'rating',
    label: 'Rating',
    icon: 'star',
    category: 'advanced',
    color: '#0891B2',
    defaults: { label: 'Rating' },
    properties: [
        { key: 'label', label: 'Label', type: 'text', defaultValue: '', group: 'General' },
        { key: 'helperText', label: 'Helper Text', type: 'text', defaultValue: '' },
        { key: 'description', label: 'Description', type: 'textarea', defaultValue: '' },
        { key: 'tooltip', label: 'Tooltip', type: 'text', defaultValue: '' },
        { key: 'maxStars', label: 'Max Stars', type: 'number', defaultValue: 5, group: 'Settings' },
        { key: 'defaultValue', label: 'Default Rating', type: 'number', defaultValue: 0, group: 'General' },
        { key: 'showValue', label: 'Show Value', type: 'boolean', defaultValue: true, helpText: 'Display the numeric rating' },
        {
            key: 'ratingIcon', label: 'Icon Shape', type: 'select', options: [
                { label: 'Star', value: 'star' }, { label: 'Heart', value: 'heart' }, { label: 'Circle', value: 'circle' },
            ], defaultValue: 'star'
        },
        { key: 'required', label: 'Required', type: 'boolean', defaultValue: false, group: 'Validation' },
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
