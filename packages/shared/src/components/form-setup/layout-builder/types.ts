/**
 * Layout Builder — Types & Configuration
 * Defines all types for the drag-and-drop layout builder
 */
import type { JSX, Component } from 'solid-js';

// ── Element Types ──────────────────────────────────────────────

export type LayoutElementType =
    | 'stepper'
    | 'heading'
    | 'nextButton'
    | 'backButton'
    | 'nextArrow'
    | 'backArrow'
    | 'progressBar'
    | 'pageIndicator'
    | 'breadcrumb'
    | 'twoColumn'
    | 'threeColumn';

export type ElementCategory = 'Navigation' | 'Content' | 'Actions';

/** Palette definition for a draggable element */
export interface ElementDefinition {
    type: LayoutElementType;
    label: string;
    icon: string; // Icon name from @formanywhere/ui
    description: string;
    category: ElementCategory;
    /** Accent color for the toolbar tile */
    color: string;
}

/** Stepper step configuration */
export interface StepConfig {
    label: string;
    pageId?: string;
    optional?: boolean;
    completed?: boolean;
    error?: boolean;
}

/** An element instance dropped on the canvas */
export interface LayoutElement {
    id: string;
    type: LayoutElementType;

    // Common
    label?: string;
    position?: 'left' | 'center' | 'right';
    disabled?: boolean;

    // Button
    variant?: 'filled' | 'outlined' | 'text';
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'error';
    fullWidth?: boolean;
    showLabel?: boolean;

    // Typography / Heading
    typographyVariant?: 'display-large' | 'display-medium' | 'display-small'
        | 'headline-large' | 'headline-medium' | 'headline-small'
        | 'title-large' | 'title-medium' | 'title-small';
    align?: 'left' | 'center' | 'right';

    // Stepper
    orientation?: 'horizontal' | 'vertical';
    stepperVariant?: 'dots' | 'numbers' | 'progress' | 'text';
    connector?: boolean;
    steps?: StepConfig[];
    activeStep?: number;

    // Progress Bar
    progressVariant?: 'determinate' | 'indeterminate';
    value?: number;

    // Column layout
    columnGap?: 'none' | 'small' | 'medium' | 'large';
    columnAlignment?: 'top' | 'center' | 'bottom' | 'stretch';

    // Column children
    children?: {
        column1?: LayoutElement[];
        column2?: LayoutElement[];
        column3?: LayoutElement[];
    };
}

// ── Element render props ───────────────────────────────────────

export interface ElementRenderProps {
    element: LayoutElement;
    totalPages: number;
    isSmall?: boolean;
}

export interface ElementPropertiesProps {
    element: LayoutElement;
    onUpdate: (updates: Partial<LayoutElement>) => void;
    pages?: PageData[];
}

// ── Layout & Page Config ───────────────────────────────────────

export type StepperPosition = 'top' | 'left' | 'none';
export type StepperStyle = 'dots' | 'numbers' | 'progress' | 'arrows';

export interface LayoutConfig {
    id: string;
    name: string;
    description: string;
    headerElements: LayoutElement[];
    footerElements: LayoutElement[];
    stepperPosition: StepperPosition;
    stepperStyle: StepperStyle;
}

export interface PageData {
    id: string;
    name: string;
    description: string;
}

export interface FormSetupData {
    name: string;
    description: string;
    pages: PageData[];
    layoutType: 'classic' | 'card';
    layout?: LayoutConfig | null;
}

// ── Defaults ───────────────────────────────────────────────────

export const defaultPage: PageData = {
    id: 'page-1',
    name: 'Page 1',
    description: 'First page of your form',
};

export const defaultLayout: LayoutConfig = {
    id: 'default-layout',
    name: 'Default Layout',
    description: 'Basic multi-step form layout',
    headerElements: [],
    footerElements: [],
    stepperPosition: 'top',
    stepperStyle: 'dots',
};

// ── Element Palette ────────────────────────────────────────────

export const LAYOUT_ELEMENTS: ElementDefinition[] = [
    // Navigation
    {
        type: 'stepper',
        label: 'Stepper',
        icon: 'layers',
        description: 'Multi-step progress indicator',
        category: 'Navigation',
        color: '#0288D1',
    },
    {
        type: 'progressBar',
        label: 'Progress Bar',
        icon: 'minus',
        description: 'Linear progress indicator',
        category: 'Navigation',
        color: '#00897B',
    },
    {
        type: 'breadcrumb',
        label: 'Breadcrumb',
        icon: 'arrow-right',
        description: 'Breadcrumb trail navigation',
        category: 'Navigation',
        color: '#5C6BC0',
    },
    {
        type: 'pageIndicator',
        label: 'Page Indicator',
        icon: 'hash',
        description: 'Shows current page number',
        category: 'Navigation',
        color: '#7B1FA2',
    },
    // Content
    {
        type: 'heading',
        label: 'Heading',
        icon: 'edit',
        description: 'Page heading / title',
        category: 'Content',
        color: '#6D4C41',
    },
    {
        type: 'twoColumn',
        label: '2 Columns',
        icon: 'columns',
        description: 'Two-column layout',
        category: 'Content',
        color: '#455A64',
    },
    {
        type: 'threeColumn',
        label: '3 Columns',
        icon: 'grid-3x3',
        description: 'Three-column layout',
        category: 'Content',
        color: '#37474F',
    },
    // Actions
    {
        type: 'nextButton',
        label: 'Next',
        icon: 'arrow-right',
        description: 'Navigate to next page',
        category: 'Actions',
        color: '#E65100',
    },
    {
        type: 'backButton',
        label: 'Back',
        icon: 'arrow-left',
        description: 'Navigate to previous page',
        category: 'Actions',
        color: '#F57C00',
    },
    {
        type: 'nextArrow',
        label: 'Next Arrow',
        icon: 'chevron-right',
        description: 'Icon-only next button',
        category: 'Actions',
        color: '#E65100',
    },
    {
        type: 'backArrow',
        label: 'Back Arrow',
        icon: 'chevron-left',
        description: 'Icon-only back button',
        category: 'Actions',
        color: '#F57C00',
    },
];

export const ELEMENT_CATEGORIES: ElementCategory[] = ['Navigation', 'Content', 'Actions'];

export function getElementsByCategory(category: ElementCategory): ElementDefinition[] {
    return LAYOUT_ELEMENTS.filter((el) => el.category === category);
}

/** Get layout elements grouped by category (compatible with form-editor Toolbar) */
export function getLayoutCategories(): Array<{ key: string; title: string; items: ElementDefinition[] }> {
    return ELEMENT_CATEGORIES.map((cat) => ({
        key: cat.toLowerCase(),
        title: cat,
        items: LAYOUT_ELEMENTS.filter((el) => el.category === cat),
    })).filter((c) => c.items.length > 0);
}
