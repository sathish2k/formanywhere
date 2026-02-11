/**
 * Mobile Navigation Drawer Component
 * Separate drawer for mobile navigation
 */

'use client';

import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DollarSign, FileText, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';

interface NavLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

export function MobileDrawer({ open, onClose, navLinks }: MobileDrawerProps) {
  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'features':
        return Star;
      case 'pricing':
        return DollarSign;
      default:
        return FileText;
    }
  };

  return (
    <StyledDrawer anchor="left" open={open} onClose={onClose}>
      <DrawerContent>
        <Link href="/" style={{ textDecoration: 'none' }} onClick={onClose}>
          <LogoContainer>
            <LogoIcon>
              <Sparkles size={20} color="white" strokeWidth={2.5} />
            </LogoIcon>
            <LogoText variant="h6">FormBuilder AI</LogoText>
          </LogoContainer>
        </Link>

        <Divider sx={{ mb: 2 }} />

        <List sx={{ px: 0 }}>
          {navLinks.map((item) => {
            const Icon = getIcon(item.label);
            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={item.href ? Link : 'button'}
                  href={item.href}
                  onClick={() => {
                    onClose();
                    item.onClick?.();
                  }}
                  sx={{
                    borderRadius: 1.5,
                    mb: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Icon size={20} color="#637381" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: 500,
                      color: '#212B36',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DrawerContent>
    </StyledDrawer>
  );
}

// Styled Components
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: theme.palette.background.paper,
  },
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: theme.spacing(0.5),
  backgroundColor: theme.palette.grey[900],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[900],
  fontWeight: 600,
  fontSize: '1.125rem',
}));

const _StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));
