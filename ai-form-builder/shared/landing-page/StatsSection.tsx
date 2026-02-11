/**
 * Stats Section Component
 * 4-stat grid with icons
 */

'use client';

import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FileText, Globe, type LucideIcon, Users, Zap } from 'lucide-react';

// Styled Components
const StatsWrapper = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
}));

const StatsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

const StatItem = styled(Box)({
  textAlign: 'center',
});

const IconBox = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: theme.spacing(2),
  backgroundColor: `${theme.palette.primary.main}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
}));

const StatValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 800,
  marginBottom: theme.spacing(0.5),
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
}

const stats: Stat[] = [
  { value: '10M+', label: 'Forms Created', icon: FileText },
  { value: '500K+', label: 'Active Users', icon: Users },
  { value: '99.9%', label: 'Uptime SLA', icon: Zap },
  { value: '150+', label: 'Countries', icon: Globe },
];

export function StatsSection() {
  return (
    <StatsWrapper maxWidth="xl">
      <StatsGrid>
        {stats.map((stat) => (
          <StatItem key={stat.label}>
            <IconBox>
              <stat.icon size={32} strokeWidth={2} />
            </IconBox>
            <StatValue variant="h2">{stat.value}</StatValue>
            <StatLabel variant="body1">{stat.label}</StatLabel>
          </StatItem>
        ))}
      </StatsGrid>
    </StatsWrapper>
  );
}
