import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  useTheme
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { AppBar } from './AppBar';

interface LayoutSelectionProps {
  onBack: () => void;
  onSelectLayout: (layout: 'classic' | 'card') => void;
}

export function LayoutSelection({ onBack, onSelectLayout }: LayoutSelectionProps) {
  const theme = useTheme();
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar />
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, minHeight: 'calc(100vh - 64px)' }}>
        <Container maxWidth="lg">
          {/* Back Button */}
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={onBack}
            sx={{
              color: 'text.secondary',
              mb: 4,
              '&:hover': {
                bgcolor: 'grey.100',
              }
            }}
          >
            Back
          </Button>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ mb: 2, color: 'text.primary' }}>
              Choose Form Layout
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
              Select a layout according to the needs
            </Typography>
          </Box>

          {/* Layout Options */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, maxWidth: 1000, mx: 'auto' }}>
            {/* Classic Form */}
            <Paper
              onClick={() => onSelectLayout('classic')}
              sx={{
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: 1,
                borderColor: 'transparent',
                boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-8px)',
                  boxShadow: `0px 0px 2px 0px ${theme.palette.primary.main}40, 0px 24px 48px -4px ${theme.palette.primary.main}40`,
                }
              }}
            >
              {/* Preview */}
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  p: 5,
                  height: 340,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    width: '90%',
                    height: '95%',
                    bgcolor: 'white',
                    borderRadius: 2,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                  }}
                >
                  {/* Header lines */}
                  <Box>
                    <Box sx={{ width: '70%', height: 10, bgcolor: 'grey.200', borderRadius: 1, mb: 1.5 }} />
                    <Box sx={{ width: '50%', height: 8, bgcolor: 'grey.200', borderRadius: 1 }} />
                  </Box>

                  {/* Question 1 */}
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ width: '85%', height: 8, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ width: '65%', height: 8, bgcolor: 'grey.200', borderRadius: 1 }} />
                    </Box>
                  </Box>

                  {/* Question 2 */}
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ width: '85%', height: 8, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ width: '65%', height: 8, bgcolor: 'grey.200', borderRadius: 1 }} />
                    </Box>
                  </Box>

                  {/* Spacer */}
                  <Box sx={{ flex: 1 }} />

                  {/* Question 3 */}
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ width: '85%', height: 8, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ width: '65%', height: 8, bgcolor: 'grey.200', borderRadius: 1 }} />
                    </Box>
                  </Box>

                  {/* Question 4 */}
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ width: '85%', height: 8, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ width: '65%', height: 8, bgcolor: 'grey.200', borderRadius: 1 }} />
                    </Box>
                  </Box>

                  {/* Submit Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Box sx={{ width: 80, height: 28, bgcolor: 'primary.main', borderRadius: 1, boxShadow: 2 }} />
                  </Box>
                </Paper>
              </Box>

              {/* Label */}
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
                  Classic Form
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Show all questions as per pages
                </Typography>
              </Box>
            </Paper>

            {/* Card Form */}
            <Paper
              onClick={() => onSelectLayout('card')}
              sx={{
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: 1,
                borderColor: 'transparent',
                boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-8px)',
                  boxShadow: `0px 0px 2px 0px ${theme.palette.primary.main}40, 0px 24px 48px -4px ${theme.palette.primary.main}40`,
                }
              }}
            >
              {/* Preview */}
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  p: 5,
                  height: 340,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    width: '80%',
                    bgcolor: 'white',
                    borderRadius: 2,
                    p: 3,
                  }}
                >
                  {/* Question */}
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ width: '95%', height: 9, bgcolor: 'grey.200', borderRadius: 1, mb: 1.5 }} />
                      <Box sx={{ width: '75%', height: 9, bgcolor: 'grey.200', borderRadius: 1 }} />
                    </Box>
                  </Box>

                  {/* Answer area */}
                  <Box sx={{ pl: 3 }}>
                    <Box sx={{ width: '100%', height: 9, bgcolor: 'grey.200', borderRadius: 1, mb: 1.5 }} />
                    <Box sx={{ width: '90%', height: 9, bgcolor: 'grey.200', borderRadius: 1 }} />
                  </Box>
                </Paper>

                {/* Progress dots */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: 'white', boxShadow: 2 }} />
                  <Box sx={{ width: 48, height: 3, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }} />
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.5)' }} />
                  <Box sx={{ width: 48, height: 3, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }} />
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.5)' }} />
                </Box>
              </Box>

              {/* Label */}
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
                  Card Form
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Show single question per page
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}