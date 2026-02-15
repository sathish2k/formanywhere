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
        { key: 'description', label: 'Helper Text', type: 'text', group: 'General' },
        { key: 'tooltip', label: 'Tooltip', type: 'text', defaultValue: '' },
        { key: 'maxStars', label: 'Max Stars', type: 'number', defaultValue: 5, group: 'Settings' },
        { key: 'defaultValue', label: 'Default Rating', type: 'number', defaultValue: 0, group: 'General' },
        { key: 'required', label: 'Required', type: 'boolean', defaultValue: false, group: 'Validation' },
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
