/**
 * Dashboard Types & Configuration
 */

export interface DashboardFormData {
    id: string;
    title: string;
    submissions: number;
    createdAt: Date;
    color: string;
    creator: string;
}

export interface FormCardData {
    id: string;
    name: string;
    responses: number;
    creator: string;
    color: string;
    createdAt: Date;
}

export interface CreateFormOption {
    id: string;
    title: string;
    description: string;
    icon: string;
    variant: 'dashed' | 'solid' | 'gradient' | 'outlined';
}

export type SortOption =
    | 'name-asc'
    | 'name-desc'
    | 'responses-asc'
    | 'responses-desc'
    | 'date-asc'
    | 'date-desc';

export interface FilterState {
    searchQuery: string;
    dateFrom: string;
    dateTo: string;
    responseRanges: string[];
    creators: string[];
    creatorSearch: string;
    statuses: string[];
}

export const sortLabels: Record<SortOption, string> = {
    'name-asc': 'Name (A-Z)',
    'name-desc': 'Name (Z-A)',
    'responses-asc': 'Responses (Low-High)',
    'responses-desc': 'Responses (High-Low)',
    'date-asc': 'Date (Oldest)',
    'date-desc': 'Date (Newest)',
};

export const createFormOptions: CreateFormOption[] = [
    {
        id: 'blank',
        title: 'Start From Scratch',
        description: 'Jump right in and build something beautiful',
        icon: 'plus',
        variant: 'dashed',
    },
    {
        id: 'template',
        title: 'Use Template',
        description: 'Use a template to create and send a survey faster',
        icon: 'file-text',
        variant: 'gradient',
    },
    {
        id: 'import',
        title: 'Import Form',
        description: 'Convert your existing forms instantly',
        icon: 'download',
        variant: 'gradient',
    },
    {
        id: 'ai',
        title: 'Create with AI',
        description: 'Save time and create forms faster let AI handle the first draft',
        icon: 'sparkle',
        variant: 'outlined',
    },
];

export const formCardColors = [
    'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
    'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)',
    'linear-gradient(135deg, #EDE7F6 0%, #D1C4E9 100%)',
    'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
    'linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%)',
];

export const defaultFilters: FilterState = {
    searchQuery: '',
    dateFrom: '',
    dateTo: '',
    responseRanges: [],
    creators: [],
    creatorSearch: '',
    statuses: [],
};

export const itemsPerPage = 12;

/** Mock form data for demo/development */
export const MOCK_FORMS: DashboardFormData[] = [
    {
        id: 'form-1',
        title: 'Customer Feedback Survey',
        submissions: 142,
        createdAt: new Date('2026-01-15'),
        color: '',
        creator: 'Guest User',
    },
    {
        id: 'form-2',
        title: 'Employee Onboarding Checklist',
        submissions: 87,
        createdAt: new Date('2026-01-22'),
        color: '',
        creator: 'Guest User',
    },
    {
        id: 'form-3',
        title: 'Event Registration Form',
        submissions: 256,
        createdAt: new Date('2026-02-01'),
        color: '',
        creator: 'Guest User',
    },
    {
        id: 'form-4',
        title: 'Product Review Form',
        submissions: 64,
        createdAt: new Date('2026-02-05'),
        color: '',
        creator: 'Guest User',
    },
    {
        id: 'form-5',
        title: 'Contact Us',
        submissions: 312,
        createdAt: new Date('2025-12-10'),
        color: '',
        creator: 'Guest User',
    },
    {
        id: 'form-6',
        title: 'Job Application Form',
        submissions: 198,
        createdAt: new Date('2025-11-28'),
        color: '',
        creator: 'Guest User',
    },
    {
        id: 'form-7',
        title: 'Website Redesign Survey',
        submissions: 45,
        createdAt: new Date('2026-02-08'),
        color: '',
        creator: 'Guest User',
    },
    {
        id: 'form-8',
        title: 'Newsletter Signup',
        submissions: 523,
        createdAt: new Date('2025-10-15'),
        color: '',
        creator: 'Guest User',
    },
    {
        id: 'form-9',
        title: 'Bug Report Template',
        submissions: 76,
        createdAt: new Date('2026-01-30'),
        color: '',
        creator: 'Guest User',
    },
    {
        id: 'form-10',
        title: 'Course Evaluation',
        submissions: 189,
        createdAt: new Date('2025-12-20'),
        color: '',
        creator: 'Guest User',
    },
];
