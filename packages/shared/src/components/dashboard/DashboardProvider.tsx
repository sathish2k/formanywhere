/**
 * Dashboard Provider — SolidJS Context
 * Centralized state management for the dashboard with performance optimizations
 */
import {
    Component,
    createContext,
    createEffect,
    createMemo,
    createSignal,
    onCleanup,
    onMount,
    useContext,
    untrack,
    batch,
} from 'solid-js';
import type { JSX } from 'solid-js';
import { fetchForms, deleteForm, duplicateForm } from './dashboard.datasource';
import { go } from '../../utils/navigate';
import {
    defaultFilters,
    formCardColors,
    itemsPerPage,
    MOCK_FORMS,
} from './dashboard.types';
import type { FilterState, SortOption, DashboardFormData, FormCardData } from './dashboard.types';

// ── Context Types ──────────────────────────────────────────────

export interface DashboardContextValue {
    // State accessors
    forms: () => FormCardData[];
    loading: () => boolean;
    initialized: () => boolean;
    filters: () => FilterState;
    currentSort: () => SortOption;
    page: () => number;
    totalPages: () => number;
    hasActiveFilters: () => boolean;

    // Filter actions
    updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    setFilters: (filters: FilterState) => void;
    clearAllFilters: () => void;

    // Sort actions
    setSort: (sort: SortOption) => void;

    // Pagination actions
    setPage: (page: number) => void;
    goToNextPage: () => void;
    goToPrevPage: () => void;

    // Form actions
    handleCreateForm: (optionId: string) => void;
    handleEditForm: (formId: string) => void;
    handleDuplicateForm: (formId: string) => void;
    handleDeleteForm: (formId: string) => void;
    handleViewForm: (formId: string) => void;

    // New form dialog
    newFormDialogOpen: () => boolean;
    closeNewFormDialog: () => void;
    confirmNewForm: (name: string, description: string) => void;

    // Data refresh
    refreshForms: () => void;
}

// ── Context ────────────────────────────────────────────────────

const DashboardContext = createContext<DashboardContextValue>();

export function useDashboard(): DashboardContextValue {
    const ctx = useContext(DashboardContext);
    if (!ctx) {
        throw new Error('useDashboard must be used within a <DashboardProvider>');
    }
    return ctx;
}

// ── Provider Props ─────────────────────────────────────────────

export interface DashboardProviderProps {
    userId?: string;
    userName?: string;
    userEmail?: string;
    children: JSX.Element;
}

// ── Provider Component ─────────────────────────────────────────

