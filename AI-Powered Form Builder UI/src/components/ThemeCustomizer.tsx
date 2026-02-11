import { useState } from 'react';
import { Box, IconButton, Popover, Typography, Stack } from '@mui/material';
import { Palette, Check } from 'lucide-react';

interface ThemeCustomizerProps {
  onUpdateTheme: (primary: string, secondary: string) => void;
  currentPrimary: string;
  currentSecondary: string;
}

export function ThemeCustomizer({ onUpdateTheme, currentPrimary }: ThemeCustomizerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const themes = [
    { name: 'Red', color: '#FF3B30', secondary: '#1A1A1A', gradient: 'linear-gradient(135deg, #FF3B30 0%, #FF6B5A 100%)' },
    { name: 'Purple', color: '#BF5AF2', secondary: '#1A1A1A', gradient: 'linear-gradient(135deg, #BF5AF2 0%, #D78EFF 100%)' },
    { name: 'Blue', color: '#007AFF', secondary: '#1A1A1A', gradient: 'linear-gradient(135deg, #007AFF 0%, #3FA1FF 100%)' },
    { name: 'Green', color: '#34C759', secondary: '#1A1A1A', gradient: 'linear-gradient(135deg, #34C759 0%, #5FD682 100%)' },
    { name: 'Orange', color: '#FF9500', secondary: '#1A1A1A', gradient: 'linear-gradient(135deg, #FF9500 0%, #FFB340 100%)' },
    { name: 'Pink', color: '#FF2D55', secondary: '#1A1A1A', gradient: 'linear-gradient(135deg, #FF2D55 0%, #FF5B7D 100%)' },
  ];

  const handleSelectTheme = (color: string, secondary: string) => {
    onUpdateTheme(color, secondary);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          bgcolor: open ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease',
          '&:hover': { 
            bgcolor: 'rgba(0, 0, 0, 0.08)',
            transform: 'scale(1.05)',
          },
        }}
      >
        <Palette size={20} />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: { 
              p: 3, 
              mt: 1.5, 
              minWidth: 280,
              borderRadius: 2.5,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
            },
          },
        }}
      >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 2.5, 
            fontWeight: 700,
            color: '#212B36',
            letterSpacing: '-0.01em',
          }}
        >
          Choose Your Theme
        </Typography>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
          }}
        >
          {themes.map((theme) => {
            const isSelected = currentPrimary === theme.color;
            return (
              <Box
                key={theme.name}
                onClick={() => handleSelectTheme(theme.color, theme.secondary)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Overlapping Circles Design */}
                <Box 
                  sx={{ 
                    position: 'relative',
                    width: 70,
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Primary Color Circle (Left) */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: theme.gradient,
                      position: 'absolute',
                      left: 0,
                      border: isSelected ? `3px solid ${theme.color}` : '3px solid white',
                      boxShadow: isSelected 
                        ? `0 8px 24px ${theme.color}40, 0 0 0 4px ${theme.color}15`
                        : `0 4px 12px ${theme.color}25`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: 2,
                    }}
                  />
                  
                  {/* Secondary Color Circle (Right) */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: theme.secondary,
                      position: 'absolute',
                      right: 0,
                      border: isSelected ? `3px solid ${theme.color}` : '3px solid white',
                      boxShadow: isSelected 
                        ? `0 8px 24px ${theme.secondary}60, 0 0 0 4px ${theme.color}15`
                        : `0 4px 12px ${theme.secondary}30`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: 1,
                    }}
                  />
                  
                  {/* Check Mark Indicator */}
                  {isSelected && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 3,
                        boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
                        animation: 'fadeInScale 0.3s ease',
                        '@keyframes fadeInScale': {
                          '0%': {
                            opacity: 0,
                            transform: 'translate(-50%, -50%) scale(0)',
                          },
                          '100%': {
                            opacity: 1,
                            transform: 'translate(-50%, -50%) scale(1)',
                          },
                        },
                      }}
                    >
                      <Check size={14} color={theme.color} strokeWidth={3} />
                    </Box>
                  )}
                </Box>
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: isSelected ? 700 : 600,
                    color: isSelected ? theme.color : '#637381',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {theme.name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Popover>
    </>
  );
}