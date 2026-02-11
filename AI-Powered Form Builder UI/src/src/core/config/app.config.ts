/**
 * Application Configuration
 * Central configuration file for the application
 */

export const appConfig = {
  // Application Info
  app: {
    name: 'FormBuilder AI',
    version: '1.0.0',
    description: 'Enterprise-grade AI-powered form builder',
  },

  // API Configuration
  api: {
    baseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
  },

  // Feature Flags
  features: {
    aiGeneration: true,
    conditionalLogic: true,
    multiStepForms: true,
    customThemes: true,
    apiIntegration: true,
  },

  // UI Configuration
  ui: {
    drawerWidth: 240,
    propertiesPanelWidth: 320,
    maxFormWidth: 1200,
    defaultSpacing: 8,
  },

  // Form Defaults
  form: {
    defaultPageSize: 10,
    maxPages: 20,
    maxElements: 100,
    autosaveInterval: 30000, // 30 seconds
  },

  // Storage
  storage: {
    prefix: 'formbuilder_',
    version: 1,
  },
};

export default appConfig;
