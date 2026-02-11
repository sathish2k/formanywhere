/**
 * Templates Grid Section
 * Grid of filtered templates with header
 */

'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FileText } from 'lucide-react';
import { type Template, TemplateCard } from './TemplateCard';
import type { TemplateCategory } from './TemplateCategoryFilters';

interface TemplatesGridProps {
  templates: Template[];
  categories: TemplateCategory[];
  selectedCategory: string;
  onClearFilters: () => void;
}

export function TemplatesGrid({
  templates,
  categories,
  selectedCategory,
  onClearFilters,
}: TemplatesGridProps) {
  const categoryLabel =
    selectedCategory === 'all'
      ? 'All Templates'
      : categories.find((c) => c.id === selectedCategory)?.label || selectedCategory;

  return (
    <GridContainer maxWidth="lg">
      <GridHeader>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {categoryLabel}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {templates.length} template{templates.length !== 1 ? 's' : ''} found
        </Typography>
      </GridHeader>

      {templates.length > 0 ? (
        <TemplateGridWrapper>
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              categoryLabel={categories.find((c) => c.id === template.category)?.label}
            />
          ))}
        </TemplateGridWrapper>
      ) : (
        <EmptyState>
          <FileText size={64} color="#CCC" strokeWidth={1.5} />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            No templates found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search or filter criteria
          </Typography>
          <Button variant="outlined" onClick={onClearFilters}>
            Clear Filters
          </Button>
        </EmptyState>
      )}
    </GridContainer>
  );
}

// Styled Components
const GridContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

const GridHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const TemplateGridWrapper = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));
