/**
 * Dashboard Component
 * Main dashboard page with form management
 */

'use client';

import { CreateFormSection, DashboardAppBar, FormsListSection } from '@/shared/dashboard';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  type FilterState,
  type SortOption,
  defaultFilters,
  formCardColors,
  itemsPerPage,
} from './dashboard.configuration';
import {
  type FetchFormsResult,
  deleteForm,
  duplicateForm,
  fetchForms,
} from './dashboard.datasource';

interface DashboardFormData {
  id: string;
  title: string;
  submissions: number;
  createdAt: Date;
  color: string;
  creator: string;
}

export function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [forms, setForms] = useState<DashboardFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentSort, setCurrentSort] = useState<SortOption>('date-desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const userId = session?.user?.id;
  const userName = session?.user?.name || 'You';

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  // Convert sort option to API params
  const getSortParams = (sort: SortOption) => {
    const [field, order] = sort.split('-');
    return { sortBy: field, sortOrder: order as 'asc' | 'desc' };
  };

  // Fetch forms from API with filters/sort/pagination
  const loadForms = useCallback(
    async (showLoading = false) => {
      if (!userId) return;

      if (showLoading) setLoading(true);
      try {
        const { sortBy, sortOrder } = getSortParams(currentSort);
        const result: FetchFormsResult = await fetchForms(userId, {
          search: debouncedSearch || undefined,
          sortBy,
          sortOrder,
          page,
          limit: itemsPerPage,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          responseRanges: filters.responseRanges.length > 0 ? filters.responseRanges : undefined,
          creators: filters.creators.length > 0 ? filters.creators : undefined,
        });

        setForms(
          result.forms.map((form, index) => ({
            id: form.id,
            title: form.title,
            submissions: form.submissions,
            createdAt: new Date(form.createdAt),
            color: formCardColors[index % formCardColors.length],
            creator: userName,
          }))
        );
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Error loading forms:', error);
      } finally {
        setLoading(false);
      }
    },
    [
      userId,
      userName,
      debouncedSearch,
      currentSort,
      page,
      filters.dateFrom,
      filters.dateTo,
      filters.responseRanges,
      filters.creators,
    ]
  );

  // Initial load with loading state
  useEffect(() => {
    if (status === 'authenticated' && userId) {
      loadForms(true);
    } else if (status === 'unauthenticated') {
      router.push('/signin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, userId, router]);

  // Re-fetch on filter/sort/page changes without full loading state
  useEffect(() => {
    if (status === 'authenticated' && userId && !loading) {
      loadForms(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearch,
    currentSort,
    page,
    filters.dateFrom,
    filters.dateTo,
    filters.responseRanges,
    filters.creators,
  ]);

  const handleCreateForm = async (optionId: string) => {
    if (optionId === 'template') {
      router.push('/templates');
      return;
    }

    if (optionId === 'blank') {
      // Navigate to layout selection for new form flow
      router.push('/form-builder/new');
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort);
    setPage(1); // Reset to first page when sort changes
  };

  const handleEditForm = (formId: string) => {
    router.push(`/form-builder/${formId}`);
  };

  const handleDuplicateForm = async (formId: string) => {
    if (!userId) return;
    const result = await duplicateForm(formId, userId);
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
    console.log('View form:', formId);
    // TODO: Route to form preview
  };

  // Map forms to expected format for FormsListSection
  const formsForList = forms.map((form) => ({
    id: form.id,
    name: form.title,
    responses: form.submissions,
    creator: form.creator,
    color: form.color,
    createdAt: form.createdAt,
  }));

  if (status === 'loading' || loading) {
    return (
      <PageWrapper>
        <LoadingContainer>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Loading your forms...
          </Typography>
        </LoadingContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <DashboardAppBar userName={userName} userEmail={session?.user?.email || ''} />
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <CreateFormSection onSelectOption={handleCreateForm} />
        <FormsListSection
          forms={formsForList}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          currentSort={currentSort}
          onSortChange={handleSortChange}
          page={page}
          onPageChange={setPage}
          totalPages={totalPages}
          onEditForm={handleEditForm}
          onDuplicateForm={handleDuplicateForm}
          onDeleteForm={handleDeleteForm}
          onViewForm={handleViewForm}
        />
      </Container>
    </PageWrapper>
  );
}

// Styled Components
const PageWrapper = styled(Box)({
  minHeight: '100vh',
  backgroundColor: '#FAFAFA',
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
});
