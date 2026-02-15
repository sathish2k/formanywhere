/**
 * Text Input Element — covers text, email, phone, number, url
 * Same underlying component with different validation / input modes.
 */
import type { ElementDefinition, PropertyField } from '../types';

/** Width options shared by all elements */
const widthOptions = [
    { label: '25%', value: '25' },
    { label: '50%', value: '50' },
    { label: '75%', value: '75' },
    { label: '100%', value: '100' },
];

/** Shared property fields for all text-like inputs */
const sharedProperties: PropertyField[] = [
    { key: 'label', label: 'Label', type: 'text', defaultValue: '', group: 'General' },
    { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: '' },
    { key: 'helperText', label: 'Helper Text', type: 'text', defaultValue: '' },
    { key: 'description', label: 'Description', type: 'textarea', defaultValue: '' },
    { key: 'defaultValue', label: 'Default Value', type: 'text', defaultValue: '' },
    { key: 'tooltip', label: 'Tooltip', type: 'text', defaultValue: '' },
    { key: 'required', label: 'Required', type: 'boolean', defaultValue: false, group: 'Validation' },
    { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false, group: 'State' },
    { key: 'readOnly', label: 'Read Only', type: 'boolean', defaultValue: false },
    { key: 'hidden', label: 'Hidden', type: 'boolean', defaultValue: false },
    { key: 'width', label: 'Width', type: 'select', options: widthOptions, defaultValue: '100', group: 'Appearance' },
    { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
];

export const textElement: ElementDefinition = {
    type: 'text',
    label: 'Short Text',
    icon: 'type',
    category: 'text-inputs',
    color: '#2196F3',
    defaults: { label: 'Text Field', placeholder: 'Enter text...' },
    properties: [
        ...sharedProperties,
        { key: 'maxLength', label: 'Max Length', type: 'number', group: 'Validation' },
        { key: 'minLength', label: 'Min Length', type: 'number', group: 'Validation' },
        { key: 'pattern', label: 'Pattern (Regex)', type: 'text', helpText: 'e.g. ^[A-Za-z]+$', group: 'Validation' },
        { key: 'customError', label: 'Custom Error', type: 'text', helpText: 'Shown when validation fails' },
    ],
};

export const emailElement: ElementDefinition = {
    type: 'email',
    label: 'Email',
    icon: 'at-sign',
    category: 'text-inputs',
    color: '#00BCD4',
    defaults: { label: 'Email', placeholder: 'you@example.com' },
    properties: [
        ...sharedProperties,
        { key: 'maxLength', label: 'Max Length', type: 'number', group: 'Validation' },
        { key: 'customError', label: 'Custom Error', type: 'text', helpText: 'Shown when validation fails' },
    ],
};

export const phoneElement: ElementDefinition = {
    type: 'phone',
    label: 'Phone Number',
    icon: 'phone',
    category: 'text-inputs',
    color: '#009688',
    defaults: { label: 'Phone', placeholder: '+1 (555) 000-0000' },
    properties: [
        ...sharedProperties,
        { key: 'pattern', label: 'Pattern (Regex)', type: 'text', helpText: 'e.g. ^\\+?[0-9\\s-]+$', group: 'Validation' },
        { key: 'customError', label: 'Custom Error', type: 'text', helpText: 'Shown when validation fails' },
    ],
};

export const numberElement: ElementDefinition = {
    type: 'number',
    label: 'Number',
    icon: 'hash',
    category: 'text-inputs',
    color: '#4CAF50',
    defaults: { label: 'Number', placeholder: '0' },
    properties: [
        ...sharedProperties,
        { key: 'min', label: 'Min', type: 'number', group: 'Validation' },
        { key: 'max', label: 'Max', type: 'number', group: 'Validation' },
        { key: 'step', label: 'Step', type: 'number', defaultValue: 1 },
        { key: 'precision', label: 'Decimal Places', type: 'number', defaultValue: 0, helpText: '0 for integers' },
        { key: 'unit', label: 'Unit', type: 'text', helpText: 'e.g. kg, $, %' },
        { key: 'showArrows', label: 'Show Arrows', type: 'boolean', defaultValue: true, helpText: 'Increment/decrement buttons' },
        { key: 'customError', label: 'Custom Error', type: 'text', helpText: 'Shown when validation fails' },
    ],
};

export const urlElement: ElementDefinition = {
    type: 'url',
    label: 'Website URL',
    icon: 'link',
    category: 'text-inputs',
    color: '#8BC34A',
    defaults: { label: 'URL', placeholder: 'https://...' },
    properties: [
        ...sharedProperties,
        { key: 'customError', label: 'Custom Error', type: 'text', helpText: 'Shown when validation fails' },
    ],
};
