/**
 * Theme Customization Context
 * Provides dynamic theme color management across the app
 */

'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { type ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { createAppTheme } from './theme';

interface ThemeCustomizationContextValue {
  primaryColor: string;
  secondaryColor: string;
  updateTheme: (primary: string, secondary: string) => void;
}

const ThemeCustomizationContext = createContext<ThemeCustomizationContextValue | null>(null);

export function useThemeCustomization() {
  const context = useContext(ThemeCustomizationContext);
  if (!context) {
    throw new Error('useThemeCustomization must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultPrimaryColor?: string;
  defaultSecondaryColor?: string;
}

export function ThemeProvider({
  children,
  defaultPrimaryColor = '#FF3B30',
  defaultSecondaryColor = '#1A1A1A',
}: ThemeProviderProps) {
  const [primaryColor, setPrimaryColor] = useState(defaultPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState(defaultSecondaryColor);

  const theme = useMemo(
    () => createAppTheme(primaryColor, secondaryColor),
    [primaryColor, secondaryColor]
  );

  const updateTheme = (primary: string, secondary: string) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
  };

  const contextValue = useMemo(
    () => ({
      primaryColor,
      secondaryColor,
      updateTheme,
    }),
    [primaryColor, secondaryColor]
  );

  return (
    <ThemeCustomizationContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeCustomizationContext.Provider>
  );
}

export default ThemeProvider;
