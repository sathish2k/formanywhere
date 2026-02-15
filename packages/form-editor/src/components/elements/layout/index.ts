/**
 * Layout Elements — container, grid, section, card, divider, spacer, heading, logo, text-block, grid-column
 */
import type { ElementDefinition } from '../types';

export const containerElement: ElementDefinition = {
    type: 'container', label: 'Container', icon: 'box', category: 'layout', color: '#7C4DFF',
    defaults: { label: 'Container' },
    properties: [
        { key: 'label', label: 'Label', type: 'text', group: 'General' },
        { key: 'padding', label: 'Padding (px)', type: 'number', defaultValue: 16, group: 'Layout' },
        { key: 'margin', label: 'Margin (px)', type: 'number', defaultValue: 0 },
        {
            key: 'alignment', label: 'Alignment', type: 'select', options: [
                { label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' },
            ], defaultValue: 'left'
        },
        { key: 'hidden', label: 'Hidden', type: 'boolean', defaultValue: false, group: 'State' },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};

export const gridElement: ElementDefinition = {
    type: 'grid', label: 'Grid', icon: 'grid-3x3', category: 'layout', color: '#536DFE',
    defaults: { label: 'Grid' },
    properties: [
        { key: 'label', label: 'Label', type: 'text', group: 'General' },
        { key: 'columns', label: 'Columns', type: 'number', defaultValue: 2, group: 'Layout' },
        { key: 'gap', label: 'Gap (px)', type: 'number', defaultValue: 16 },
        { key: 'mobileColumns', label: 'Mobile Columns', type: 'number', defaultValue: 1, helpText: 'Columns on small screens' },
        { key: 'tabletColumns', label: 'Tablet Columns', type: 'number', defaultValue: 2, helpText: 'Columns on medium screens' },
        { key: 'hidden', label: 'Hidden', type: 'boolean', defaultValue: false, group: 'State' },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};

export const sectionElement: ElementDefinition = {
    type: 'section', label: 'Section', icon: 'layout', category: 'layout', color: '#448AFF',
    defaults: { label: 'Section' },
    properties: [
        { key: 'label', label: 'Title', type: 'text', group: 'General' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'collapsible', label: 'Collapsible', type: 'boolean', defaultValue: false, group: 'Settings' },
        { key: 'defaultExpanded', label: 'Default Expanded', type: 'boolean', defaultValue: true },
        { key: 'showBorder', label: 'Show Border', type: 'boolean', defaultValue: true, group: 'Appearance' },
        { key: 'sectionBgColor', label: 'Background Color', type: 'color', defaultValue: '' },
        { key: 'margin', label: 'Margin (px)', type: 'number', defaultValue: 0, group: 'Layout' },
        { key: 'hidden', label: 'Hidden', type: 'boolean', defaultValue: false, group: 'State' },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};

export const cardElement: ElementDefinition = {
    type: 'card', label: 'Card', icon: 'credit-card', category: 'layout', color: '#40C4FF',
    defaults: { label: 'Card' },
    properties: [
        { key: 'label', label: 'Label', type: 'text', group: 'General' },
        { key: 'padding', label: 'Padding (px)', type: 'number', defaultValue: 16, group: 'Layout' },
        { key: 'margin', label: 'Margin (px)', type: 'number', defaultValue: 0 },
        { key: 'hidden', label: 'Hidden', type: 'boolean', defaultValue: false, group: 'State' },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};

export const gridColumnElement: ElementDefinition = {
    type: 'grid-column', label: 'Column', icon: 'columns', category: 'layout', color: '#536DFE',
    defaults: { label: 'Column' },
    properties: [
        { key: 'span', label: 'Column Span', type: 'number', defaultValue: 1, group: 'Layout' },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};

export const dividerElement: ElementDefinition = {
    type: 'divider', label: 'Divider', icon: 'minus', category: 'layout', color: '#64FFDA',
    defaults: { label: 'Divider' },
    properties: [
        { key: 'thickness', label: 'Thickness (px)', type: 'number', defaultValue: 1, group: 'Appearance' },
        { key: 'color', label: 'Color', type: 'color', defaultValue: '#E0E0E0' },
        {
            key: 'style', label: 'Style', type: 'select', options: [
                { label: 'Solid', value: 'solid' }, { label: 'Dashed', value: 'dashed' }, { label: 'Dotted', value: 'dotted' },
            ], defaultValue: 'solid'
        },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};

export const spacerElement: ElementDefinition = {
    type: 'spacer', label: 'Spacer', icon: 'move-vertical', category: 'layout', color: '#69F0AE',
    defaults: { label: 'Spacer' },
    properties: [
        { key: 'height', label: 'Height (px)', type: 'number', defaultValue: 24, group: 'Layout' },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};

export const headingElement: ElementDefinition = {
    type: 'heading', label: 'Heading', icon: 'heading', category: 'layout', color: '#B388FF',
    defaults: { label: 'Heading' },
    properties: [
        { key: 'label', label: 'Text', type: 'text', group: 'General' },
        {
            key: 'level', label: 'Level', type: 'select', options: [
                { label: 'H1', value: '1' }, { label: 'H2', value: '2' },
                { label: 'H3', value: '3' }, { label: 'H4', value: '4' },
            ], defaultValue: '2'
        },
        {
            key: 'headingWeight', label: 'Weight', type: 'select', options: [
                { label: 'Light', value: '300' }, { label: 'Normal', value: '400' },
                { label: 'Medium', value: '500' }, { label: 'Bold', value: '700' },
            ], defaultValue: '700'
        },
        { key: 'headingColor', label: 'Color', type: 'color', defaultValue: '' },
        {
            key: 'alignment', label: 'Alignment', type: 'select', options: [
                { label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' },
            ], defaultValue: 'left', group: 'Appearance'
        },
        { key: 'hidden', label: 'Hidden', type: 'boolean', defaultValue: false, group: 'State' },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};

export const logoElement: ElementDefinition = {
    type: 'logo', label: 'Logo', icon: 'image', category: 'layout', color: '#FF80AB',
    defaults: { label: 'Logo' },
    properties: [
        { key: 'label', label: 'Alt Text', type: 'text', group: 'General' },
        { key: 'src', label: 'Image URL', type: 'text' },
        { key: 'width', label: 'Width (px)', type: 'number', defaultValue: 200, group: 'Appearance' },
        {
            key: 'alignment', label: 'Alignment', type: 'select', options: [
                { label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' },
            ], defaultValue: 'center'
        },
        { key: 'hidden', label: 'Hidden', type: 'boolean', defaultValue: false, group: 'State' },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};

export const textBlockElement: ElementDefinition = {
    type: 'text-block', label: 'Text Block', icon: 'align-left', category: 'layout', color: '#EA80FC',
    defaults: { label: 'Text Block' },
    properties: [
        { key: 'label', label: 'Content', type: 'textarea', group: 'General' },
        {
            key: 'alignment', label: 'Alignment', type: 'select', options: [
                { label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' },
            ], defaultValue: 'left', group: 'Appearance'
        },
        { key: 'hidden', label: 'Hidden', type: 'boolean', defaultValue: false, group: 'State' },
        { key: 'customClass', label: 'Custom CSS Class', type: 'text', defaultValue: '' },
    ],
};
