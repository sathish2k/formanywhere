import { Box, Container, Typography, Stack, Divider, useTheme } from '@mui/material';
import { Sparkles } from 'lucide-react';

interface SharedFooterProps {
  onAbout?: () => void;
  onPricing?: () => void;
}

export function SharedFooter({ onAbout, onPricing }: SharedFooterProps) {
  const theme = useTheme();

  return (
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
                    onClick={() => {
                      if (link === 'Pricing' && onPricing) onPricing();
                      if (link === 'About Us' && onAbout) onAbout();
                    }}
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
  );
}
