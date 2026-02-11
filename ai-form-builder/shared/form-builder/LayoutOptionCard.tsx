/**
 * Layout Option Card
 * Reusable card component for layout selection
 */

'use client';

import type { FormLayoutType } from '@/components/form-builder/form-builder.configuration';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

interface LayoutOptionCardProps {
  type: FormLayoutType;
  title: string;
  description: string;
  onClick: () => void;
}

export function LayoutOptionCard({ type, title, description, onClick }: LayoutOptionCardProps) {
  const theme = useTheme();

  return (
    <CardWrapper onClick={onClick}>
      <PreviewBox
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        }}
      >
        {type === 'classic' ? <ClassicPreview /> : <CardPreview />}
      </PreviewBox>

      <LabelBox>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </LabelBox>
    </CardWrapper>
  );
}

// Classic Form Preview (all questions on one page)
function ClassicPreview() {
  return (
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
      {/* Header */}
      <Box>
        <Box sx={{ width: '70%', height: 10, bgcolor: 'grey.200', borderRadius: 1, mb: 1.5 }} />
        <Box sx={{ width: '50%', height: 8, bgcolor: 'grey.200', borderRadius: 1 }} />
      </Box>

      {/* Questions */}
      {[1, 2, 3, 4].map((i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1.5 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              mt: 0.5,
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ width: '85%', height: 8, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
            <Box sx={{ width: '65%', height: 8, bgcolor: 'grey.200', borderRadius: 1 }} />
          </Box>
        </Box>
      ))}

      <Box sx={{ flex: 1 }} />

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Box
          sx={{ width: 80, height: 28, bgcolor: 'primary.main', borderRadius: 1, boxShadow: 2 }}
        />
      </Box>
    </Paper>
  );
}

// Card Form Preview (single question per page)
function CardPreview() {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '100%' }}
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
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              mt: 0.5,
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ width: '95%', height: 9, bgcolor: 'grey.200', borderRadius: 1, mb: 1.5 }} />
            <Box sx={{ width: '75%', height: 9, bgcolor: 'grey.200', borderRadius: 1 }} />
          </Box>
        </Box>

        {/* Answer */}
        <Box sx={{ pl: 3 }}>
          <Box sx={{ width: '100%', height: 9, bgcolor: 'grey.200', borderRadius: 1, mb: 1.5 }} />
          <Box sx={{ width: '90%', height: 9, bgcolor: 'grey.200', borderRadius: 1 }} />
        </Box>
      </Paper>

      {/* Progress dots */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: 'white', boxShadow: 2 }} />
        <Box sx={{ width: 48, height: 3, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }} />
        <Box
          sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.5)' }}
        />
        <Box sx={{ width: 48, height: 3, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }} />
        <Box
          sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.5)' }}
        />
      </Box>
    </Box>
  );
}

// Styled Components
const CardWrapper = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  cursor: 'pointer',
  borderRadius: theme.spacing(3),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid transparent',
  boxShadow:
    '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-8px)',
    boxShadow: `0px 0px 2px 0px ${theme.palette.primary.main}40, 0px 24px 48px -4px ${theme.palette.primary.main}40`,
  },
}));

const PreviewBox = styled(Box)({
  padding: 40,
  height: 340,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const LabelBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
}));
