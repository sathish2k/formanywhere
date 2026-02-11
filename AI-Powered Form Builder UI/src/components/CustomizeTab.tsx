import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Slider,
  RadioGroup,
  Radio,
  Chip,
  Grid,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Palette,
  Type,
  Layout,
  Smartphone,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  borderRadius: number;
  buttonStyle: 'filled' | 'outlined' | 'text';
  inputStyle: 'outlined' | 'filled' | 'standard';
  spacing: number;
}

interface CustomizeTabProps {
  onPreview: () => void;
}

export function CustomizeTab({ onPreview }: CustomizeTabProps) {
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: '#5B5FED',
    secondaryColor: '#8E33FF',
    backgroundColor: '#FFFFFF',
    textColor: '#212B36',
    fontFamily: 'Public Sans',
    fontSize: 14,
    borderRadius: 8,
    buttonStyle: 'filled',
    inputStyle: 'outlined',
    spacing: 16,
  });

  const [backgroundImage, setBackgroundImage] = useState('');
  const [logoAlignment, setLogoAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [formWidth, setFormWidth] = useState(600);
  const [showShadows, setShowShadows] = useState(true);

  const fontFamilies = [
    'Public Sans',
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Merriweather',
  ];

  const presetThemes = [
    { name: 'Default', primaryColor: '#5B5FED', secondaryColor: '#8E33FF' },
    { name: 'Ocean', primaryColor: '#0891B2', secondaryColor: '#06B6D4' },
    { name: 'Forest', primaryColor: '#059669', secondaryColor: '#10B981' },
    { name: 'Sunset', primaryColor: '#EA580C', secondaryColor: '#F97316' },
    { name: 'Purple', primaryColor: '#9333EA', secondaryColor: '#A855F7' },
    { name: 'Pink', primaryColor: '#DB2777', secondaryColor: '#EC4899' },
  ];

  const handleThemeUpdate = (updates: Partial<ThemeConfig>) => {
    setTheme({ ...theme, ...updates });
  };

  const applyPresetTheme = (preset: typeof presetThemes[0]) => {
    handleThemeUpdate({
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
    });
  };

  const resetToDefaults = () => {
    setTheme({
      primaryColor: '#5B5FED',
      secondaryColor: '#8E33FF',
      backgroundColor: '#FFFFFF',
      textColor: '#212B36',
      fontFamily: 'Public Sans',
      fontSize: 14,
      borderRadius: 8,
      buttonStyle: 'filled',
      inputStyle: 'outlined',
      spacing: 16,
    });
    setBackgroundImage('');
    setLogoAlignment('center');
    setFormWidth(600);
    setShowShadows(true);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left Panel - Customization Options */}
      <Box
        sx={{
          width: 360,
          borderRight: 1,
          borderColor: 'divider',
          overflow: 'auto',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Palette size={24} />
              Theme Customization
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customize the look and feel of your form
            </Typography>
          </Box>

          <Stack spacing={3}>
            {/* Preset Themes */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Themes
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {presetThemes.map((preset) => (
                  <Chip
                    key={preset.name}
                    label={preset.name}
                    onClick={() => applyPresetTheme(preset)}
                    sx={{
                      bgcolor: preset.primaryColor,
                      color: 'white',
                      '&:hover': {
                        bgcolor: preset.secondaryColor,
                      },
                    }}
                  />
                ))}
              </Box>
            </Paper>

            <Divider />

            {/* Colors */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Palette size={18} />
                Colors
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Primary Color
                  </FormLabel>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={theme.primaryColor}
                      onChange={(e) => handleThemeUpdate({ primaryColor: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: 1,
                                bgcolor: theme.primaryColor,
                                border: 1,
                                borderColor: 'divider',
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => handleThemeUpdate({ primaryColor: e.target.value })}
                      style={{
                        width: 50,
                        height: 40,
                        border: '1px solid #DFE3E8',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Secondary Color
                  </FormLabel>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={theme.secondaryColor}
                      onChange={(e) => handleThemeUpdate({ secondaryColor: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: 1,
                                bgcolor: theme.secondaryColor,
                                border: 1,
                                borderColor: 'divider',
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <input
                      type="color"
                      value={theme.secondaryColor}
                      onChange={(e) => handleThemeUpdate({ secondaryColor: e.target.value })}
                      style={{
                        width: 50,
                        height: 40,
                        border: '1px solid #DFE3E8',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Background Color
                  </FormLabel>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={theme.backgroundColor}
                      onChange={(e) => handleThemeUpdate({ backgroundColor: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: 1,
                                bgcolor: theme.backgroundColor,
                                border: 1,
                                borderColor: 'divider',
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <input
                      type="color"
                      value={theme.backgroundColor}
                      onChange={(e) => handleThemeUpdate({ backgroundColor: e.target.value })}
                      style={{
                        width: 50,
                        height: 40,
                        border: '1px solid #DFE3E8',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Text Color
                  </FormLabel>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={theme.textColor}
                      onChange={(e) => handleThemeUpdate({ textColor: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: 1,
                                bgcolor: theme.textColor,
                                border: 1,
                                borderColor: 'divider',
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <input
                      type="color"
                      value={theme.textColor}
                      onChange={(e) => handleThemeUpdate({ textColor: e.target.value })}
                      style={{
                        width: 50,
                        height: 40,
                        border: '1px solid #DFE3E8',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Typography */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Type size={18} />
                Typography
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Font Family
                  </FormLabel>
                  <FormControl fullWidth size="small">
                    <Select
                      value={theme.fontFamily}
                      onChange={(e) => handleThemeUpdate({ fontFamily: e.target.value })}
                    >
                      {fontFamilies.map((font) => (
                        <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                          {font}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Base Font Size: {theme.fontSize}px
                  </FormLabel>
                  <Slider
                    value={theme.fontSize}
                    onChange={(e, value) => handleThemeUpdate({ fontSize: value as number })}
                    min={12}
                    max={20}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Layout */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Layout size={18} />
                Layout
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Border Radius: {theme.borderRadius}px
                  </FormLabel>
                  <Slider
                    value={theme.borderRadius}
                    onChange={(e, value) => handleThemeUpdate({ borderRadius: value as number })}
                    min={0}
                    max={24}
                    step={2}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Spacing: {theme.spacing}px
                  </FormLabel>
                  <Slider
                    value={theme.spacing}
                    onChange={(e, value) => handleThemeUpdate({ spacing: value as number })}
                    min={8}
                    max={32}
                    step={4}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Form Width: {formWidth}px
                  </FormLabel>
                  <Slider
                    value={formWidth}
                    onChange={(e, value) => setFormWidth(value as number)}
                    min={400}
                    max={1200}
                    step={50}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Logo Alignment
                  </FormLabel>
                  <FormControl fullWidth size="small">
                    <RadioGroup
                      value={logoAlignment}
                      onChange={(e) => setLogoAlignment(e.target.value as any)}
                      row
                    >
                      <FormControlLabel value="left" control={<Radio size="small" />} label="Left" />
                      <FormControlLabel value="center" control={<Radio size="small" />} label="Center" />
                      <FormControlLabel value="right" control={<Radio size="small" />} label="Right" />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={showShadows}
                      onChange={(e) => setShowShadows(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Show shadows"
                />
              </Stack>
            </Box>

            <Divider />

            {/* Component Styles */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Component Styles
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Button Style
                  </FormLabel>
                  <FormControl fullWidth size="small">
                    <Select
                      value={theme.buttonStyle}
                      onChange={(e) => handleThemeUpdate({ buttonStyle: e.target.value as any })}
                    >
                      <MenuItem value="filled">Filled</MenuItem>
                      <MenuItem value="outlined">Outlined</MenuItem>
                      <MenuItem value="text">Text</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Input Style
                  </FormLabel>
                  <FormControl fullWidth size="small">
                    <Select
                      value={theme.inputStyle}
                      onChange={(e) => handleThemeUpdate({ inputStyle: e.target.value as any })}
                    >
                      <MenuItem value="outlined">Outlined</MenuItem>
                      <MenuItem value="filled">Filled</MenuItem>
                      <MenuItem value="standard">Standard</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Background Image */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon size={18} />
                Background Image
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="https://example.com/image.jpg"
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
                helperText="Enter a URL for the background image"
              />
            </Box>

            {/* Action Buttons */}
            <Stack spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={<RefreshCw size={16} />}
                onClick={resetToDefaults}
                fullWidth
              >
                Reset to Defaults
              </Button>
              <Button
                variant="contained"
                startIcon={<Eye size={16} />}
                onClick={onPreview}
                fullWidth
              >
                Preview Changes
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Right Panel - Live Preview */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          bgcolor: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Paper
          sx={{
            width: formWidth,
            maxWidth: '100%',
            p: 4,
            bgcolor: theme.backgroundColor,
            color: theme.textColor,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSize,
            borderRadius: `${theme.borderRadius}px`,
            boxShadow: showShadows ? 4 : 0,
          }}
        >
          {/* Sample Form Preview */}
          <Box sx={{ textAlign: logoAlignment, mb: 3 }}>
            <Box
              sx={{
                width: 150,
                height: 50,
                bgcolor: 'grey.200',
                borderRadius: `${theme.borderRadius}px`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Logo
              </Typography>
            </Box>
          </Box>

          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Sample Form Title
          </Typography>
          <Typography variant="body2" sx={{ mb: theme.spacing / 8, opacity: 0.7 }}>
            This is a preview of how your form will look with the current theme settings.
          </Typography>

          <Stack spacing={theme.spacing / 8}>
            <Box>
              <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                Full Name *
              </FormLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your name"
                variant={theme.inputStyle}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: `${theme.borderRadius}px`,
                  },
                }}
              />
            </Box>

            <Box>
              <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                Email Address *
              </FormLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your email"
                type="email"
                variant={theme.inputStyle}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: `${theme.borderRadius}px`,
                  },
                }}
              />
            </Box>

            <Box>
              <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                Message
              </FormLabel>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter your message"
                variant={theme.inputStyle}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: `${theme.borderRadius}px`,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
              <Button
                variant={theme.buttonStyle}
                sx={{
                  bgcolor: theme.buttonStyle === 'filled' ? theme.primaryColor : 'transparent',
                  color: theme.buttonStyle === 'filled' ? 'white' : theme.primaryColor,
                  borderColor: theme.primaryColor,
                  borderRadius: `${theme.borderRadius}px`,
                  '&:hover': {
                    bgcolor: theme.buttonStyle === 'filled' ? theme.secondaryColor : 'transparent',
                    borderColor: theme.secondaryColor,
                  },
                }}
              >
                Back
              </Button>
              <Button
                variant={theme.buttonStyle}
                sx={{
                  bgcolor: theme.buttonStyle === 'filled' ? theme.primaryColor : 'transparent',
                  color: theme.buttonStyle === 'filled' ? 'white' : theme.primaryColor,
                  borderColor: theme.primaryColor,
                  borderRadius: `${theme.borderRadius}px`,
                  flex: 1,
                  '&:hover': {
                    bgcolor: theme.buttonStyle === 'filled' ? theme.secondaryColor : 'transparent',
                    borderColor: theme.secondaryColor,
                  },
                }}
              >
                Submit Form
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
