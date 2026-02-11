/**
 * Header Component
 * Pill-style sticky navbar with scroll animation
 */

'use client';

import { useThemeCustomization } from '@/shared/theme';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bell, LogOut, Menu as MenuIcon, Settings, Sparkles, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeCustomizer } from '../theme-customizer/ThemeCustomizer';
import { MobileDrawer } from './MobileDrawer';

interface NavLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface HeaderProps {
  navLinks?: NavLink[];
  showAuth?: boolean;
  signInLabel?: string;
  getStartedLabel?: string;
}

export function Header({
  navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Templates', href: '/templates' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Blog' },
  ],
  showAuth = true,
  signInLabel = 'Sign in',
  getStartedLabel = 'Try for Free',
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [enableTransitions, setEnableTransitions] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Use theme customization context for dynamic theme updates
  const { primaryColor, secondaryColor, updateTheme } = useThemeCustomization();

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

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileClose();
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleDashboard = () => {
    handleProfileClose();
    router.push('/dashboard');
  };

  const isAuthenticated = status === 'authenticated' && session?.user;
  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || '';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <StyledAppBar position="fixed" elevation={0}>
        <AppBarInner scrolled={scrolled} enableTransitions={enableTransitions}>
          <StyledContainer scrolled={scrolled} enableTransitions={enableTransitions}>
            <StyledToolbar scrolled={scrolled} enableTransitions={enableTransitions}>
              {/* Mobile Menu Button */}
              <MobileMenuButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon size={24} />
              </MobileMenuButton>

              {/* Logo */}
              <Link href="/" style={{ textDecoration: 'none' }}>
                <LogoContainer scrolled={scrolled}>
                  <LogoIcon>
                    <Sparkles size={18} color="white" strokeWidth={2.5} />
                  </LogoIcon>
                  <LogoText scrolled={scrolled}>FormBuilder AI</LogoText>
                </LogoContainer>
              </Link>

              {/* Center Navigation */}
              <NavContainer scrolled={scrolled} enableTransitions={enableTransitions}>
                <NavStack scrolled={scrolled}>
                  {navLinks.map((link) =>
                    link.href ? (
                      <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                        <NavButton scrolled={scrolled}>{link.label}</NavButton>
                      </Link>
                    ) : (
                      <NavButton key={link.label} onClick={link.onClick} scrolled={scrolled}>
                        {link.label}
                      </NavButton>
                    )
                  )}
                </NavStack>
              </NavContainer>

              {/* Right Actions */}
              {showAuth && (
                <ActionsStack scrolled={scrolled}>
                  {isAuthenticated ? (
                    <>
                      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <SignInButton scrolled={scrolled}>Dashboard</SignInButton>
                      </Link>
                      <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                        <StyledAvatar scrolled={scrolled}>{userInitials}</StyledAvatar>
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Link href="/signin" style={{ textDecoration: 'none' }}>
                        <SignInButton scrolled={scrolled}>{signInLabel}</SignInButton>
                      </Link>
                      <Link href="/signup" style={{ textDecoration: 'none' }}>
                        <GetStartedButton scrolled={scrolled}>{getStartedLabel}</GetStartedButton>
                      </Link>
                    </>
                  )}
                  <ThemeCustomizer
                    onUpdateTheme={updateTheme}
                    currentPrimary={primaryColor}
                    currentSecondary={secondaryColor}
                  />
                </ActionsStack>
              )}
            </StyledToolbar>
          </StyledContainer>
        </AppBarInner>
      </StyledAppBar>

      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              boxShadow:
                '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {userName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {userEmail}
          </Typography>
        </Box>
        <MenuItem onClick={handleDashboard} sx={{ py: 1.5, gap: 1.5 }}>
          <User size={18} />
          <Typography variant="body2">Dashboard</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileClose} sx={{ py: 1.5, gap: 1.5 }}>
          <Bell size={18} />
          <Typography variant="body2">Notifications</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileClose} sx={{ py: 1.5, gap: 1.5 }}>
          <Settings size={18} />
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, gap: 1.5, color: 'error.main' }}>
          <LogOut size={18} />
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Spacer for fixed AppBar */}
      <Toolbar sx={{ minHeight: { xs: 64, md: 64 } }} />

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} navLinks={navLinks} />
    </>
  );
}

// Styled Components
const StyledAppBar = styled(MuiAppBar)({
  backgroundColor: 'transparent',
  borderBottom: 'none',
  backdropFilter: 'none',
  boxShadow: 'none',
  transition: 'all 0.3s',
  top: 0,
  zIndex: 1100,
});

