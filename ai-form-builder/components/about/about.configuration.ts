/**
 * About Page Configuration
 * Static configuration data for about page
 */

import { Heart, Shield, Target, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ValueItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  color: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Milestone {
  year: string;
  event: string;
  description: string;
}

/**
 * Company Values
 */
export const aboutValues: ValueItem[] = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description:
      'We believe form building should be intuitive, powerful, and accessible to everyone.',
  },
  {
    icon: Zap,
    title: 'Innovation First',
    description: 'Leveraging AI and modern technology to push the boundaries of what forms can do.',
  },
  {
    icon: Shield,
    title: 'Security & Privacy',
    description: 'Enterprise-grade security ensuring your data is always protected and compliant.',
  },
  {
    icon: Heart,
    title: 'Customer Success',
    description:
      'Your success is our success. We provide world-class support every step of the way.',
  },
];

/**
 * Team Members
 */
export const aboutTeam: TeamMember[] = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Co-Founder',
    bio: 'Former VP of Product at SaaS unicorn. Stanford CS grad.',
    avatar: 'SJ',
    color: '#5B5FED',
  },
  {
    name: 'Michael Chen',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Google Staff Engineer. MIT alumnus with AI/ML expertise.',
    avatar: 'MC',
    color: '#8E33FF',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Design',
    bio: 'Award-winning designer from Apple and Airbnb.',
    avatar: 'ER',
    color: '#FF6B9D',
  },
  {
    name: 'David Kim',
    role: 'Head of Engineering',
    bio: '15 years building scalable systems at Facebook and Uber.',
    avatar: 'DK',
    color: '#00D4AA',
  },
];

/**
 * Company Stats
 */
export const aboutStats: Stat[] = [
  { value: '10,000+', label: 'Active Users' },
  { value: '500K+', label: 'Forms Created' },
  { value: '50M+', label: 'Submissions Processed' },
  { value: '99.9%', label: 'Uptime SLA' },
];

/**
 * Company Milestones
 */
export const aboutMilestones: Milestone[] = [
  {
    year: '2022',
    event: 'Founded',
    description: 'FormBuilder AI was born from a frustration with complex form tools',
  },
  {
    year: '2023',
    event: 'Series A',
    description: 'Raised $10M led by top-tier VCs to scale our platform',
  },
  {
    year: '2023',
    event: '1,000 Customers',
    description: 'Reached our first major milestone with enterprise clients',
  },
  {
    year: '2024',
    event: 'AI Integration',
    description: 'Launched AI-powered form generation and analytics',
  },
  {
    year: '2024',
    event: 'Global Expansion',
    description: 'Expanded to serve customers in 50+ countries',
  },
  { year: '2025', event: 'Today', description: 'Leading the future of intelligent form building' },
];
