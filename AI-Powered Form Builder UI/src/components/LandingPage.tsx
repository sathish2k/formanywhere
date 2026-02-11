import { Box, Container, Typography, Button, Stack, Paper, AppBar as MuiAppBar, Toolbar, Avatar, Divider, Chip, useTheme, Accordion, AccordionSummary, AccordionDetails, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { Sparkles, Check, Zap, Shield, Wand2, ArrowRight, PlayCircle, TrendingUp, Users, FileText, Star, Code, Database, Workflow, BarChart3, Globe, Lightbulb, Building2, Rocket, Settings, Palette, MessageSquare, Lock, ChevronDown, DollarSign, Award, Menu as MenuIcon } from 'lucide-react';
import { ThemeCustomizer } from './ThemeCustomizer';
import { LandingPageTestimonials } from './LandingPageExtras';
import { useState, useEffect } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onPricing?: () => void;
  onAbout?: () => void;
  onTemplates?: () => void;
  onUpdateTheme?: (primary: string, secondary: string) => void;
  currentPrimaryColor?: string;
  currentSecondaryColor?: string;
}

export function LandingPage({ onGetStarted, onPricing, onAbout, onTemplates, onUpdateTheme, currentPrimaryColor = '#FF3B30', currentSecondaryColor = '#1A1A1A' }: LandingPageProps) {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [enableTransitions, setEnableTransitions] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Enable transitions after initial mount to prevent initial animation
    const timer = setTimeout(() => {
      setEnableTransitions(true);
    }, 100);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      {/* Header */}
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
                    onClick={scrollToFeatures}
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
                {onUpdateTheme && !scrolled && (
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <ThemeCustomizer 
                      onUpdateTheme={onUpdateTheme} 
                      currentPrimary={currentPrimaryColor}
                      currentSecondary={currentSecondaryColor}
                    />
                  </Box>
                )}
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
              </Stack>
            </Toolbar>
          </Container>
        </Box>
      </MuiAppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: 'white',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Logo in Drawer */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 0.5,
                bgcolor: '#1A1A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} color="white" strokeWidth={2.5} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#1A1A1A',
                fontWeight: 600,
                fontSize: '1.125rem',
              }}
            >
              FormBuilder AI
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Navigation Links */}
          <List sx={{ px: 0 }}>
            <ListItem disablePadding>
              <ListItemButton 
                sx={{ 
                  borderRadius: 1.5, 
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
                onClick={() => {
                  setDrawerOpen(false);
                  scrollToFeatures();
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Star size={20} color="#637381" />
                </ListItemIcon>
                <ListItemText 
                  primary="Features" 
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    fontWeight: 500,
                    color: '#212B36' 
                  }} 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton 
                sx={{ 
                  borderRadius: 1.5, 
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
                onClick={() => {
                  setDrawerOpen(false);
                  onTemplates?.();
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <FileText size={20} color="#637381" />
                </ListItemIcon>
                <ListItemText 
                  primary="Templates" 
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    fontWeight: 500,
                    color: '#212B36' 
                  }} 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton 
                sx={{ 
                  borderRadius: 1.5, 
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <FileText size={20} color="#637381" />
                </ListItemIcon>
                <ListItemText 
                  primary="Blog" 
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    fontWeight: 500,
                    color: '#212B36' 
                  }} 
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton 
                sx={{ 
                  borderRadius: 1.5, 
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
                onClick={() => {
                  setDrawerOpen(false);
                  onPricing?.();
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DollarSign size={20} color="#637381" />
                </ListItemIcon>
                <ListItemText 
                  primary="Pricing" 
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    fontWeight: 500,
                    color: '#212B36' 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 6, alignItems: 'center' }}>
          <Box>
            <Chip
              label="AI-POWERED AUTOMATION"
              sx={{
                mb: 3,
                bgcolor: 'rgba(229, 115, 115, 0.1)',
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                fontWeight: 800,
                color: 'text.primary',
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              Build Powerful Forms & Workflows
              <Box 
                component="span" 
                sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {' '}in Minutes
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              Enterprise-grade form builder with AI assistance, multi-step workflows, conditional logic, and seamless integrations. Deploy anywhere, collect data securely.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={onGetStarted}
                startIcon={<PlayCircle size={20} />}
                sx={{
                  py: 1.75,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Watch a demo
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={onGetStarted}
                sx={{
                  py: 1.75,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderWidth: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': { borderWidth: 2 }
                }}
              >
                Get started for free
              </Button>
            </Stack>
          </Box>
          <Box>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 24px 48px -8px rgba(145, 158, 171, 0.24)',
                background: 'white',
                border: '1px solid rgba(145, 158, 171, 0.16)',
              }}
            >
              {/* Mock Form Builder Interface */}
              <Box sx={{ bgcolor: '#F4F6F8', borderRadius: 2, p: 3, mb: 2 }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF5630' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FFAB00' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#36B37E' }} />
                  </Stack>
                  <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '2px dashed', borderColor: 'primary.main' }}>
                    <Typography variant="body2" sx={{ color: '#637381', mb: 1 }}>
                      Full Name *
                    </Typography>
                    <Box sx={{ bgcolor: '#F9FAFB', height: 40, borderRadius: 1, border: '1px solid #DFE3E8' }} />
                  </Box>
                  <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#637381', mb: 1 }}>
                      Email Address *
                    </Typography>
                    <Box sx={{ bgcolor: '#F9FAFB', height: 40, borderRadius: 1, border: '1px solid #DFE3E8' }} />
                  </Box>
                  <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#637381', mb: 1 }}>
                      Phone Number
                    </Typography>
                    <Box sx={{ bgcolor: '#F9FAFB', height: 40, borderRadius: 1, border: '1px solid #DFE3E8' }} />
                  </Box>
                </Stack>
              </Box>
              <Stack direction="row" spacing={1.5} justifyContent="center">
                <Chip label="Drag & Drop" size="small" sx={{ bgcolor: (theme) => `${theme.palette.primary.main}20`, color: 'primary.main', fontWeight: 600 }} />
                <Chip label="AI Powered" size="small" sx={{ bgcolor: (theme) => `${theme.palette.primary.main}20`, color: 'primary.main', fontWeight: 600 }} />
                <Chip label="Multi-Step" size="small" sx={{ bgcolor: 'info.lighter', color: 'info.main', fontWeight: 600 }} />
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Interactive Demo Teaser */}
      <Box sx={{ bgcolor: 'white', py: 6, borderY: '1px solid rgba(145, 158, 171, 0.16)' }}>
        <Container maxWidth="xl">
          <Box 
            sx={{ 
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: '#F4F6F8',
              p: 6,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 4,
              cursor: 'pointer',
              border: '2px solid rgba(145, 158, 171, 0.12)',
            }}
          >
            {/* Left Content */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Chip
                label="WATCH DEMO"
                icon={<PlayCircle size={16} />}
                sx={{
                  mb: 2,
                  bgcolor: (theme) => `${theme.palette.primary.main}20`,
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
              <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 800, mb: 2 }}>
                See FormBuilder AI in Action
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.8 }}>
                Watch how you can build a complete multi-step form with AI assistance in under 60 seconds
              </Typography>
              <Stack direction="row" spacing={3} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Check size={20} color={theme.palette.primary.main} strokeWidth={2.5} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    No signup required
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Check size={20} color={theme.palette.primary.main} strokeWidth={2.5} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    60 seconds
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Right Demo Preview */}
            <Box 
              sx={{ 
                position: 'relative',
                width: { xs: '100%', md: 400 },
                height: 240,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.24)',
                bgcolor: 'white',
              }}
            >
              {/* Mock Video Thumbnail */}
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '100%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* Form Preview in Background */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    right: 20,
                    bottom: 20,
                    bgcolor: 'white',
                    borderRadius: 1.5,
                    p: 2,
                    opacity: 0.6,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Box sx={{ height: 8, bgcolor: '#DFE3E8', borderRadius: 1, width: '60%' }} />
                    <Box sx={{ height: 24, bgcolor: '#F9FAFB', borderRadius: 1, border: '1px solid #DFE3E8' }} />
                    <Box sx={{ height: 8, bgcolor: '#DFE3E8', borderRadius: 1, width: '50%' }} />
                    <Box sx={{ height: 24, bgcolor: '#F9FAFB', borderRadius: 1, border: '1px solid #DFE3E8' }} />
                    <Box sx={{ height: 8, bgcolor: '#DFE3E8', borderRadius: 1, width: '70%' }} />
                    <Box sx={{ height: 24, bgcolor: '#F9FAFB', borderRadius: 1, border: '1px solid #DFE3E8' }} />
                  </Stack>
                </Box>

                {/* Play Button Overlay */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.4)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: theme.palette.primary.main,
                      '& svg': {
                        color: 'white',
                      }
                    }
                  }}
                >
                  <PlayCircle size={40} color={theme.palette.primary.main} strokeWidth={2} fill={theme.palette.primary.main} />
                </Box>
              </Box>

              {/* Duration Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  bgcolor: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                0:60
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          {[
            { value: '10M+', label: 'Forms Created', icon: FileText },
            { value: '500K+', label: 'Active Users', icon: Users },
            { value: '99.9%', label: 'Uptime SLA', icon: Zap },
            { value: '150+', label: 'Countries', icon: Globe },
          ].map((stat, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  bgcolor: (theme) => `${theme.palette.primary.main}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <stat.icon size={32} color={theme.palette.primary.main} strokeWidth={2} />
              </Box>
              <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Features Section */}
      <Box id="features" sx={{ bgcolor: 'white', py: 12 }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="FEATURES"
              sx={{
                mb: 2,
                bgcolor: (theme) => `${theme.palette.primary.main}20`,
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
            <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800, mb: 2 }}>
              Everything You Need to Build Forms
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
              Powerful features designed for enterprises, simple enough for everyone
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Form Generation',
                desc: 'Describe your requirements in plain English and let AI build your form instantly. Save hours of manual work.',
                color: theme.palette.primary.main,
              },
              {
                icon: Workflow,
                title: 'Multi-Step Workflows',
                desc: 'Create complex multi-step forms with branching logic, conditional fields, and dynamic validation rules.',
                color: '#00B8D9',
              },
              {
                icon: Wand2,
                title: 'Visual Drag & Drop Builder',
                desc: 'Intuitive no-code builder with unlimited nesting, custom layouts, and real-time preview.',
                color: theme.palette.primary.main,
              },
              {
                icon: Database,
                title: 'Secure Data Collection',
                desc: 'Enterprise-grade security with encryption at rest and in transit. GDPR, HIPAA, and SOC 2 compliant.',
                color: '#22C55E',
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                desc: 'Real-time dashboards, conversion tracking, funnel analysis, and custom reports for data-driven decisions.',
                color: '#FFAB00',
              },
              {
                icon: Code,
                title: 'Developer-Friendly APIs',
                desc: 'RESTful APIs, webhooks, SDKs, and extensive documentation for custom integrations.',
                color: '#FF5630',
              },
            ].map((feature, index) => (
              <Paper
                key={index}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid rgba(145, 158, 171, 0.16)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 24px 48px -8px rgba(145, 158, 171, 0.24)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: `${feature.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <feature.icon size={28} color={feature.color} strokeWidth={2} />
                </Box>
                <Typography variant="h6" sx={{ color: '#212B36', fontWeight: 700, mb: 1.5 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#637381', lineHeight: 1.8 }}>
                  {feature.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* How It Works */}
      <Container maxWidth="xl" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Chip
            label="HOW IT WORKS"
            sx={{
              mb: 2,
              bgcolor: (theme) => `${theme.palette.primary.main}20`,
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          />
          <Typography variant="h2" sx={{ color: '#212B36', fontWeight: 800, mb: 2 }}>
            Get Started in 3 Simple Steps
          </Typography>
          <Typography variant="h6" sx={{ color: '#637381', fontWeight: 400 }}>
            From idea to deployed form in minutes
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {[
            {
              step: '01',
              title: 'Design Your Form',
              desc: 'Use our AI assistant or drag-and-drop builder to create your perfect form. Choose from templates or start from scratch.',
              icon: Palette,
              items: ['AI-powered generation', 'Pre-built templates', 'Custom branding'],
            },
            {
              step: '02',
              title: 'Configure & Customize',
              desc: 'Add logic, validations, integrations, and styling. Set up multi-step workflows with conditional branching.',
              icon: Settings,
              items: ['Conditional logic', 'Field validations', 'Third-party integrations'],
            },
            {
              step: '03',
              title: 'Deploy & Collect',
              desc: 'Share via link, embed on your website, or integrate with your app. Start collecting responses immediately.',
              icon: Rocket,
              items: ['Multiple deployment options', 'Real-time responses', 'Automated workflows'],
            },
          ].map((step, index) => (
            <Paper
              key={index}
              sx={{
                p: 5,
                height: '100%',
                background: index === 1 ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` : 'white',
                color: index === 1 ? 'white' : '#212B36',
                borderRadius: 3,
                border: index === 1 ? 'none' : '1px solid rgba(145, 158, 171, 0.16)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: index === 1 ? 'rgba(255, 255, 255, 0.5)' : '#919EAB',
                  fontWeight: 800,
                  fontSize: '3rem',
                  mb: 2,
                }}
              >
                {step.step}
              </Typography>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  bgcolor: index === 1 ? 'rgba(255, 255, 255, 0.2)' : (theme) => `${theme.palette.primary.main}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <step.icon size={24} color={index === 1 ? 'white' : theme.palette.primary.main} strokeWidth={2} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {step.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: index === 1 ? 'rgba(255, 255, 255, 0.9)' : '#637381', 
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                {step.desc}
              </Typography>
              <Stack spacing={1.5}>
                {step.items.map((item, i) => (
                  <Stack key={i} direction="row" spacing={1} alignItems="center">
                    <Check size={18} color={index === 1 ? 'white' : theme.palette.primary.main} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: index === 1 ? 'rgba(255, 255, 255, 0.9)' : '#637381',
                        fontWeight: 500,
                      }}
                    >
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Use Cases */}
      <Box sx={{ bgcolor: 'white', py: 12 }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="USE CASES"
              sx={{
                mb: 2,
                bgcolor: (theme) => `${theme.palette.primary.main}20`,
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
            <Typography variant="h2" sx={{ color: '#212B36', fontWeight: 800, mb: 2 }}>
              Built for Every Industry
            </Typography>
            <Typography variant="h6" sx={{ color: '#637381', fontWeight: 400 }}>
              Trusted solutions for diverse business needs
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {[
              { icon: Building2, title: 'Enterprise', desc: 'Employee onboarding, internal surveys, compliance forms', color: theme.palette.primary.main },
              { icon: Users, title: 'Healthcare', desc: 'Patient intake, appointment scheduling, health assessments', color: '#00B8D9' },
              { icon: TrendingUp, title: 'Marketing', desc: 'Lead generation, customer feedback, event registration', color: '#22C55E' },
              { icon: FileText, title: 'Education', desc: 'Student applications, course enrollment, assessments', color: '#FFAB00' },
              { icon: Globe, title: 'Government', desc: 'Public services, citizen feedback, permit applications', color: theme.palette.primary.main },
              { icon: Lightbulb, title: 'Non-Profit', desc: 'Volunteer registration, donation forms, grant applications', color: '#FF5630' },
            ].map((useCase, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid rgba(145, 158, 171, 0.16)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: useCase.color,
                    boxShadow: `0px 0px 0px 2px ${useCase.color}20`,
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      bgcolor: `${useCase.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <useCase.icon size={20} color={useCase.color} strokeWidth={2} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#212B36', fontWeight: 700, mb: 0.5 }}>
                      {useCase.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#637381', lineHeight: 1.6 }}>
                      {useCase.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Integrations Section - Top Tools Only */}
      <Container maxWidth="xl" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            label="INTEGRATIONS"
            sx={{
              mb: 2,
              bgcolor: (theme) => `${theme.palette.primary.main}20`,
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          />
          <Typography variant="h2" sx={{ color: '#212B36', fontWeight: 800, mb: 2 }}>
            Connect With Your Favorite Tools
          </Typography>
          <Typography variant="h6" sx={{ color: '#637381', fontWeight: 400 }}>
            Seamless integrations with industry-leading platforms
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 6 }}>
          {[
            { 
              name: 'Slack', 
              desc: 'Team Communication',
              bgcolor: '#4A154B',
              logo: '⚡'
            },
            { 
              name: 'Google Workspace', 
              desc: 'Productivity Suite',
              bgcolor: '#4285F4',
              logo: 'G'
            },
            { 
              name: 'Salesforce', 
              desc: 'CRM Platform',
              bgcolor: '#00A1E0',
              logo: '☁️'
            },
            { 
              name: 'Microsoft Teams', 
              desc: 'Collaboration Hub',
              bgcolor: '#5B5FC7',
              logo: 'T'
            },
            { 
              name: 'Stripe', 
              desc: 'Payment Processing',
              bgcolor: '#635BFF',
              logo: 'S'
            },
            { 
              name: 'HubSpot', 
              desc: 'Marketing Automation',
              bgcolor: '#FF7A59',
              logo: 'H'
            },
            { 
              name: 'Zapier', 
              desc: 'Workflow Automation',
              bgcolor: '#FF4F00',
              logo: '⚙️'
            },
            { 
              name: 'Notion', 
              desc: 'Workspace',
              bgcolor: '#000000',
              logo: 'N'
            },
          ].map((integration, index) => (
            <Paper
              key={index}
              sx={{
                p: 4,
                height: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                borderRadius: 3,
                border: '2px solid rgba(145, 158, 171, 0.12)',
                bgcolor: 'white',
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: integration.bgcolor,
                  transform: 'translateY(-8px)',
                  boxShadow: `0px 0px 0px 4px ${integration.bgcolor}20, 0px 24px 48px -8px rgba(145, 158, 171, 0.24)`,
                  '& .integration-badge': {
                    bgcolor: integration.bgcolor,
                    transform: 'scale(1.1)',
                  },
                  '& .integration-logo': {
                    color: 'white',
                  }
                },
              }}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: `${integration.bgcolor}08`,
                  transition: 'all 0.3s',
                }}
              />

              {/* Logo Badge */}
              <Box
                className="integration-badge"
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  bgcolor: `${integration.bgcolor}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  position: 'relative',
                  zIndex: 1,
                  transition: 'all 0.3s',
                }}
              >
                <Typography 
                  className="integration-logo"
                  sx={{ 
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: integration.bgcolor,
                    transition: 'all 0.3s',
                  }}
                >
                  {integration.logo}
                </Typography>
              </Box>

              {/* Name */}
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#212B36', 
                  fontWeight: 700,
                  mb: 0.5,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {integration.name}
              </Typography>

              {/* Description */}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#637381',
                  fontWeight: 500,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {integration.desc}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#637381', mb: 3 }}>
            Plus 100+ more integrations including Airtable, Mailchimp, PayPal, Zoom, and many others
          </Typography>
          <Button
            variant="outlined"
            endIcon={<ArrowRight size={18} />}
            sx={{
              borderWidth: 2,
              borderColor: 'rgba(145, 158, 171, 0.32)',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              '&:hover': { borderWidth: 2 }
            }}
          >
            View All Integrations
          </Button>
        </Box>
      </Container>

      {/* Testimonials Section */}
      <LandingPageTestimonials />

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          py: 10,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>
              Ready to Transform Your Forms?
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 400, mb: 5 }}>
              Join 10,000+ companies building better forms with AI. Start your free trial today.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowRight />}
                onClick={onGetStarted}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 700,
                  py: 2,
                  px: 5,
                  fontSize: '1.125rem',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                  },
                }}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<MessageSquare />}
                sx={{
                  borderWidth: 2,
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 700,
                  py: 2,
                  px: 5,
                  fontSize: '1.125rem',
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Contact Sales
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#212B36', py: 10 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 6, mb: 6 }}>
            <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={18} color="white" strokeWidth={2.5} />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  FormBuilder AI
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.8, mb: 3 }}>
                Enterprise-grade form builder with AI assistance. Build powerful forms and workflows in minutes.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}>
                  <Typography sx={{ color: 'white' }}>𝕏</Typography>
                </Box>
                <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}>
                  <Typography sx={{ color: 'white' }}>in</Typography>
                </Box>
                <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}>
                  <Typography sx={{ color: 'white' }}>f</Typography>
                </Box>
              </Stack>
            </Box>
            
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Templates', 'Integrations', 'API Docs'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Press Kit', 'Contact'] },
              { title: 'Resources', links: ['Documentation', 'Help Center', 'Blog', 'Community'] },
            ].map((column, index) => (
              <Box key={index}>
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2.5 }}>
                  {column.title}
                </Typography>
                <Stack spacing={1.5}>
                  {column.links.map((link, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {link}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              © 2025 FormBuilder AI. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              {['Privacy Policy', 'Terms of Service', 'Security'].map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}