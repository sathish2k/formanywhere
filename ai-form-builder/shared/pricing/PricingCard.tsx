/**
 * Pricing Card Component
 */

'use client';

import type { PricingPlan } from '@/components/pricing/pricing.configuration';
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowRight, Check, X } from 'lucide-react';
import Link from 'next/link';

interface PricingCardProps {
  plan: PricingPlan;
  isAnnual: boolean;
}

export function PricingCard({ plan, isAnnual }: PricingCardProps) {
  const Icon = plan.icon;
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const displayPrice = price === null ? 'Custom' : price === 0 ? 'Free' : `$${price}`;

  return (
    <CardWrapper popular={plan.popular}>
      {plan.popular && (
        <PopularBadge>
          <Chip
            label="Most Popular"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 700,
              boxShadow: '0px 4px 12px 0px rgba(91, 95, 237, 0.24)',
              px: 2,
              height: 32,
            }}
          />
        </PopularBadge>
      )}

      <StyledCard popular={plan.popular} gradient={plan.gradient}>
        <CardContent sx={{ p: 4 }}>
          <IconBox gradient={plan.gradient}>
            <Icon size={24} color={plan.gradient ? 'white' : undefined} strokeWidth={2} />
          </IconBox>

          <Typography variant="h5" sx={{ mb: 1 }}>
            {plan.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: plan.gradient ? 'rgba(255, 255, 255, 0.9)' : 'text.secondary',
            }}
          >
            {plan.description}
          </Typography>

          <Stack direction="row" alignItems="baseline" sx={{ mb: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {displayPrice}
            </Typography>
            {price !== null && price > 0 && (
              <Typography
                variant="body1"
                sx={{
                  ml: 1,
                  color: plan.gradient ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                }}
              >
                {isAnnual ? '/year' : '/month'}
              </Typography>
            )}
            {price === 0 && (
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  color: plan.gradient ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                }}
              >
                Forever free
              </Typography>
            )}
            {price === null && (
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  color: plan.gradient ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                }}
              >
                Contact us
              </Typography>
            )}
          </Stack>

          <Link href="/signup" style={{ textDecoration: 'none', width: '100%' }}>
            <CTAButton
              variant={plan.gradient ? 'outlined' : 'contained'}
              size="large"
              fullWidth
              endIcon={<ArrowRight size={18} />}
              gradient={plan.gradient}
            >
              {plan.cta}
            </CTAButton>
          </Link>

          <Stack spacing={2}>
            {plan.features.map((feature) => (
              <Stack key={feature.name} direction="row" spacing={1.5} alignItems="flex-start">
                <FeatureIcon included={feature.included} gradient={plan.gradient}>
                  {feature.included ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <X size={14} strokeWidth={2} />
                  )}
                </FeatureIcon>
                <Typography
                  variant="body2"
                  sx={{
                    color: feature.included
                      ? plan.gradient
                        ? 'white'
                        : 'text.primary'
                      : plan.gradient
                        ? 'rgba(255, 255, 255, 0.5)'
                        : 'text.disabled',
                    textDecoration: feature.included ? 'none' : 'line-through',
                  }}
                >
                  {feature.name}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </StyledCard>
    </CardWrapper>
  );
}

// Styled Components
const CardWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'popular',
})<{ popular: boolean }>(({ popular }) => ({
  position: 'relative',
  paddingTop: popular ? 16 : 0,
}));

const PopularBadge = styled(Box)({
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
});

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'popular' && prop !== 'gradient',
})<{ popular: boolean; gradient: boolean }>(({ theme, popular, gradient }) => ({
  height: '100%',
  position: 'relative',
  border: popular ? '2px solid' : '1px solid',
  borderColor: popular ? theme.palette.primary.main : theme.palette.divider,
  background: gradient
    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    : 'white',
  color: gradient ? 'white' : theme.palette.text.primary,
  boxShadow: popular ? `0px 12px 24px 0px ${theme.palette.primary.main}40` : undefined,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: popular ? `0px 16px 32px 0px ${theme.palette.primary.main}50` : theme.shadows[4],
  },
}));

const IconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'gradient',
})<{ gradient: boolean }>(({ theme, gradient }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.spacing(1),
  backgroundColor: gradient ? 'rgba(255, 255, 255, 0.2)' : `${theme.palette.primary.main}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: gradient ? 'white' : theme.palette.primary.main,
}));

const CTAButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'gradient',
})<{ gradient?: boolean }>(({ theme, gradient }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
  ...(gradient
    ? {
        borderColor: 'white',
        color: 'white',
        '&:hover': {
          borderColor: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }
    : {
        boxShadow: '0px 8px 16px 0px rgba(91, 95, 237, 0.24)',
        '&:hover': {
          boxShadow: '0px 12px 24px 0px rgba(91, 95, 237, 0.32)',
        },
      }),
}));

const FeatureIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'included' && prop !== 'gradient',
})<{ included: boolean; gradient: boolean }>(({ theme, included, gradient }) => ({
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: included
    ? gradient
      ? 'rgba(255, 255, 255, 0.2)'
      : `${theme.palette.primary.main}20`
    : 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginTop: 2,
  color: included
    ? gradient
      ? 'white'
      : theme.palette.primary.main
    : gradient
      ? 'rgba(255, 255, 255, 0.4)'
      : '#999',
}));
