/**
 * Main Application Entry Point
 * 
 * This is the root component that provides:
 * - Material-UI Theme Provider
 * - Global CSS Reset
 * - Application Routing
 * - Authentication State
 */

import { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './src/core/theme';
import { LandingPage } from './components/LandingPage';
import { SignIn } from './components/SignIn';
import { HomepageWrapper } from './components/HomepageWrapper';
import { FormBuilder } from './components/FormBuilder';
import { FormSetup, FormSetupData } from './components/FormSetup';
import { LayoutSelection } from './components/LayoutSelection';
import { Pricing } from './components/Pricing';
import { About } from './components/About';
import { Templates } from './components/Templates';

export type FormTemplate = 'blank' | 'with-layout' | 'with-login' | 'ai' | null;

/**
 * Main App Component
 * 
 * Architecture:
 * - Uses centralized theme from /src/core/theme
 * - State management for routing and authentication
 * - Ready for React Router migration
 * 
 * @returns {JSX.Element} The main application component
 */
export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'signin' | 'dashboard' | 'layout-selection' | 'form-setup' | 'builder' | 'pricing' | 'about' | 'templates'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate>('blank');
  const [selectedLayout, setSelectedLayout] = useState<'classic' | 'card'>('classic');
  const [formSetupData, setFormSetupData] = useState<FormSetupData | null>({
    name: 'Contact Form',
    description: 'Get in touch with us',
    pages: [
      { id: 'page-1', name: 'Page 1', description: 'Contact information' }
    ]
  });
  
  // Theme customization state
  const [primaryColor, setPrimaryColor] = useState('#FF3B30');
  const [secondaryColor, setSecondaryColor] = useState('#1A1A1A');
  
  // Create theme with current colors
  const theme = useMemo(() => createAppTheme(primaryColor, secondaryColor), [primaryColor, secondaryColor]);
  
  const handleUpdateTheme = (primary: string, secondary: string) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('signin');
    }
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleTemplateSelect = (template: FormTemplate) => {
    if (!isAuthenticated) {
      setCurrentView('signin');
      return;
    }
    setSelectedTemplate(template);
    if (template === 'blank') {
      setCurrentView('layout-selection');
    } else {
      setCurrentView('builder');
    }
  };

  const handleLayoutSelect = (layout: 'classic' | 'card') => {
    if (!isAuthenticated) {
      setCurrentView('signin');
      return;
    }
    setSelectedLayout(layout);
    setCurrentView('builder');
  };

  const handleBackToHome = () => {
    if (!isAuthenticated) {
      setCurrentView('signin');
      return;
    }
    setCurrentView('dashboard');
  };

  const handleBackToLayoutSelection = () => {
    setCurrentView('layout-selection');
  };

  const handleNavigateToPricing = () => {
    setCurrentView('pricing');
  };

  const handleNavigateToAbout = () => {
    setCurrentView('about');
  };

  const handleFormSetupComplete = (data: FormSetupData) => {
    setFormSetupData(data);
    setCurrentView('builder');
  };

  const handleBackToFormSetup = () => {
    setCurrentView('form-setup');
  };

  const handleNavigateToTemplates = () => {
    setCurrentView('templates');
  };

  const handleNavigateToFeatures = () => {
    setCurrentView('landing');
    // Small delay to allow the landing page to mount before scrolling
    setTimeout(() => {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {currentView === 'landing' ? (
        <LandingPage 
          onGetStarted={handleGetStarted} 
          onPricing={handleNavigateToPricing} 
          onAbout={handleNavigateToAbout}
          onTemplates={handleNavigateToTemplates}
          onUpdateTheme={handleUpdateTheme}
          currentPrimaryColor={primaryColor}
          currentSecondaryColor={secondaryColor}
        />
      ) : currentView === 'signin' ? (
        <SignIn onSignIn={handleSignIn} onBackToHome={handleBackToLanding} />
      ) : currentView === 'dashboard' ? (
        isAuthenticated ? (
          <HomepageWrapper onTemplateSelect={handleTemplateSelect} onNavigateToTemplates={handleNavigateToTemplates} />
        ) : (
          <SignIn onSignIn={handleSignIn} onBackToHome={handleBackToLanding} />
        )
      ) : currentView === 'layout-selection' ? (
        isAuthenticated ? (
          <LayoutSelection onBack={handleBackToHome} onSelectLayout={handleLayoutSelect} />
        ) : (
          <SignIn onSignIn={handleSignIn} onBackToHome={handleBackToLanding} />
        )
      ) : currentView === 'form-setup' ? (
        isAuthenticated ? (
          <FormSetup 
            onBack={handleBackToHome} 
            onSetupComplete={handleFormSetupComplete}
            onUpdateTheme={handleUpdateTheme}
            currentPrimaryColor={primaryColor}
            currentSecondaryColor={secondaryColor}
          />
        ) : (
          <SignIn onSignIn={handleSignIn} onBackToHome={handleBackToLanding} />
        )
      ) : currentView === 'builder' ? (
        isAuthenticated && formSetupData ? (
          <FormBuilder 
            onBack={handleBackToFormSetup} 
            template={selectedTemplate} 
            formData={formSetupData}
            onUpdateTheme={handleUpdateTheme}
            currentPrimaryColor={primaryColor}
            currentSecondaryColor={secondaryColor}
          />
        ) : (
          <SignIn onSignIn={handleSignIn} onBackToHome={handleBackToLanding} />
        )
      ) : currentView === 'pricing' ? (
        <Pricing 
          onGetStarted={handleGetStarted} 
          onBackToHome={handleBackToLanding} 
          onAbout={handleNavigateToAbout}
          onTemplates={handleNavigateToTemplates}
          onFeatures={handleNavigateToFeatures}
          onUpdateTheme={handleUpdateTheme}
          currentPrimaryColor={primaryColor}
          currentSecondaryColor={secondaryColor}
        />
      ) : currentView === 'templates' ? (
        <Templates 
          onUseTemplate={handleTemplateSelect}
          onGetStarted={handleGetStarted} 
          onBackToHome={handleBackToLanding} 
          onAbout={handleNavigateToAbout}
          onPricing={handleNavigateToPricing}
          onFeatures={handleNavigateToFeatures}
          onUpdateTheme={handleUpdateTheme}
          currentPrimaryColor={primaryColor}
          currentSecondaryColor={secondaryColor}
        />
      ) : (
        <About 
          onGetStarted={handleGetStarted} 
          onBackToHome={handleBackToLanding} 
          onPricing={handleNavigateToPricing}
          onTemplates={handleNavigateToTemplates}
          onFeatures={handleNavigateToFeatures}
          onUpdateTheme={handleUpdateTheme}
          currentPrimaryColor={primaryColor}
          currentSecondaryColor={secondaryColor}
        />
      )}
    </ThemeProvider>
  );
}