const AppBarInner = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'scrolled' && prop !== 'enableTransitions',
})<{ scrolled: boolean; enableTransitions: boolean }>(({ scrolled, enableTransitions }) => ({
  width: '100%',
  transition: enableTransitions ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: scrolled ? 24 : 0,
  paddingRight: scrolled ? 24 : 0,
  paddingTop: scrolled ? 16 : 0,
  backgroundColor: scrolled ? 'transparent' : 'rgba(255, 255, 255, 0.98)',
  borderBottom: scrolled ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
  '@media (max-width: 900px)': {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
}));

const StyledContainer = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'scrolled' && prop !== 'enableTransitions',
})<{ scrolled: boolean; enableTransitions: boolean }>(({ scrolled, enableTransitions }) => ({
  transition: enableTransitions ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
  width: scrolled ? 'auto' : '100%',
  paddingLeft: scrolled ? 0 : 24,
  paddingRight: scrolled ? 0 : 24,
  maxWidth: scrolled ? 'fit-content !important' : undefined,
  '@media (max-width: 900px)': {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },
}));

const StyledToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'scrolled' && prop !== 'enableTransitions',
})<{ scrolled: boolean; enableTransitions: boolean }>(({ scrolled, enableTransitions, theme }) => ({
  paddingTop: scrolled ? 8 : 12,
  paddingBottom: scrolled ? 8 : 12,
  paddingLeft: scrolled ? 32 : 0,
  paddingRight: scrolled ? 32 : 0,
  minHeight: scrolled ? 56 : 64,
  transition: enableTransitions ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
  backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
  borderBottom: 'none',
  borderRadius: scrolled ? 100 : 0,
  boxShadow: scrolled
    ? '0px 8px 32px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.08)'
    : 'none',
  backdropFilter: scrolled ? 'blur(20px)' : 'none',
  border: scrolled ? '1px solid rgba(255, 255, 255, 0.4)' : 'none',
  width: '100%',
  '@media (max-width: 900px)': {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: 64,
    backgroundColor: 'transparent',
    borderBottom: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    backdropFilter: 'none',
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  display: 'none',
  marginRight: theme.spacing(2),
  color: theme.palette.grey[900],
  '@media (max-width: 900px)': {
    display: 'inline-flex',
  },
}));

const LogoContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})<{ scrolled: boolean }>(({ scrolled, theme }) => ({
  display: scrolled ? 'none' : 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  opacity: scrolled ? 0 : 1,
  transition: 'none',
  '@media (max-width: 900px)': {
    display: 'flex',
    opacity: 1,
  },
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: theme.spacing(0.5),
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const LogoText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})<{ scrolled: boolean }>(({ theme }) => ({
  color: theme.palette.grey[900],
  fontWeight: 600,
  fontSize: '1rem',
  '@media (max-width: 600px)': {
    display: 'none',
  },
}));

const NavContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'scrolled' && prop !== 'enableTransitions',
})<{ scrolled: boolean; enableTransitions: boolean }>(({ scrolled }) => ({
  flex: scrolled ? 'none' : 1,
  display: 'flex',
  justifyContent: scrolled ? 'flex-start' : 'center',
  '@media (max-width: 900px)': {
    flex: 1,
    justifyContent: 'flex-end',
  },
}));

const NavStack = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})<{ scrolled: boolean }>(({ scrolled, theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: scrolled ? theme.spacing(3) : theme.spacing(4),
  '@media (max-width: 900px)': {
    display: 'none',
  },
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})<{ scrolled: boolean }>(({ scrolled, theme }) => ({
  color: theme.palette.grey[600],
  fontWeight: 500,
  fontSize: scrolled ? '0.875rem' : '0.9375rem',
  textTransform: 'none',
  padding: 0,
  minWidth: 'auto',
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.grey[800],
  },
}));

const ActionsStack = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})<{ scrolled: boolean }>(({ scrolled, theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: scrolled ? theme.spacing(1.5) : theme.spacing(2),
  transition: 'all 0.3s',
}));

const SignInButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})<{ scrolled: boolean }>(({ scrolled, theme }) => ({
  color: theme.palette.grey[600],
  fontWeight: 500,
  fontSize: scrolled ? '0.875rem' : '0.9375rem',
  textTransform: 'none',
  padding: 0,
  minWidth: 'auto',
  transition: 'all 0.3s',
  display: scrolled ? 'none' : 'inline-flex',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.grey[800],
  },
  '@media (max-width: 900px)': {
    display: 'none',
  },
}));

const GetStartedButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})<{ scrolled: boolean }>(({ scrolled, theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  fontWeight: 500,
  fontSize: scrolled ? '0.875rem' : '0.9375rem',
  textTransform: 'none',
  paddingLeft: scrolled ? theme.spacing(2.5) : theme.spacing(3),
  paddingRight: scrolled ? theme.spacing(2.5) : theme.spacing(3),
  paddingTop: scrolled ? theme.spacing(0.75) : theme.spacing(1),
  paddingBottom: scrolled ? theme.spacing(0.75) : theme.spacing(1),
  borderRadius: scrolled ? 100 : theme.spacing(1.5),
  boxShadow: 'none',
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
    boxShadow: 'none',
  },
}));

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})<{ scrolled: boolean }>(({ scrolled, theme }) => ({
  width: scrolled ? 28 : 32,
  height: scrolled ? 28 : 32,
  backgroundColor: theme.palette.primary.main,
  cursor: 'pointer',
  fontSize: scrolled ? '0.75rem' : '0.875rem',
  transition: 'all 0.3s',
  '@media (max-width: 900px)': {
    display: 'none',
  },
}));
