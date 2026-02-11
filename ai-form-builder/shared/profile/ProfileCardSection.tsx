/**
 * Profile Card Section
 * Left side profile card with avatar and stats
 */

'use client';

import type { UserStats } from '@/components/profile/profile.configuration';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Camera } from 'lucide-react';

interface ProfileCardSectionProps {
  userName: string;
  userEmail: string;
  stats: UserStats;
  currentPlan: string;
}

export function ProfileCardSection({
  userName,
  userEmail,
  stats,
  currentPlan,
}: ProfileCardSectionProps) {
  const _theme = useTheme();
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ProfileCard>
      <Box sx={{ textAlign: 'center' }}>
        {/* Avatar with Edit Button */}
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
            }}
          >
            {userInitials}
          </Avatar>
          <CameraButton size="small">
            <Camera size={16} />
          </CameraButton>
        </Box>

        {/* User Info */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          {userName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {userEmail}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Stats */}
        <Stack spacing={2}>
          <StatRow>
            <Typography variant="body2" color="text.secondary">
              Forms Created
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {stats.formsCreated}
            </Typography>
          </StatRow>
          <StatRow>
            <Typography variant="body2" color="text.secondary">
              Total Responses
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {stats.totalResponses.toLocaleString()}
            </Typography>
          </StatRow>
          <StatRow>
            <Typography variant="body2" color="text.secondary">
              Member Since
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {stats.memberSince}
            </Typography>
          </StatRow>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Plan Badge */}
        <PlanBadge>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Current Plan
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {currentPlan}
          </Typography>
        </PlanBadge>
      </Box>
    </ProfileCard>
  );
}

// Styled Components
const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  height: 'fit-content',
  boxShadow:
    '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
  borderRadius: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    width: 320,
  },
}));

const CameraButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: 'white',
  border: `2px solid ${theme.palette.divider}`,
  width: 32,
  height: 32,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const StatRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const PlanBadge = styled(Box)(({ theme }) => ({
  padding: 12,
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));
