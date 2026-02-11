import { Box, Container, Typography, Button, Stack, Toolbar, AppBar as MuiAppBar, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Sparkles, Menu as MenuIcon, Star, FileText, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeCustomizer } from './ThemeCustomizer';

interface SharedAppBarProps {
  onBackToHome?: () => void;
  onGetStarted?: () => void;
  onPricing?: () => void;
  onAbout?: () => void;
  onTemplates?: () => void;
  onFeatures?: () => void;
  onUpdateTheme?: (primary: string, secondary: string) => void;
  currentPrimaryColor?: string;
  currentSecondaryColor?: string;
  showThemeCustomizer?: boolean;
}

export function SharedAppBar({
  onBackToHome,
  onGetStarted,
  onPricing,
  onAbout,
  onTemplates,
  onFeatures,
  onUpdateTheme,
  currentPrimaryColor = '#FF3B30',
  currentSecondaryColor = '#1A1A1A',
  showThemeCustomizer = false,
}: SharedAppBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [enableTransitions, setEnableTransitions] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    setTimeout(() => {
      setEnableTransitions(true);
    }, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  return (
    <MuiAppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: 'transparent',
        borderBottom: 'none',
        backdropFilter: 'none',
        boxShadow: 'none',
        transition: 'all 0.3s',
        top: 0,
      }}
    >
      <Box
        sx={{
          width: '100%',
          transition: enableTransitions ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          display: 'flex',
          justifyContent: 'center',
          px: { xs: 0, md: scrolled ? 3 : 0 },
          pt: { xs: 0, md: scrolled ? 2 : 0 },
        }}
      >
        <Container 
          disableGutters={{ xs: true, md: !scrolled }}
          maxWidth={{ xs: 'xl', md: scrolled ? false : 'xl' }}
          sx={{
            transition: enableTransitions ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            width: { xs: '100%', md: scrolled ? 'auto' : '100%' },
            px: { xs: 2, sm: 3, md: scrolled ? 0 : 3 },
            ...({ md: scrolled && {
              maxWidth: 'fit-content !important',
            } })
          }}
        >
          <Toolbar 
            sx={{ 
              py: { xs: 1.5, md: scrolled ? 1 : 1.5 },
              px: { xs: 0, md: scrolled ? 4 : 0 },
              minHeight: { xs: '64px', md: scrolled ? '56px' : '64px' },
              transition: enableTransitions ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              bgcolor: { 
                xs: 'rgba(255, 255, 255, 0.98)', 
                md: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.98)' 
              },
              borderBottom: { 
                xs: '1px solid rgba(0, 0, 0, 0.08)', 
                md: scrolled ? 'none' : '1px solid rgba(0, 0, 0, 0.08)' 
              },
              borderRadius: { xs: 0, md: scrolled ? '100px' : 0 },
              boxShadow: { 
                xs: 'none', 
                md: scrolled ? '0px 8px 32px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.08)' : 'none' 
              },
              backdropFilter: { xs: 'none', md: scrolled ? 'blur(20px)' : 'none' },
              border: { xs: 'none', md: scrolled ? '1px solid rgba(255, 255, 255, 0.4)' : 'none' },
              width: '100%',
            }}
          >
            {/* Mobile Menu Button - Only visible on mobile */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                mr: 2,
                color: '#1A1A1A',
              }}
            >
              <MenuIcon size={24} />
            </IconButton>

            {/* Logo - Left (Always visible on mobile, hidden when scrolled on desktop) */}
            <Box 
              sx={{ 
                display: { xs: 'flex', md: scrolled ? 'none' : 'flex' },
                alignItems: 'center', 
                gap: 1.5,
                opacity: { xs: 1, md: scrolled ? 0 : 1 },
                transition: 'none',
                cursor: 'pointer',
              }}
              onClick={onBackToHome}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 0.5,
                  bgcolor: '#1A1A1A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} color="white" strokeWidth={2.5} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#1A1A1A',
                  fontWeight: 600,
                  fontSize: '1rem',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                FormBuilder AI
              </Typography>
            </Box>

            {/* Center Navigation */}
            <Box 
              sx={{ 
                flex: { xs: 1, md: scrolled ? 'none' : 1 },
                display: 'flex', 
                justifyContent: { xs: 'flex-end', md: scrolled ? 'flex-start' : 'center' },
                transition: enableTransitions ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              }}
            >
              <Stack 
                direction="row" 
                spacing={scrolled ? 3 : 4} 
                alignItems="center" 
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  transition: 'all 0.3s',
                }}
              >
                <Button 
                  variant="text" 
                  onClick={onFeatures}
                  sx={{ 
                    color: '#637381', 
                    fontWeight: 500,
                    fontSize: scrolled ? '0.875rem' : '0.9375rem',
                    textTransform: 'none',
                    px: 0,
                    minWidth: 'auto',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: '#212B36',
                    }
                  }}
                >
                  Features
                </Button>
                <Button 
                  variant="text" 
                  onClick={onTemplates}
                  sx={{ 
                    color: '#637381', 
                    fontWeight: 500,
                    fontSize: scrolled ? '0.875rem' : '0.9375rem',
                    textTransform: 'none',
                    px: 0,
                    minWidth: 'auto',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: '#212B36',
                    }
                  }}
                >
                  Templates
                </Button>
                <Button 
                  variant="text" 
                  sx={{ 
                    color: '#637381', 
                    fontWeight: 500,
                    fontSize: scrolled ? '0.875rem' : '0.9375rem',
                    textTransform: 'none',
                    px: 0,
                    minWidth: 'auto',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: '#212B36',
                    }
                  }}
                >
                  Blog
                </Button>
                {onPricing && (
                  <Button 
                    variant="text" 
                    onClick={onPricing}
                    sx={{ 
                      color: '#637381', 
                      fontWeight: 500,
                      fontSize: scrolled ? '0.875rem' : '0.9375rem',
                      textTransform: 'none',
                      px: 0,
                      minWidth: 'auto',
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: '#212B36',
                      }
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
                      color: '#637381', 
                      fontWeight: 500,
                      fontSize: scrolled ? '0.875rem' : '0.9375rem',
                      textTransform: 'none',
                      px: 0,
                      minWidth: 'auto',
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: '#212B36',
                      }
                    }}
                  >
                    About
                  </Button>
                )}
              </Stack>
            </Box>

            {/* Right Actions */}
            <Stack 
              direction="row" 
              spacing={scrolled ? 1.5 : 2} 
              alignItems="center"
              sx={{
                transition: 'all 0.3s',
              }}
            >
              {onUpdateTheme && showThemeCustomizer && !scrolled && (
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <ThemeCustomizer 
                    onUpdateTheme={onUpdateTheme} 
                    currentPrimary={currentPrimaryColor}
                    currentSecondary={currentSecondaryColor}
                  />
                </Box>
              )}
              {onGetStarted && (
                <>
                  <Button 
                    variant="text" 
                    onClick={onGetStarted} 
                    sx={{ 
                      color: '#637381',
                      fontWeight: 500,
                      fontSize: scrolled ? '0.875rem' : '0.9375rem',
                      textTransform: 'none',
                      px: 0,
                      minWidth: 'auto',
                      display: { xs: 'inline-flex', md: scrolled ? 'none' : 'inline-flex' },
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: '#212B36',
                      }
                    }}
                  >
                    Sign in
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={onGetStarted}
                    sx={{
                      bgcolor: '#1A1A1A',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: scrolled ? '0.875rem' : '0.9375rem',
                      textTransform: 'none',
                      px: scrolled ? 2.5 : 3,
                      py: scrolled ? 0.75 : 1,
                      borderRadius: scrolled ? '100px' : 1.5,
                      boxShadow: 'none',
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: '#000000',
                        boxShadow: 'none',
                      }
                    }}
                  >
                    Try for Free
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </Box>

      {/* Mobile Menu */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
          },
        }}
      >
        <Box
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 0.5,
                bgcolor: '#1A1A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} color="white" strokeWidth={2.5} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#1A1A1A',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              FormBuilder AI
            </Typography>
            <IconButton
              onClick={toggleDrawer(false)}
              sx={{
                color: '#637381',
                '&:hover': {
                  color: '#212B36',
                }
              }}
            >
              <MenuIcon size={24} />
            </IconButton>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  onFeatures?.();
                }}
                sx={{
                  color: '#637381',
                  '&:hover': {
                    color: '#212B36',
                  }
                }}
              >
                <ListItemIcon>
                  <Star size={20} />
                </ListItemIcon>
                <ListItemText primary="Features" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  onTemplates?.();
                }}
                sx={{
                  color: '#637381',
                  '&:hover': {
                    color: '#212B36',
                  }
                }}
              >
                <ListItemIcon>
                  <FileText size={20} />
                </ListItemIcon>
                <ListItemText primary="Templates" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  onPricing?.();
                }}
                sx={{
                  color: '#637381',
                  '&:hover': {
                    color: '#212B36',
                  }
                }}
              >
                <ListItemIcon>
                  <DollarSign size={20} />
                </ListItemIcon>
                <ListItemText primary="Pricing" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  onAbout?.();
                }}
                sx={{
                  color: '#637381',
                  '&:hover': {
                    color: '#212B36',
                  }
                }}
              >
                <ListItemIcon>
                  <Star size={20} />
                </ListItemIcon>
                <ListItemText primary="About" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <Box
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              px: 2,
              py: 1,
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            {onUpdateTheme && showThemeCustomizer && (
              <ThemeCustomizer 
                onUpdateTheme={onUpdateTheme} 
                currentPrimary={currentPrimaryColor}
                currentSecondary={currentSecondaryColor}
              />
            )}
            {onGetStarted && (
              <>
                <Button 
                  variant="text" 
                  onClick={onGetStarted} 
                  sx={{ 
                    color: '#637381',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    px: 0,
                    minWidth: 'auto',
                    display: 'inline-flex',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: '#212B36',
                    }
                  }}
                >
                  Sign in
                </Button>
                <Button 
                  variant="contained" 
                  onClick={onGetStarted}
                  sx={{
                    bgcolor: '#1A1A1A',
                    color: 'white',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    px: 2.5,
                    py: 0.75,
                    borderRadius: '100px',
                    boxShadow: 'none',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: '#000000',
                      boxShadow: 'none',
                    }
                  }}
                >
                  Try for Free
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </MuiAppBar>
  );
}