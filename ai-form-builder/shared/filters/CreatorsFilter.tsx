/**
 * Creators Filter Component
 * Searchable popover filter for creators with avatars
 */

'use client';

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  OutlinedInput,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronDown, Search, User } from 'lucide-react';
import { useMemo, useState } from 'react';

interface CreatorsFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  creatorSearch: string;
  onCreatorSearchChange: (value: string) => void;
  availableCreators: string[];
}

export function CreatorsFilter({
  value,
  onChange,
  creatorSearch,
  onCreatorSearchChange,
  availableCreators,
}: CreatorsFilterProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const hasValue = value.length > 0;

  const filteredCreators = useMemo(() => {
    return availableCreators.filter((creator) =>
      creator.toLowerCase().includes(creatorSearch.toLowerCase())
    );
  }, [availableCreators, creatorSearch]);

  const handleToggle = (creator: string) => {
    if (value.includes(creator)) {
      onChange(value.filter((c) => c !== creator));
    } else {
      onChange([...value, creator]);
    }
  };

  const handleDelete = (e: React.MouseEvent, creator: string) => {
    e.stopPropagation();
    onChange(value.filter((c) => c !== creator));
  };

  const handleClear = () => {
    onChange([]);
    onCreatorSearchChange('');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip
        title={
          hasValue ? (
            <Box>
              {value.map((creator, index) => (
                <Box key={creator}>
                  <Typography variant="caption">{creator}</Typography>
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
            <User size={16} />
            {hasValue ? (
              <Stack direction="row" spacing={0.5} sx={{ flex: 1, overflow: 'hidden' }}>
                {value.slice(0, 2).map((creator) => (
                  <StyledChip
                    key={creator}
                    label={creator}
                    size="small"
                    onDelete={(e) => handleDelete(e, creator)}
                    avatar={
                      <Avatar
                        sx={{
                          width: 16,
                          height: 16,
                          fontSize: '0.5rem',
                          bgcolor: 'white',
                          color: 'primary.main',
                        }}
                      >
                        {creator.charAt(0)}
                      </Avatar>
                    }
                  />
                ))}
                {value.length > 2 && (
                  <Chip
                    label={`+${value.length - 2}`}
                    size="small"
                    sx={{
                      height: 20,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
                    }}
                  />
                )}
              </Stack>
            ) : (
              <Typography variant="body2">Creators</Typography>
            )}
          </Box>
        </FilterButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow:
                '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
              mt: 1,
              width: 300,
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Search Input */}
          <StyledInput
            placeholder="Search creators..."
            size="small"
            value={creatorSearch}
            onChange={(e) => onCreatorSearchChange(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Search size={16} color="#637381" />
              </InputAdornment>
            }
            fullWidth
          />

          {/* Creators List */}
          <Box sx={{ maxHeight: 250, overflowY: 'auto' }}>
            {filteredCreators.length > 0 ? (
              <FormGroup>
                {filteredCreators.map((creator) => (
                  <FormControlLabel
                    key={creator}
                    control={
                      <Checkbox
                        checked={value.includes(creator)}
                        onChange={() => handleToggle(creator)}
                        size="small"
                        sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            fontSize: '0.625rem',
                            bgcolor: 'primary.main',
                          }}
                        >
                          {creator.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">{creator}</Typography>
                      </Box>
                    }
                    sx={{ ml: -0.5, '&:hover': { bgcolor: 'grey.100', borderRadius: 1 } }}
                  />
                ))}
              </FormGroup>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ py: 2, textAlign: 'center' }}
              >
                No creators found
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <ClearButton size="small" variant="outlined" fullWidth onClick={handleClear}>
              Clear
            </ClearButton>
            <ApplyButton size="small" variant="contained" fullWidth onClick={handleClose}>
              Apply
            </ApplyButton>
          </Stack>
        </Box>
      </Popover>
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

const StyledInput = styled(OutlinedInput)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[300],
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[400],
  },
}));

const ClearButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderColor: theme.palette.grey[300],
  '&:hover': {
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[100],
  },
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  boxShadow: 'none',
  '&:hover': {
    boxShadow: `0px 8px 16px 0px ${theme.palette.primary.main}3D`,
  },
}));
