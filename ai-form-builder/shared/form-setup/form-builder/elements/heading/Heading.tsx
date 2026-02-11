/**
 * Heading Component - Decorator element
 */

'use client';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { DroppedElement } from '../../form-builder.configuration';

interface HeadingProps {
  element: DroppedElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Heading({ element, isSelected, onClick }: HeadingProps) {
  const getVariant = () => {
    switch (element.size) {
      case 'large':
        return 'h4';
      case 'small':
        return 'h6';
      default:
        return 'h5';
    }
  };

  return (
    <ElementWrapper onClick={onClick} isSelected={isSelected}>
      <Typography variant={getVariant()} align={element.align || 'left'}>
        {element.heading || 'Heading Text'}
      </Typography>
    </ElementWrapper>
  );
}

const ElementWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
  backgroundColor: isSelected ? theme.palette.action.hover : 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: theme.palette.primary.light,
    backgroundColor: theme.palette.action.hover,
  },
}));
