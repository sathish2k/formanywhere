/**
 * Dashboard Shared Components Exports
 */

export { Dashboard } from './Dashboard';
export type { DashboardProps } from './Dashboard';
export { DashboardProvider, useDashboard } from './DashboardProvider';
export type { DashboardContextValue, DashboardProviderProps } from './DashboardProvider';
export { DashboardAppBar } from './header';
export type { DashboardAppBarProps } from './header';
export { CreateFormSection } from './cards';
export type { CreateFormSectionProps } from './cards';
export { FormsListSection } from './FormsListSection';
export { FormCard } from './cards';
export type { FormCardProps } from './cards';
export { fetchForms, createForm, deleteForm, duplicateForm, updateForm } from './dashboard.datasource';
export type { FormData, FetchFormsOptions, FetchFormsResult } from './dashboard.datasource';
export type {
    DashboardFormData,
    FormCardData,
    CreateFormOption,
    SortOption,
    FilterState,
} from './dashboard.types';
export {
    sortLabels,
    createFormOptions,
    formCardColors,
    defaultFilters,
    itemsPerPage,
    MOCK_FORMS,
} from './dashboard.types';

// Sub-module re-exports
export { FilterBar, SearchFilter, DateRangeFilter, ResponseRangeFilter, StatusFilter } from './filters';
export { SortMenu } from './sort';
export { Pagination } from './pagination';
