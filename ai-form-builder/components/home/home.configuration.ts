/**
 * Home Page Configuration
 * Feature icons and color configurations
 */

export const featureIcons = [
  { gradient: 'linear-gradient(135deg, #5B5FED 0%, #8E33FF 100%)', icon: 'Sparkles' },
  { gradient: 'linear-gradient(135deg, #00B8D9 0%, #0097B8 100%)', icon: 'Wand2' },
  { gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', icon: 'Zap' },
  { gradient: 'linear-gradient(135deg, #FFAB00 0%, #FF8F00 100%)', icon: 'Shield' },
  { gradient: 'linear-gradient(135deg, #8E33FF 0%, #7C22E6 100%)', icon: 'BarChart3' },
  { gradient: 'linear-gradient(135deg, #FF5630 0%, #E64A19 100%)', icon: 'Workflow' },
] as const;

export const useCaseColors = [
  { bg: 'rgba(91, 95, 237, 0.1)', color: '#5B5FED', icon: 'Users' },
  { bg: 'rgba(0, 184, 217, 0.1)', color: '#00B8D9', icon: 'FileText' },
  { bg: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', icon: 'TrendingUp' },
  { bg: 'rgba(255, 171, 0, 0.1)', color: '#FFAB00', icon: 'Lightbulb' },
] as const;

export const testimonialColors = [
  {
    gradient: 'linear-gradient(135deg, rgba(91, 95, 237, 0.03) 0%, rgba(142, 51, 255, 0.03) 100%)',
    hoverShadow:
      '0px 0px 2px 0px rgba(91, 95, 237, 0.2), 0px 20px 40px -4px rgba(91, 95, 237, 0.20)',
    hoverBorder: 'primary.main',
    quoteColor: '#5B5FED',
    avatarBg: 'primary.main',
    avatarShadow: '0px 4px 12px 0px rgba(91, 95, 237, 0.24)',
  },
  {
    gradient: 'linear-gradient(135deg, rgba(0, 184, 217, 0.03) 0%, rgba(0, 151, 184, 0.03) 100%)',
    hoverShadow:
      '0px 0px 2px 0px rgba(0, 184, 217, 0.2), 0px 20px 40px -4px rgba(0, 184, 217, 0.20)',
    hoverBorder: '#00B8D9',
    quoteColor: '#00B8D9',
    avatarBg: '#00B8D9',
    avatarShadow: '0px 4px 12px 0px rgba(0, 184, 217, 0.24)',
  },
  {
    gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.03) 0%, rgba(22, 163, 74, 0.03) 100%)',
    hoverShadow:
      '0px 0px 2px 0px rgba(34, 197, 94, 0.2), 0px 20px 40px -4px rgba(34, 197, 94, 0.20)',
    hoverBorder: '#22C55E',
    quoteColor: '#22C55E',
    avatarBg: '#22C55E',
    avatarShadow: '0px 4px 12px 0px rgba(34, 197, 94, 0.24)',
  },
] as const;

export const integrationTools = [
  { name: 'Slack', color: '#4A154B', icon: '💬' },
  { name: 'Notion', color: '#000000', icon: '📝' },
  { name: 'Zapier', color: '#FF4A00', icon: '⚡' },
  { name: 'Airtable', color: '#18BFFF', icon: '📊' },
  { name: 'HubSpot', color: '#FF7A59', icon: '🎯' },
  { name: 'Salesforce', color: '#00A1E0', icon: '☁️' },
] as const;
