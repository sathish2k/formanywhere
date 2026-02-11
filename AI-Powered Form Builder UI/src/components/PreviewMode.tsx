import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  Switch,
  Rating,
  IconButton,
  LinearProgress,
  Container,
  Stack,
  Chip,
  FormControl,
  FormLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Upload as UploadIcon,
  Smartphone,
  Monitor,
  Tablet,
  Image as ImageIcon,
} from 'lucide-react';
import { PageData } from './FormSetup';

interface DroppedElement {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  icon: any;
  color: string;
  required?: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
  isLayoutElement?: boolean;
  logoUrl?: string;
  logoAlt?: string;
}

interface LayoutConfig {
  logo?: {
    url: string;
    alt: string;
  };
  stepper: boolean;
  header: DroppedElement[];
  footer: DroppedElement[];
}

interface PreviewModeProps {
  formName: string;
  formDescription: string;
  pages: PageData[];
  pageElements: Record<string, DroppedElement[]>;
  layoutConfig: LayoutConfig;
  onClose: () => void;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';

export function PreviewMode({
  formName,
  formDescription,
  pages,
  pageElements,
  layoutConfig,
  onClose,
}: PreviewModeProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [submitted, setSubmitted] = useState(false);

  const currentPage = pages[currentPageIndex];
  const currentElements = pageElements[currentPage?.id] || [];
  
  // Filter out layout elements for content
  const contentElements = currentElements.filter(el => !el.isLayoutElement);
  const headerElements = currentElements.filter(el => el.isLayoutElement && layoutConfig.header.some(h => h.type === el.type));
  const footerElements = currentElements.filter(el => el.isLayoutElement && layoutConfig.footer.some(f => f.type === el.type));

  const progress = ((currentPageIndex + 1) / pages.length) * 100;

  const handleInputChange = (elementId: string, value: any) => {
    setFormData({
      ...formData,
      [elementId]: value,
    });
    // Clear error when user starts typing
    if (errors[elementId]) {
      const newErrors = { ...errors };
      delete newErrors[elementId];
      setErrors(newErrors);
    }
  };

  const validatePage = () => {
    const newErrors: Record<string, string> = {};
    
    contentElements.forEach((element) => {
      if (element.required && !formData[element.id]) {
        newErrors[element.id] = `${element.label} is required`;
      }
      
      if (element.validation && formData[element.id]) {
        const value = formData[element.id];
        
        if (element.validation.minLength && value.length < element.validation.minLength) {
          newErrors[element.id] = `Minimum ${element.validation.minLength} characters required`;
        }
        
        if (element.validation.maxLength && value.length > element.validation.maxLength) {
          newErrors[element.id] = `Maximum ${element.validation.maxLength} characters allowed`;
        }
        
        if (element.validation.pattern) {
          const regex = new RegExp(element.validation.pattern);
          if (!regex.test(value)) {
            newErrors[element.id] = element.validation.message || 'Invalid format';
          }
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validatePage()) {
      if (currentPageIndex < pages.length - 1) {
        setCurrentPageIndex(currentPageIndex + 1);
      } else {
        // Submit form
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const renderFormElement = (element: DroppedElement) => {
    const value = formData[element.id] || '';
    const error = errors[element.id];

    return (
      <Box key={element.id} sx={{ mb: 3 }}>
        {/* Label */}
        <FormLabel sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
          {element.label}
          {element.required && <Typography component="span" color="error">*</Typography>}
        </FormLabel>

        {/* Input Field */}
        {element.type === 'short-text' && (
          <TextField
            fullWidth
            size="small"
            value={value}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            placeholder={element.placeholder}
            error={!!error}
            helperText={error}
            variant={element.inputVariant || 'outlined'}
          />
        )}

        {element.type === 'long-text' && (
          <TextField
            fullWidth
            multiline
            variant={element.inputVariant || 'outlined'}
            rows={4}
            value={value}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            placeholder={element.placeholder}
            error={!!error}
            helperText={error}
          />
        )}

        {element.type === 'email' && (
          <TextField
            fullWidth
            size="small"
            type="email"
            value={value}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            placeholder={element.placeholder}
            error={!!error}
            helperText={error}
            variant={element.inputVariant || 'outlined'}
          />
        )}

        {element.type === 'phone' && (
          <TextField
            fullWidth
            variant={element.inputVariant || 'outlined'}
            size="small"
            type="tel"
            value={value}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            placeholder={element.placeholder}
            error={!!error}
            helperText={error}
          />
        )}

        {element.type === 'number' && (
          <TextField
            fullWidth
            size="small"
            type="number"
            value={value}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            placeholder={element.placeholder}
            error={!!error}
            helperText={error}
            variant={element.inputVariant || 'outlined'}
          />
        )}

        {element.type === 'url' && (
          <TextField
            fullWidth
            variant={element.inputVariant || 'outlined'}
            size="small"
            type="url"
            value={value}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            placeholder={element.placeholder}
            error={!!error}
            helperText={error}
          />
        )}

        {element.type === 'date' && (
          <TextField
            fullWidth
            size="small"
            type="date"
            value={value}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            error={!!error}
            helperText={error}
            variant={element.inputVariant || 'outlined'}
            InputLabelProps={{ shrink: true }}
          />
        )}

        {element.type === 'time' && (
          <TextField
            fullWidth
            variant={element.inputVariant || 'outlined'}
            size="small"
            type="time"
            value={value}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            error={!!error}
            helperText={error}
            InputLabelProps={{ shrink: true }}
          />
        )}

        {element.type === 'dropdown' && (
          <FormControl fullWidth size="small" error={!!error}>
            <Select
              value={value}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                {element.placeholder || 'Select an option'}
              </MenuItem>
              {element.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        )}

        {element.type === 'radio' && (
          <FormControl error={!!error}>
            <RadioGroup
              value={value}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
            >
              {element.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio size="small" />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        )}

        {element.type === 'checkbox' && (
          <FormControl error={!!error}>
            <FormGroup>
              {element.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      size="small"
                      checked={value[option] || false}
                      onChange={(e) =>
                        handleInputChange(element.id, {
                          ...value,
                          [option]: e.target.checked,
                        })
                      }
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        )}

        {element.type === 'switch' && (
          <FormControlLabel
            control={
              <Switch
                checked={value || false}
                onChange={(e) => handleInputChange(element.id, e.target.checked)}
              />
            }
            label={element.placeholder || 'Toggle option'}
          />
        )}

        {element.type === 'rating' && (
          <Box>
            <Rating
              value={value || 0}
              onChange={(e, newValue) => handleInputChange(element.id, newValue)}
              size="large"
            />
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {error}
              </Typography>
            )}
          </Box>
        )}

        {element.type === 'file-upload' && (
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon size={16} />}
              fullWidth
            >
              {value ? 'File Selected' : 'Choose File'}
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleInputChange(element.id, e.target.files[0].name);
                  }
                }}
              />
            </Button>
            {value && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {value}
              </Typography>
            )}
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {error}
              </Typography>
            )}
          </Box>
        )}

        {/* Container, Stack, Grid - Layout elements */}
        {['container', 'stack', 'grid'].includes(element.type) && (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              borderStyle: 'dashed',
              borderColor: 'divider',
              bgcolor: 'background.default'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {element.label} - Content goes here
            </Typography>
          </Paper>
        )}

        {/* Logo element */}
        {element.type === 'logo' && element.logoUrl && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src={element.logoUrl} 
              alt={element.logoAlt || 'Logo'} 
              style={{ maxHeight: 60, objectFit: 'contain' }}
            />
          </Box>
        )}
      </Box>
    );
  };

