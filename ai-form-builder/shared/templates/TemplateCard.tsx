/**
 * Template Card
 * Individual template card component
 */

'use client';

import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  popular: boolean;
  uses: string;
  fields: string[];
}

interface TemplateCardProps {
  template: Template;
  categoryLabel?: string;
  variant?: 'default' | 'compact';
}

export function TemplateCard({ template, categoryLabel, variant = 'default' }: TemplateCardProps) {
  const isCompact = variant === 'compact';

  return (
    <StyledCard>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <TemplatePreview height={isCompact ? 140 : 160}>
          <FileText size={isCompact ? 48 : 56} strokeWidth={1.5} />
          {template.popular && <PopularChip label="Popular" size="small" />}
        </TemplatePreview>

        <TemplateName variant="h6">{template.name}</TemplateName>
        <TemplateDescription
          variant="body2"
          color="text.secondary"
          minHeight={isCompact ? 'auto' : 40}
        >
          {template.description}
        </TemplateDescription>

        {categoryLabel && (
          <Box sx={{ mb: 2 }}>
            <CategoryBadge label={categoryLabel} size="small" />
          </Box>
        )}

        <FieldsStack direction="row" spacing={1}>
          {template.fields.slice(0, isCompact ? 3 : 4).map((field, index) => (
            <FieldChip key={index} label={field} size="small" />
          ))}
          {template.fields.length > (isCompact ? 3 : 4) && (
            <FieldChip label={`+${template.fields.length - (isCompact ? 3 : 4)}`} size="small" />
          )}
        </FieldsStack>

        <CardFooter direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {template.uses} uses
          </Typography>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <Button
              variant={isCompact ? 'text' : 'contained'}
              size="small"
              endIcon={<ArrowRight size={16} />}
              sx={{ minWidth: 'auto', textTransform: 'none' }}
            >
              {isCompact ? 'Use' : 'Use Template'}
            </Button>
          </Link>
        </CardFooter>
      </CardContent>
    </StyledCard>
  );
}

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: 'none',
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0px 8px 24px 0px ${theme.palette.primary.main}20`,
    borderColor: theme.palette.primary.main,
  },
}));

const TemplatePreview = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'height',
})<{ height: number }>(({ theme, height }) => ({
  width: '100%',
  height,
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  position: 'relative',
  color: theme.palette.primary.main,
}));

const PopularChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  height: 24,
  fontWeight: 600,
  fontSize: '0.7rem',
}));

const TemplateName = styled(Typography)(() => ({
  marginBottom: 8,
}));

const TemplateDescription = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'minHeight',
})<{ minHeight: number | string }>(({ minHeight }) => ({
  marginBottom: 16,
  flexGrow: 1,
  minHeight,
}));

const CategoryBadge = styled(Chip)(({ theme }) => ({
  height: 22,
  fontSize: '0.75rem',
  backgroundColor: `${theme.palette.primary.main}15`,
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const FieldsStack = styled(Stack)(({ theme }) => ({
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(2),
}));

const FieldChip = styled(Chip)(() => ({
  height: 20,
  fontSize: '0.7rem',
  backgroundColor: '#F5F5F5',
}));

const CardFooter = styled(Stack)(({ theme }) => ({
  marginTop: 'auto',
  gap: theme.spacing(2),
}));
