import { Box, Container, Typography, Button, Stack, Avatar, IconButton, Badge, alpha, useTheme } from '@mui/material';
import { Sparkles, Bell, Settings } from 'lucide-react';

interface AppBarProps {
  onBackToHome?: () => void;
  onPricing?: () => void;
  onAbout?: () => void;
  onGetStarted?: () => void;
}

export function AppBar({ onBackToHome, onPricing, onAbout, onGetStarted }: AppBarProps) {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: 2,
        boxShadow: '0 1px 3px rgba(145, 158, 171, 0.04)',
      }}
    >
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
            }} 
            onClick={onBackToHome}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: (theme) => `0px 8px 16px 0px ${alpha(theme.palette.primary.main, 0.24)}`,
              }}
            >
              <Sparkles size={20} color="white" strokeWidth={2.5} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800,
                fontSize: '1.125rem',
                letterSpacing: '-0.02em',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FormBuilder AI
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Navigation Links */}
            {onPricing && (
              <Button
                variant="text"
                onClick={onPricing}
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                  },
                }}
              >
                Pricing
              </Button>
            )}
            {onAbout && (
              <Button
                variant="text"
                onClick={onAbout}
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                  },
                }}
              >
                About
              </Button>
            )}
            
            {/* Notification Bell */}
            <IconButton 
              size="small"
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Badge 
                badgeContent={3} 
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: 'error.main',
                    color: 'white',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    minWidth: 18,
                    height: 18,
                  },
                }}
              >
                <Bell size={20} />
              </Badge>
            </IconButton>

            {/* Settings */}
            <IconButton 
              size="small"
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Settings size={20} />
            </IconButton>

            {/* User Avatar */}
            <Avatar 
              sx={{ 
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.24)}`,
                },
              }}
            >
              JD
            </Avatar>

            {/* CTA Button */}
            {onGetStarted && (
              <Button
                variant="contained"
                onClick={onGetStarted}
                sx={{
                  ml: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: (theme) => `0px 8px 16px 0px ${alpha(theme.palette.primary.main, 0.24)}`,
                  fontWeight: 700,
                  '&:hover': {
                    boxShadow: (theme) => `0px 8px 20px 0px ${alpha(theme.palette.primary.main, 0.32)}`,
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Get Started
              </Button>
            )}
            
            {/* Back to Home */}
            {onBackToHome && !onGetStarted && (
              <Button
                variant="outlined"
                onClick={onBackToHome}
                sx={{
                  borderColor: 'divider',
                  color: 'text.primary',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'text.secondary',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Dashboard
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}