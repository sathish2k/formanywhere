/**
 * Forms List Section Component
 * All Forms grid with filters, sorting, and pagination
 */

'use client';

import type {
  FilterState,
  FormData,
  SortOption,
} from '@/components/dashboard/dashboard.configuration';
import { sortLabels } from '@/components/dashboard/dashboard.configuration';
import {
  CreatorsFilter,
  DateRangeFilter,
  MoreFiltersPopover,
  ResponsesFilter,
  SearchFilter,
} from '@/shared/filters';
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowDown, ArrowDownUp, ArrowUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FormCard } from './FormCard';

interface FormsListSectionProps {
  forms: FormData[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  page: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  onEditForm?: (formId: string) => void;
  onDuplicateForm?: (formId: string) => void;
  onDeleteForm?: (formId: string) => void;
  onViewForm?: (formId: string) => void;
}

export function FormsListSection({
  forms,
  filters,
  onFiltersChange,
  currentSort,
  onSortChange,
  page,
  onPageChange,
  totalPages,
  onEditForm,
  onDuplicateForm,
  onDeleteForm,
  onViewForm,
}: FormsListSectionProps) {
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  // Get unique creators from forms
  const availableCreators = useMemo(() => {
    return Array.from(new Set(forms.map((form) => form.creator)));
  }, [forms]);

  const handleSortSelect = (sort: SortOption) => {
    onSortChange(sort);
    setSortAnchorEl(null);
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.dateFrom ||
    filters.dateTo ||
    filters.responseRanges.length > 0 ||
    filters.creators.length > 0 ||
    filters.statuses.length > 0;

  const handleClearAllFilters = () => {
    onFiltersChange({
      searchQuery: '',
      dateFrom: '',
      dateTo: '',
      responseRanges: [],
      creators: [],
      creatorSearch: '',
      statuses: [],
    });
  };

  return (
    <Box>
      <SectionHeader>
        <Typography variant="h5" sx={{ color: 'text.primary' }}>
          All Forms
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <SortButton
            variant="outlined"
            startIcon={<ArrowDownUp size={18} />}
            onClick={(e) => setSortAnchorEl(e.currentTarget)}
          >
            Sort By
          </SortButton>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={() => setSortAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            {(
              [
                'name-asc',
                'name-desc',
                'responses-asc',
                'responses-desc',
                'date-asc',
                'date-desc',
              ] as SortOption[]
            ).map((sort) => (
              <MenuItem
                key={sort}
                onClick={() => handleSortSelect(sort)}
                selected={currentSort === sort}
              >
                <ListItemIcon>
                  {sort.endsWith('-asc') ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                </ListItemIcon>
                <ListItemText>{sortLabels[sort]}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </SectionHeader>

      <FilterBar>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <SearchFilter
            value={filters.searchQuery}
            onChange={(value) => updateFilter('searchQuery', value)}
            placeholder="Search forms..."
          />
          <DateRangeFilter
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            onDateFromChange={(value) => updateFilter('dateFrom', value)}
            onDateToChange={(value) => updateFilter('dateTo', value)}
          />
          <ResponsesFilter
            value={filters.responseRanges}
            onChange={(value) => updateFilter('responseRanges', value)}
          />
          <CreatorsFilter
            value={filters.creators}
            onChange={(value) => updateFilter('creators', value)}
            creatorSearch={filters.creatorSearch}
            onCreatorSearchChange={(value) => updateFilter('creatorSearch', value)}
            availableCreators={availableCreators}
          />
          <MoreFiltersPopover
            statuses={filters.statuses}
            onStatusesChange={(value) => updateFilter('statuses', value)}
          />

          {hasActiveFilters && (
            <ClearAllButton size="small" variant="text" onClick={handleClearAllFilters}>
              Clear All Filters
            </ClearAllButton>
          )}
        </Stack>
      </FilterBar>

      {forms.length > 0 ? (
        <>
          <FormsGrid>
            {forms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onEdit={onEditForm}
                onDuplicate={onDuplicateForm}
                onDelete={onDeleteForm}
                onView={onViewForm}
              />
            ))}
          </FormsGrid>

          {totalPages > 1 && (
            <PaginationWrapper>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => onPageChange(value)}
                color="primary"
                shape="rounded"
              />
            </PaginationWrapper>
          )}
        </>
      ) : (
        <EmptyState>
          <Typography variant="h6" color="text.secondary">
            No forms found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or create a new form
          </Typography>
        </EmptyState>
      )}
    </Box>
  );
}

// Styled Components
const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
}));

const SortButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderColor: theme.palette.grey[300],
  textTransform: 'none',
  '&:hover': {
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[100],
  },
}));

const FilterBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.grey[300]}`,
  boxShadow: 'none',
  borderRadius: theme.spacing(2),
}));

const ClearAllButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.lighter || 'rgba(255, 86, 48, 0.08)',
  },
}));

const FormsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

const PaginationWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(4),
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8),
}));
