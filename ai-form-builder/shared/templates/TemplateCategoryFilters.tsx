/**
 * Template Category Filters
 * Horizontal scrollable category filter chips
 */

'use client';

import { Box, Chip, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { LucideIcon } from 'lucide-react';

export interface TemplateCategory {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TemplateCategoryFiltersProps {
  categories: TemplateCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function TemplateCategoryFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: TemplateCategoryFiltersProps) {
  return (
    <FilterWrapper>
      <Container maxWidth="lg">
        <FilterStack direction="row" spacing={2}>
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <CategoryChip
                key={category.id}
                icon={<Icon size={16} />}
                label={category.label}
                onClick={() => onCategoryChange(category.id)}
                isSelected={isSelected}
              />
            );
          })}
        </FilterStack>
      </Container>
    </FilterWrapper>
  );
}

// Styled Components
const FilterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const FilterStack = styled(Stack)(() => ({
  overflowX: 'auto',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
}));

const CategoryChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  height: 40,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
  color: isSelected ? 'white' : theme.palette.text.primary,
  border: '1px solid',
  borderColor: isSelected ? theme.palette.primary.main : theme.palette.divider,
  fontWeight: isSelected ? 600 : 400,
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.primary.dark : 'rgba(0, 0, 0, 0.04)',
  },
  '& .MuiChip-icon': {
    color: isSelected ? 'white' : theme.palette.primary.main,
  },
}));
