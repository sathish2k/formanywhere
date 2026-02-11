/**
 * Search Filter Component
 * Reusable search input with icon
 */

'use client';

import { InputAdornment, OutlinedInput } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchFilter({ value, onChange, placeholder = 'Search...' }: SearchFilterProps) {
  return (
    <StyledInput
      placeholder={placeholder}
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      startAdornment={
        <InputAdornment position="start">
          <Search size={18} color="#637381" />
        </InputAdornment>
      }
    />
  );
}

// Styled Components
const StyledInput = styled(OutlinedInput)(({ theme }) => ({
  minWidth: 240,
  flex: '1 1 auto',
  backgroundColor: theme.palette.background.paper,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[300],
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[400],
  },
}));