  const getViewModeWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 375;
      case 'tablet':
        return 768;
      case 'desktop':
      default:
        return '100%';
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullScreen
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: '#F9FAFB'
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Form Preview
          </Typography>
          <Chip label={formName} size="small" />
        </Box>

        {/* View Mode Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => setViewMode('desktop')}
            sx={{
              bgcolor: viewMode === 'desktop' ? 'primary.main' : 'transparent',
              color: viewMode === 'desktop' ? 'white' : 'text.secondary',
              '&:hover': {
                bgcolor: viewMode === 'desktop' ? 'primary.dark' : 'action.hover',
              }
            }}
          >
            <Monitor size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setViewMode('tablet')}
            sx={{
              bgcolor: viewMode === 'tablet' ? 'primary.main' : 'transparent',
              color: viewMode === 'tablet' ? 'white' : 'text.secondary',
              '&:hover': {
                bgcolor: viewMode === 'tablet' ? 'primary.dark' : 'action.hover',
              }
            }}
          >
            <Tablet size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setViewMode('mobile')}
            sx={{
              bgcolor: viewMode === 'mobile' ? 'primary.main' : 'transparent',
              color: viewMode === 'mobile' ? 'white' : 'text.secondary',
              '&:hover': {
                bgcolor: viewMode === 'mobile' ? 'primary.dark' : 'action.hover',
              }
            }}
          >
            <Smartphone size={18} />
          </IconButton>
        </Box>
      </Box>

      {/* Preview Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box
          sx={{
            width: getViewModeWidth(),
            maxWidth: viewMode === 'desktop' ? 800 : getViewModeWidth(),
            transition: 'width 0.3s ease',
          }}
        >
          {submitted ? (
            // Success Message
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                bgcolor: 'background.paper',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3,
                }}
              >
                <Check size={40} color="#22C55E" strokeWidth={3} />
              </Box>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                Form Submitted!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Thank you for completing the form. Your response has been recorded.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSubmitted(false);
                  setCurrentPageIndex(0);
                  setFormData({});
                  setErrors({});
                }}
              >
                Submit Another Response
              </Button>
            </Paper>
          ) : (
            <Paper
              sx={{
                overflow: 'hidden',
                bgcolor: 'background.paper',
              }}
            >
              {/* Logo (if configured) */}
              {layoutConfig.logo && (
                <Box
                  sx={{
                    p: 3,
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'center',
                    bgcolor: 'white',
                  }}
                >
                  <img
                    src={layoutConfig.logo.url}
                    alt={layoutConfig.logo.alt}
                    style={{ maxHeight: 60, objectFit: 'contain' }}
                  />
                </Box>
              )}

