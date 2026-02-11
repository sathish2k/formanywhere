/**
 * Shared constants across the application
 */

export const APP_NAME = 'FormBuilder AI';
export const APP_VERSION = '1.0.0';

export const DRAWER_WIDTH = 240;
export const PROPERTIES_PANEL_WIDTH = 320;

export const DEFAULT_FORM_VALUES = {
  name: 'Untitled Form',
  description: 'Form description',
};

export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  ABOUT: '/about',
  PRICING: '/pricing',
  BUILDER: '/builder',
} as const;

export const API_ENDPOINTS = {
  FORMS: '/api/forms',
  SUBMISSIONS: '/api/submissions',
} as const;
