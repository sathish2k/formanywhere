import React, { useState } from 'react';
import { Homepage } from './Homepage';
import { ProfileScreen } from './ProfileScreen';
import { FormTemplate } from '../App';

interface HomepageWrapperProps {
  onTemplateSelect: (template: FormTemplate) => void;
  onNavigateToTemplates?: () => void;
}

export function HomepageWrapper({ onTemplateSelect, onNavigateToTemplates }: HomepageWrapperProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');

  const handleViewProfile = () => {
    setCurrentView('profile');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (currentView === 'profile') {
    return <ProfileScreen onBack={handleBackToDashboard} />;
  }

  return <Homepage onTemplateSelect={onTemplateSelect} onViewProfile={handleViewProfile} onNavigateToTemplates={onNavigateToTemplates} />;
}