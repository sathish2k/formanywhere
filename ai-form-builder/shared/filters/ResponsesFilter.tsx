/**
 * Responses Filter Component
 * Reusable filter for response ranges with multi-select
 */

'use client';

import {
  Box,
  Button,
  Chip,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Check, ChevronDown, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const RESPONSE_RANGES = ['0-50', '51-100', '101+'];

interface ResponsesFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ResponsesFilter({ value, onChange }: ResponsesFilterProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const hasValue = value.length > 0;

  const handleToggle = (range: string) => {
    if (value.includes(range)) {
      onChange(value.filter((r) => r !== range));
    } else {
      onChange([...value, range]);
    }
  };

  const handleDelete = (e: React.MouseEvent, range: string) => {
    e.stopPropagation();
    onChange(value.filter((r) => r !== range));
  };

  return (
    <>
      <Tooltip
        title={
          hasValue ? (
            <Box>
              {value.map((range, index) => (
                <Box key={range}>
                  <Typography variant="caption">{range} responses</Typography>
                  {index < value.length - 1 && <br />}
                </Box>
              ))}
            </Box>
          ) : (
            ''
          )
        }
        arrow
        placement="top"
      >
        <FilterButton
          variant="outlined"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          endIcon={<ChevronDown size={16} />}
          hasValue={hasValue}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, overflow: 'hidden' }}
          >
            <MessageSquare size={16} />
            {hasValue ? (
              <Stack direction="row" spacing={0.5} sx={{ flex: 1, overflow: 'hidden' }}>
                {value.map((range) => (
                  <StyledChip
                    key={range}
                    label={range}
                    size="small"
                    onDelete={(e) => handleDelete(e, range)}
                  />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2">Responses</Typography>
            )}
          </Box>
        </FilterButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {RESPONSE_RANGES.map((range) => (
          <MenuItem key={range} onClick={() => handleToggle(range)}>
            <ListItemIcon>
              {value.includes(range) ? (
                <Check size={16} strokeWidth={2.5} />
              ) : (
                <Box sx={{ width: 16 }} />
              )}
            </ListItemIcon>
            <ListItemText>{range} responses</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// Styled Components
const FilterButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'hasValue',
})<{ hasValue: boolean }>(({ theme, hasValue }) => ({
  minWidth: 150,
  maxWidth: 250,
  justifyContent: 'space-between',
  color: theme.palette.text.secondary,
  borderColor: hasValue ? theme.palette.primary.main : theme.palette.grey[300],
  backgroundColor: hasValue ? `${theme.palette.primary.main}14` : 'transparent',
  textTransform: 'none',
  '&:hover': {
    borderColor: theme.palette.grey[400],
    backgroundColor: hasValue ? `${theme.palette.primary.main}1F` : theme.palette.grey[100],
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  height: 20,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
  '& .MuiChip-deleteIcon': {
    color: 'white',
    fontSize: '0.875rem',
    '&:hover': { color: 'rgba(255,255,255,0.8)' },
  },
}));
