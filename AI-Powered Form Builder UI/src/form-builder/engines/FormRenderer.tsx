/**
 * Form Renderer Engine
 * Dynamically renders form elements based on configuration
 */

import React from 'react';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Switch,
  Paper,
  Box,
  Typography,
  Rating,
  Button,
} from '@mui/material';
import { Upload as UploadIcon } from 'lucide-react';
import { DroppedElement } from '../types/form.types';
import { RulesEngine, RuleEvaluationResult } from './RulesEngine';

export interface FormRendererProps {
  elements: DroppedElement[];
  formData: Record<string, any>;
  errors: Record<string, string>;
  ruleResult?: RuleEvaluationResult;
  onChange: (fieldId: string, value: any) => void;
  onBlur?: (fieldId: string) => void;
  readOnly?: boolean;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  elements,
  formData,
  errors,
  ruleResult,
  onChange,
  onBlur,
  readOnly = false,
}) => {
  const isVisible = (elementId: string) => {
    return !ruleResult || ruleResult.visibility[elementId] !== false;
  };

  const isEnabled = (elementId: string) => {
    return !ruleResult || ruleResult.enabled[elementId] !== false;
  };

  const isRequired = (elementId: string, element: DroppedElement) => {
    return ruleResult ? ruleResult.required[elementId] : element.required;
  };

  const renderElement = (element: DroppedElement) => {
    if (!isVisible(element.id)) {
      return null;
    }

    const value = formData[element.id] ?? element.defaultValue ?? '';
    const error = errors[element.id];
    const disabled = !isEnabled(element.id) || readOnly;
    const required = isRequired(element.id, element);

    const commonProps = {
      disabled,
      error: !!error,
      helperText: error || element.helperText,
    };

    switch (element.type) {
      case 'short-text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <TextField
            fullWidth
            size="small"
            label={element.label}
            placeholder={element.placeholder}
            type={element.type === 'email' ? 'email' : 'text'}
            value={value}
            onChange={(e) => onChange(element.id, e.target.value)}
            onBlur={() => onBlur?.(element.id)}
            required={required}
            variant={element.inputVariant || 'outlined'}
            {...commonProps}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            size="small"
            label={element.label}
            placeholder={element.placeholder}
            type="number"
            value={value}
            onChange={(e) => onChange(element.id, e.target.value)}
            onBlur={() => onBlur?.(element.id)}
            required={required}
            variant={element.inputVariant || 'outlined'}
            inputProps={{
              min: element.validation?.min,
              max: element.validation?.max,
            }}
            {...commonProps}
          />
        );

      case 'long-text':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={element.label}
            placeholder={element.placeholder}
            value={value}
            onChange={(e) => onChange(element.id, e.target.value)}
            onBlur={() => onBlur?.(element.id)}
            required={required}
            variant={element.inputVariant || 'outlined'}
            {...commonProps}
          />
        );

      case 'dropdown':
        return (
          <FormControl fullWidth size="small" required={required} {...commonProps}>
            <Select
              value={value}
              onChange={(e) => onChange(element.id, e.target.value)}
              onBlur={() => onBlur?.(element.id)}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select {element.label}</em>
              </MenuItem>
              {element.options?.map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'radio':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              {element.label} {required && <span style={{ color: 'red' }}>*</span>}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => onChange(element.id, e.target.value)}
            >
              {element.options?.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio size="small" disabled={disabled} />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </Box>
        );

      case 'checkbox':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              {element.label} {required && <span style={{ color: 'red' }}>*</span>}
            </Typography>
            {element.options?.map((option, idx) => (
              <FormControlLabel
                key={idx}
                control={
                  <Checkbox
                    checked={(value || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = value || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      onChange(element.id, newValues);
                    }}
                    disabled={disabled}
                  />
                }
                label={option}
              />
            ))}
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </Box>
        );

      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => onChange(element.id, e.target.checked)}
                disabled={disabled}
              />
            }
            label={element.label}
          />
        );

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            size="small"
            label={element.label}
            value={value}
            onChange={(e) => onChange(element.id, e.target.value)}
            onBlur={() => onBlur?.(element.id)}
            required={required}
            variant={element.inputVariant || 'outlined'}
            InputLabelProps={{ shrink: true }}
            {...commonProps}
          />
        );

      case 'time':
        return (
          <TextField
            fullWidth
            type="time"
            size="small"
            label={element.label}
            value={value}
            onChange={(e) => onChange(element.id, e.target.value)}
            onBlur={() => onBlur?.(element.id)}
            required={required}
            variant={element.inputVariant || 'outlined'}
            InputLabelProps={{ shrink: true }}
            {...commonProps}
          />
        );

      case 'file-upload':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              {element.label} {required && <span style={{ color: 'red' }}>*</span>}
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: 'center',
                borderStyle: 'dashed',
                borderColor: error ? 'error.main' : 'divider',
                bgcolor: 'background.default',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
              }}
            >
              <UploadIcon size={20} color="#919EAB" style={{ marginBottom: 8 }} />
              <Typography variant="body2" color="text.secondary">
                {value ? value.name || 'File selected' : 'Drag and drop file here or '}
                <Typography component="span" color="primary">
                  Choose file
                </Typography>
              </Typography>
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(element.id, file);
                  }
                }}
                disabled={disabled}
              />
            </Paper>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </Box>
        );

      case 'rating':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              {element.label} {required && <span style={{ color: 'red' }}>*</span>}
            </Typography>
            <Rating
              value={value || 0}
              onChange={(_, newValue) => onChange(element.id, newValue)}
              disabled={disabled}
            />
            {error && (
              <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </Box>
        );

      case 'logo':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 1,
            }}
          >
            <img
              src={element.logoUrl || 'https://via.placeholder.com/150x50?text=Logo'}
              alt={element.logoAlt || 'Logo'}
              style={{ maxWidth: '150px', height: 'auto' }}
            />
          </Box>
        );

      case 'container':
      case 'stack':
      case 'grid':
        return (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              borderStyle: 'dashed',
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {element.label}
            </Typography>
          </Paper>
        );

      default:
        return (
          <Typography variant="body2" color="text.secondary">
            Unsupported element type: {element.type}
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {elements.map((element) => (
        <Box key={element.id}>{renderElement(element)}</Box>
      ))}
    </Box>
  );
};
