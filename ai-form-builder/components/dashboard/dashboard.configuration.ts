/**
 * Dashboard Configuration
 * Types, static data, and configuration for dashboard
 */

import { Download, FileText, Plus, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface FormData {
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
  icon: LucideIcon;
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
    icon: Plus,
    variant: 'dashed',
  },
  {
    id: 'template',
    title: 'Use Template',
    description: 'Use a template to create and send a survey faster',
    icon: FileText,
    variant: 'gradient',
  },
  {
    id: 'import',
    title: 'Import Form',
    description: 'Convert your existing forms instantly',
    icon: Download,
    variant: 'gradient',
  },
  {
    id: 'ai',
    title: 'Create with AI',
    description: 'Save time and create forms faster let AI handle the first draft',
    icon: Sparkles,
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

export const itemsPerPage = 8;