export const DashboardProvider: Component<DashboardProviderProps> = (props) => {
    // Core state
    const [rawForms, setRawForms] = createSignal<DashboardFormData[]>([]);
    const [loading, setLoading] = createSignal(true);
    const [initialized, setInitialized] = createSignal(false);

    // New form dialog state
    const [newFormDialogOpen, setNewFormDialogOpen] = createSignal(false);
    const [pendingMode, setPendingMode] = createSignal<string>('blank');

    // Filter / Sort / Page state
    const [filters, setFilters] = createSignal<FilterState>(defaultFilters);
    const [debouncedSearch, setDebouncedSearch] = createSignal('');
    const [currentSort, setCurrentSort] = createSignal<SortOption>('date-desc');
    const [page, setPage] = createSignal(1);
    const [totalPages, setTotalPages] = createSignal(0);

    // Derived accessors
    const userId = () => props.userId || '';
    const userName = () => props.userName || 'User';

    // ── Debounced Search ───────────────────────────────────────

    let searchTimer: ReturnType<typeof setTimeout> | undefined;

    createEffect(() => {
        const query = filters().searchQuery;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => setDebouncedSearch(query), 300);
    });

    onCleanup(() => clearTimeout(searchTimer));

    // ── Derived: hasActiveFilters (memoized) ───────────────────

    const hasActiveFilters = createMemo(() => {
        const f = filters();
        return !!(
            f.dateFrom ||
            f.dateTo ||
            f.responseRanges.length > 0 ||
            f.creators.length > 0 ||
            f.statuses.length > 0
        );
    });

    // ── Sort params helper ─────────────────────────────────────

    const getSortParams = (sort: SortOption) => {
        const [field, order] = sort.split('-');
        return { sortBy: field, sortOrder: order as 'asc' | 'desc' };
    };

    // ── Mock data with client-side filtering/sorting/pagination ─

    const loadMockData = () => {
        const mockData = MOCK_FORMS.map((form, index) => ({
            ...form,
            color: formCardColors[index % formCardColors.length],
        }));

        const search = debouncedSearch().toLowerCase();
        let filtered = search
            ? mockData.filter((f) => f.title.toLowerCase().includes(search))
            : mockData;

        const [field, order] = currentSort().split('-');
        filtered = [...filtered].sort((a, b) => {
            let cmp = 0;
            if (field === 'name') cmp = a.title.localeCompare(b.title);
            else if (field === 'responses') cmp = a.submissions - b.submissions;
            else cmp = a.createdAt.getTime() - b.createdAt.getTime();
            return order === 'desc' ? -cmp : cmp;
        });

        const start = (page() - 1) * itemsPerPage;
        const paged = filtered.slice(start, start + itemsPerPage);

        batch(() => {
            setRawForms(paged);
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        });
    };

    // ── Fetch forms from API (fallback to mock) ────────────────

    const loadForms = async (showLoading = false) => {
        if (showLoading) setLoading(true);
        try {
            const { sortBy, sortOrder } = getSortParams(untrack(currentSort));
            const f = untrack(filters);
            const result = await fetchForms(userId(), {
                search: untrack(debouncedSearch) || undefined,
                sortBy,
                sortOrder,
                page: untrack(page),
                limit: itemsPerPage,
                dateFrom: f.dateFrom || undefined,
                dateTo: f.dateTo || undefined,
                responseRanges: f.responseRanges.length > 0 ? f.responseRanges : undefined,
                creators: f.creators.length > 0 ? f.creators : undefined,
            });

            if (result.forms.length > 0) {
                batch(() => {
                    setRawForms(
                        result.forms.map((form, index) => ({
                            id: form.id,
                            title: form.title,
                            submissions: form.submissions,
                            createdAt: new Date(form.createdAt),
                            color: formCardColors[index % formCardColors.length],
                            creator: userName(),
                        }))
                    );
                    setTotalPages(result.totalPages);
                });
            } else {
                loadMockData();
            }
        } catch {
            loadMockData();
        } finally {
            setLoading(false);
        }
    };

    // ── Initial load ───────────────────────────────────────────

    onMount(() => {
        loadForms(true).then(() => setInitialized(true));
    });

    // ── Reactive re-fetch on filter/sort/page changes ──────────

    createEffect(() => {
        // Track reactive deps
        debouncedSearch();
        currentSort();
        page();
        const f = filters();
        f.dateFrom;
        f.dateTo;
        f.responseRanges;
        f.creators;

        if (initialized()) {
            loadForms(false);
        }
    });

    // ── Memoized FormCardData mapping ──────────────────────────

    const forms = createMemo<FormCardData[]>(() =>
        rawForms().map((form) => ({
            id: form.id,
            name: form.title,
            responses: form.submissions,
            creator: form.creator,
            color: form.color,
            createdAt: form.createdAt,
        }))
    );

    // ── Filter actions ─────────────────────────────────────────

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        batch(() => {
            setFilters((prev) => ({ ...prev, [key]: value }));
            setPage(1);
        });
    };

    const clearAllFilters = () => {
        batch(() => {
            setFilters({ ...defaultFilters });
            setPage(1);
        });
    };

    // ── Sort actions ───────────────────────────────────────────

    const setSort = (sort: SortOption) => {
        batch(() => {
            setCurrentSort(sort);
            setPage(1);
        });
    };

    // ── Pagination actions ─────────────────────────────────────

    const goToNextPage = () => {
        const current = page();
        const total = totalPages();
        if (current < total) setPage(current + 1);
    };

    const goToPrevPage = () => {
        const current = page();
        if (current > 1) setPage(current - 1);
    };

    // ── Form CRUD actions ──────────────────────────────────────

    const handleCreateForm = (optionId: string) => {
        if (optionId === 'template') {
            go('/templates');
            return;
        }
        if (optionId === 'blank') {
            // Show quick name dialog, then go to builder
            setPendingMode('blank');
            setNewFormDialogOpen(true);
            return;
        }
        // AI / Import go directly to form builder
        go(`/app?mode=${optionId}`);
    };

    const closeNewFormDialog = () => setNewFormDialogOpen(false);

    const confirmNewForm = (name: string, description: string) => {
        setNewFormDialogOpen(false);
        const params = new URLSearchParams({ mode: pendingMode() });
        if (name) params.set('name', name);
        if (description) params.set('desc', description);
        go(`/app?${params.toString()}`);
    };

    const handleEditForm = (formId: string) => {
        go(`/app?form=${formId}`);
    };

    const handleDuplicateForm = async (formId: string) => {
        if (!userId()) return;
        const result = await duplicateForm(formId, userId());
        if (result.success) {
            loadForms();
        }
    };

    const handleDeleteForm = async (formId: string) => {
        const result = await deleteForm(formId);
        if (result.success) {
            loadForms();
        }
    };

    const handleViewForm = (formId: string) => {
        go(`/preview?form=${formId}`);
    };

    // ── Context value ──────────────────────────────────────────

    const contextValue: DashboardContextValue = {
        forms,
        loading,
        initialized,
        filters,
        currentSort,
        page,
        totalPages,
        hasActiveFilters,

        updateFilter,
        setFilters,
        clearAllFilters,

        setSort,

        setPage,
        goToNextPage,
        goToPrevPage,

        handleCreateForm,
        handleEditForm,
        handleDuplicateForm,
        handleDeleteForm,
        handleViewForm,

        newFormDialogOpen,
        closeNewFormDialog,
        confirmNewForm,

        refreshForms: () => loadForms(false),
    };

    return (
        <DashboardContext.Provider value={contextValue}>
            {props.children}
        </DashboardContext.Provider>
    );
};