              {/* Header Elements */}
              {headerElements.length > 0 && (
                <Box
                  sx={{
                    p: 3,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                  }}
                >
                  {headerElements.map((element) => renderFormElement(element))}
                </Box>
              )}

              {/* Progress Bar */}
              <Box sx={{ px: 3, pt: 3 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    }
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, textAlign: 'center' }}
                >
                  Step {currentPageIndex + 1} of {pages.length}
                </Typography>
              </Box>

              {/* Stepper (if enabled) */}
              {layoutConfig.stepper && pages.length > 1 && (
                <Box sx={{ px: 3, pt: 3 }}>
                  <Stepper activeStep={currentPageIndex} alternativeLabel>
                    {pages.map((page, index) => (
                      <Step key={page.id}>
                        <StepLabel>{page.name}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              )}

              {/* Form Content */}
              <Box sx={{ p: 4 }}>
                {/* Page Title */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {currentPage?.name || formName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {currentPage?.description || formDescription}
                  </Typography>
                </Box>

                {/* Form Fields */}
                {contentElements.length > 0 ? (
                  contentElements.map((element) => renderFormElement(element))
                ) : (
                  <Box
                    sx={{
                      py: 6,
                      textAlign: 'center',
                      border: 2,
                      borderStyle: 'dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      bgcolor: 'background.default',
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No form fields added to this page yet
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Footer Elements */}
              {footerElements.length > 0 && (
                <Box
                  sx={{
                    p: 3,
                    borderTop: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                  }}
                >
                  {footerElements.map((element) => renderFormElement(element))}
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box
                sx={{
                  p: 3,
                  borderTop: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  bgcolor: 'white',
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowLeft size={16} />}
                  onClick={handleBack}
                  disabled={currentPageIndex === 0}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  endIcon={
                    currentPageIndex === pages.length - 1 ? (
                      <Check size={16} />
                    ) : (
                      <ArrowRight size={16} />
                    )
                  }
                  onClick={handleNext}
                >
                  {currentPageIndex === pages.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}