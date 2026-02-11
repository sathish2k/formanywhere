import { 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  FormControlLabel, 
  Checkbox, 
  Radio, 
  RadioGroup, 
  Switch as MuiSwitch, 
  Autocomplete, 
  Paper,
  IconButton,
  Stack,
  alpha
} from '@mui/material';
import { Upload as UploadIcon, Trash2, Copy, GripVertical } from 'lucide-react';
import { FormField } from '../App';

/**
 * Renders the actual MUI form field UI
 * Used in both Canvas and nested containers
 */
export function FormFieldRenderer({ 
  field, 
  onSelectField, 
  onDelete, 
  onDuplicate,
  isSelected 
}: { 
  field: FormField; 
  onSelectField?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  isSelected?: boolean;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (onSelectField) {
      e.stopPropagation();
      onSelectField(field.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(field.id);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(field.id);
    }
  };

  const fieldLabel = (
    <Typography 
      variant="subtitle2" 
      sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
    >
      {field.label}
      {field.required && <Typography component="span" color="error.main">*</Typography>}
    </Typography>
  );

  const helpText = field.helpText && (
    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
      {field.helpText}
    </Typography>
  );

  const wrapperStyle = {
    position: 'relative',
    cursor: onSelectField ? 'pointer' : 'default',
    p: onSelectField ? 2 : 0,
    bgcolor: isSelected ? alpha('#00A76F', 0.04) : 'transparent',
    borderRadius: 1,
    border: onSelectField ? 1 : 0,
    borderColor: isSelected ? 'primary.main' : 'transparent',
    transition: 'all 0.2s',
    '&:hover': onSelectField ? {
      bgcolor: alpha('#00A76F', 0.04),
      borderColor: 'primary.main',
      '& .field-actions': {
        opacity: 1
      }
    } : {}
  };

  const actionButtons = (onDelete || onDuplicate) && (
    <Stack 
      direction="row" 
      spacing={0.5} 
      className="field-actions"
      sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8,
        opacity: isSelected ? 1 : 0,
        transition: 'opacity 0.2s',
        zIndex: 10
      }}
    >
      {onDuplicate && (
        <IconButton 
          size="small" 
          onClick={handleDuplicate}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { 
              bgcolor: 'grey.100',
              color: 'primary.main'
            }
          }}
        >
          <Copy size={14} />
        </IconButton>
      )}
      {onDelete && (
        <IconButton 
          size="small" 
          onClick={handleDelete}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { 
              bgcolor: alpha('#FF5630', 0.08),
              color: 'error.main'
            }
          }}
        >
          <Trash2 size={14} />
        </IconButton>
      )}
    </Stack>
  );

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <TextField
            fullWidth
            type={field.type}
            placeholder={field.placeholder}
            size="medium"
            disabled
          />
          {helpText}
        </Box>
      );

    case 'password':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <TextField
            fullWidth
            type="password"
            placeholder={field.placeholder}
            size="medium"
            disabled
          />
          {helpText}
        </Box>
      );

    case 'number':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <TextField
            fullWidth
            type="number"
            placeholder={field.placeholder}
            size="medium"
            disabled
          />
          {helpText}
        </Box>
      );

    case 'textarea':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={field.placeholder}
            disabled
          />
          {helpText}
        </Box>
      );

    case 'select':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <FormControl fullWidth size="medium">
            <Select disabled displayEmpty defaultValue="">
              <MenuItem value="">
                <em>{field.placeholder || 'Select an option'}</em>
              </MenuItem>
              {field.options?.map((option, idx) => (
                <MenuItem key={idx} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {helpText}
        </Box>
      );

    case 'multiselect':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <FormControl fullWidth size="medium">
            <Select multiple disabled displayEmpty defaultValue={[]}>
              {field.options?.map((option, idx) => (
                <MenuItem key={idx} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {helpText}
        </Box>
      );

    case 'autocomplete':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <Autocomplete
            options={field.options || []}
            renderInput={(params) => (
              <TextField {...params} placeholder={field.placeholder} />
            )}
            disabled
          />
          {helpText}
        </Box>
      );

    case 'checkbox':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <Box>
            {field.options?.map((option, idx) => (
              <FormControlLabel
                key={idx}
                control={<Checkbox disabled />}
                label={option}
              />
            ))}
          </Box>
          {helpText}
        </Box>
      );

    case 'radio':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <RadioGroup>
            {field.options?.map((option, idx) => (
              <FormControlLabel
                key={idx}
                value={option}
                control={<Radio disabled />}
                label={option}
              />
            ))}
          </RadioGroup>
          {helpText}
        </Box>
      );

    case 'switch':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          <FormControlLabel
            control={<MuiSwitch disabled />}
            label={
              <Box>
                <Typography variant="subtitle2">{field.label}</Typography>
                {field.helpText && (
                  <Typography variant="caption" color="text.secondary">
                    {field.helpText}
                  </Typography>
                )}
              </Box>
            }
          />
        </Box>
      );

    case 'date':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <TextField
            fullWidth
            type="date"
            size="medium"
            disabled
            InputLabelProps={{ shrink: true }}
          />
          {helpText}
        </Box>
      );

    case 'time':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <TextField
            fullWidth
            type="time"
            size="medium"
            disabled
            InputLabelProps={{ shrink: true }}
          />
          {helpText}
        </Box>
      );

    case 'datetime':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <TextField
            fullWidth
            type="datetime-local"
            size="medium"
            disabled
            InputLabelProps={{ shrink: true }}
          />
          {helpText}
        </Box>
      );

    case 'file':
    case 'image':
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <Paper
            sx={{
              p: 3,
              border: 2,
              borderStyle: 'dashed',
              borderColor: 'grey.300',
              bgcolor: 'grey.50',
              textAlign: 'center',
              cursor: 'not-allowed'
            }}
          >
            <UploadIcon size={32} color="#919EAB" style={{ marginBottom: 8 }} />
            <Typography variant="body2" color="text.secondary">
              {field.placeholder || `Drop ${field.type === 'image' ? 'images' : 'files'} here or click to browse`}
            </Typography>
          </Paper>
          {helpText}
        </Box>
      );

    default:
      return (
        <Box onClick={handleClick} sx={wrapperStyle}>
          {actionButtons}
          {fieldLabel}
          <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
            <Typography variant="caption" color="text.secondary">
              {field.type} field preview
            </Typography>
          </Paper>
        </Box>
      );
  }
}