/**
 * Dashboard AppBar Component
 * Top navigation for dashboard with profile menu
 */

'use client';

import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Bell,
  FileText,
  HelpCircle,
  LogOut,
  Menu as MenuIcon,
  Settings,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DashboardAppBarProps {
  userName?: string;
  userEmail?: string;
}

export function DashboardAppBar({
  userName = 'User',
  userEmail = 'user@example.com',
}: DashboardAppBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

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

  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <StyledAppBar position="static" elevation={0}>
        <Container maxWidth="xl">
          <AppBarContent>
            <LeftSection>
              {isMobile && (
                <IconButton
                  edge="start"
                  onClick={toggleDrawer(true)}
                  sx={{ color: 'text.primary' }}
                >
                  <MenuIcon size={24} />
                </IconButton>
              )}
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <LogoBox>
                  <LogoIcon>
                    <Sparkles size={18} color="white" strokeWidth={2.5} />
                  </LogoIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: '#1A1A1A', fontWeight: 600, fontSize: '1rem' }}
                  >
                    FormBuilder AI
                  </Typography>
                </LogoBox>
              </Link>
            </LeftSection>

            {!isMobile && (
              <RightSection>
                <Link href="/templates" style={{ textDecoration: 'none' }}>
                  <NavButton variant="outlined" color="secondary">
                    Templates
                  </NavButton>
                </Link>
                <NavButton variant="outlined" color="secondary">
                  Help
                </NavButton>
                <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                  <StyledAvatar>{userInitials}</StyledAvatar>
                </IconButton>
              </RightSection>
            )}
          </AppBarContent>
        </Container>
      </StyledAppBar>

      {/* Profile Dropdown */}
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
        <MenuItem
          onClick={() => {
            handleProfileClose();
            router.push('/profile');
          }}
          sx={{ py: 1.5, gap: 1.5 }}
        >
          <User size={18} />
          <Typography variant="body2">Profile Settings</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileClose} sx={{ py: 1.5, gap: 1.5 }}>
          <Bell size={18} />
          <Typography variant="body2">Notifications</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileClose();
            router.push('/profile');
          }}
          sx={{ py: 1.5, gap: 1.5 }}
        >
          <Settings size={18} />
          <Typography variant="body2">Account Settings</Typography>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, gap: 1.5, color: 'error.main' }}>
          <LogOut size={18} />
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <DrawerContent>
          <DrawerHeader>
            <LogoBox>
              <LogoIcon>
                <Sparkles size={18} color="white" strokeWidth={2.5} />
              </LogoIcon>
              <Typography variant="h6" sx={{ color: '#1A1A1A', fontWeight: 600, fontSize: '1rem' }}>
                FormBuilder AI
              </Typography>
            </LogoBox>
            <IconButton onClick={toggleDrawer(false)} size="small">
              <X size={20} />
            </IconButton>
          </DrawerHeader>

          <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <StyledAvatar sx={{ width: 40, height: 40 }}>{userInitials}</StyledAvatar>
              <Box>
                <Typography variant="subtitle2">{userName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {userEmail}
                </Typography>
              </Box>
            </Box>
          </Box>

          <List sx={{ px: 1.5, py: 2 }}>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ borderRadius: 1.5, mb: 0.5 }}
                onClick={() => {
                  setDrawerOpen(false);
                  router.push('/templates');
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <FileText size={20} color={theme.palette.text.secondary} />
                </ListItemIcon>
                <ListItemText
                  primary="Templates"
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 1.5, mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <HelpCircle size={20} color={theme.palette.text.secondary} />
                </ListItemIcon>
                <ListItemText
                  primary="Help"
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </DrawerContent>
      </Drawer>
    </>
  );
}

// Styled Components
const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2, 0),
}));

const AppBarContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const LeftSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

const RightSection = styled(Box)({
  display: 'flex',
  gap: 16,
  alignItems: 'center',
});

const LogoBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: theme.spacing(0.5),
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const NavButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.secondary,
  borderColor: theme.palette.grey[300],
  '&:hover': {
    borderColor: theme.palette.secondary.main,
    backgroundColor: alpha(theme.palette.secondary.main, 0.04),
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: theme.palette.primary.main,
  cursor: 'pointer',
  fontSize: '0.875rem',
}));

const DrawerContent = styled(Box)({
  width: 280,
});

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
