/**
 * Breadcrumb Element Component
 * Navigation breadcrumb trail with styled components
 */

'use client';

import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronRight } from 'lucide-react';
import type { LayoutElement } from '../element.types';

interface BreadcrumbProps {
  element: LayoutElement;
  isSmall?: boolean;
}

export function Breadcrumb({ element, isSmall }: BreadcrumbProps) {
  if (isSmall) {
    return (
      <BreadcrumbContainer>
        <BreadcrumbStep>Step 1</BreadcrumbStep>
        <ChevronRight size={12} />
        <BreadcrumbStepActive>Step 2</BreadcrumbStepActive>
      </BreadcrumbContainer>
    );
  }

  return (
    <BreadcrumbContainer>
      <BreadcrumbStep>Personal Info</BreadcrumbStep>
      <BreadcrumbSeparator />
      <BreadcrumbStepActive>Contact Details</BreadcrumbStepActive>
      <BreadcrumbSeparator />
      <BreadcrumbStepDisabled>Review</BreadcrumbStepDisabled>
    </BreadcrumbContainer>
  );
}

// Styled Components
const BreadcrumbContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const BreadcrumbStep = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
}));

const BreadcrumbStepActive = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: theme.typography.body2.fontSize,
}));

const BreadcrumbStepDisabled = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: theme.typography.body2.fontSize,
}));

const BreadcrumbSeparator = styled(ChevronRight)({
  color: '#919EAB',
  width: 16,
  height: 16,
});
