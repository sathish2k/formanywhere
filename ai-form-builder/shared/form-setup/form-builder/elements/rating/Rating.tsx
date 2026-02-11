/**
 * Rating Component
 * Renders star rating input on canvas
 */

'use client';

import { Box, Rating as MuiRating, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { DroppedElement } from '../../form-builder.configuration';

interface RatingProps {
  element: DroppedElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Rating({ element, isSelected, onClick }: RatingProps) {
  const maxStars = element.maxStars || 5;

  return (
    <ElementWrapper onClick={onClick} isSelected={isSelected}>
      <Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {element.required ? `${element.label} *` : element.label}
        </Typography>
        <MuiRating
          name={`rating-${element.id}`}
          value={0}
          max={maxStars}
          size="large"
          disabled
          sx={{ pointerEvents: 'none' }}
        />
        {element.helperText && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {element.helperText}
          </Typography>
        )}
      </Box>
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
