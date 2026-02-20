import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button } from './index';
import { Icon } from '../icon';

/**
 * M3 Button
 *
 * Based on https://github.com/material-components/material-web/blob/main/button/demo/stories.ts
 *
 * Knobs: label, disabled
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'tonal', 'elevated', 'outlined', 'text', 'secondary', 'ghost', 'danger', 'glass'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'inherit'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Styles matching material-web demo layout ────────────────────────────────

const columnStyle = {
  display: 'flex',
  'flex-direction': 'column' as const,
  gap: '16px',
  'max-width': '600px',
};

const rowStyle = {
  display: 'flex',
  'flex-wrap': 'wrap' as const,
  gap: '16px',
  'align-items': 'center' as const,
};

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'filled',
    size: 'md',
    disabled: false,
    loading: false,
  },
  render: (args: Parameters<typeof Button>[0]) => <Button {...args}>Get Started</Button>,
};

// ─── Button Variants (matches material-web demo: buttons story) ──────────────
// Row 1: All 5 official M3 variants — plain text
// Row 2: All 5 official M3 variants — with leading icon

export const ButtonVariants: Story = {
  name: 'Button variants',
  render: () => (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <Button variant="filled">Filled</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="elevated">Elevated</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="text">Text</Button>
      </div>
      <div style={rowStyle}>
        <Button variant="filled" aria-label="Filled button with icon">
          <Icon name="upload" size={18} />
          Filled
        </Button>
        <Button variant="outlined" aria-label="Outlined button with icon">
          <Icon name="upload" size={18} />
          Outlined
        </Button>
        <Button variant="elevated" aria-label="Elevated button with icon">
          <Icon name="upload" size={18} />
          Elevated
        </Button>
        <Button variant="tonal" aria-label="Tonal button with icon">
          <Icon name="upload" size={18} />
          Tonal
        </Button>
        <Button variant="text" aria-label="Text button with icon">
          <Icon name="upload" size={18} />
          Text
        </Button>
      </div>
    </div>
  ),
};

// ─── Links (matches material-web demo: links story) ─────────────────────────
// Row 1: All 5 variants as link buttons
// Row 2: All 5 variants as link buttons with trailing icon (open_in_new → link icon)

export const Links: Story = {
  name: 'Links',
  render: () => (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <Button variant="filled" href="https://google.com">
          Filled
        </Button>
        <Button variant="outlined" href="https://google.com">
          Outlined
        </Button>
        <Button variant="elevated" href="https://google.com">
          Elevated
        </Button>
        <Button variant="tonal" href="https://google.com">
          Tonal
        </Button>
        <Button variant="text" href="https://google.com">
          Text
        </Button>
      </div>
      <div style={rowStyle}>
        <Button variant="filled" href="https://google.com" aria-label="Filled link with trailing icon">
          Filled
          <Icon name="link" size={18} />
        </Button>
        <Button variant="outlined" href="https://google.com" aria-label="Outlined link with trailing icon">
          Outlined
          <Icon name="link" size={18} />
        </Button>
        <Button variant="elevated" href="https://google.com" aria-label="Elevated link with trailing icon">
          Elevated
          <Icon name="link" size={18} />
        </Button>
        <Button variant="tonal" href="https://google.com" aria-label="Tonal link with trailing icon">
          Tonal
          <Icon name="link" size={18} />
        </Button>
        <Button variant="text" href="https://google.com" aria-label="Text link with trailing icon">
          Text
          <Icon name="link" size={18} />
        </Button>
      </div>
    </div>
  ),
};

// ─── Disabled (matches material-web knob: disabled=true) ─────────────────────
// M3 spec: container = on-surface at 12%, label = on-surface at 38%

export const DisabledVariants: Story = {
  name: 'Disabled',
  render: () => (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <Button variant="filled" disabled>Filled</Button>
        <Button variant="outlined" disabled>Outlined</Button>
        <Button variant="elevated" disabled>Elevated</Button>
        <Button variant="tonal" disabled>Tonal</Button>
        <Button variant="text" disabled>Text</Button>
      </div>
      <div style={rowStyle}>
        <Button variant="filled" disabled aria-label="Disabled filled button with icon">
          <Icon name="upload" size={18} />
          Filled
        </Button>
        <Button variant="outlined" disabled aria-label="Disabled outlined button with icon">
          <Icon name="upload" size={18} />
          Outlined
        </Button>
        <Button variant="elevated" disabled aria-label="Disabled elevated button with icon">
          <Icon name="upload" size={18} />
          Elevated
        </Button>
        <Button variant="tonal" disabled aria-label="Disabled tonal button with icon">
          <Icon name="upload" size={18} />
          Tonal
        </Button>
        <Button variant="text" disabled aria-label="Disabled text button with icon">
          <Icon name="upload" size={18} />
          Text
        </Button>
      </div>
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// Custom extension stories (not in official material-web demo)
// ═══════════════════════════════════════════════════════════════════════════════

export const CustomVariants: Story = {
  name: 'Custom extensions',
  render: () => (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="glass">Glass</Button>
      </div>
      <div style={rowStyle}>
        <Button variant="secondary" disabled>Secondary</Button>
        <Button variant="ghost" disabled>Ghost</Button>
        <Button variant="danger" disabled>Danger</Button>
        <Button variant="glass" disabled>Glass</Button>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={rowStyle}>
      <Button variant="filled" size="sm">Small (32px)</Button>
      <Button variant="filled" size="md">Medium (40px)</Button>
      <Button variant="filled" size="lg">Large (48px)</Button>
    </div>
  ),
};

export const ColorOverrides: Story = {
  name: 'Color overrides',
  render: () => (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <Button variant="filled">Primary</Button>
        <Button variant="filled" color="secondary">Secondary</Button>
        <Button variant="filled" color="info">Info</Button>
        <Button variant="filled" color="success">Success</Button>
        <Button variant="filled" color="warning">Warning</Button>
        <Button variant="filled" color="error">Error</Button>
      </div>
      <div style={rowStyle}>
        <Button variant="tonal">Default</Button>
        <Button variant="tonal" color="info">Info</Button>
        <Button variant="tonal" color="error">Error</Button>
        <Button variant="tonal" color="success">Success</Button>
        <Button variant="tonal" color="warning">Warning</Button>
      </div>
      <div style={rowStyle}>
        <Button variant="outlined">Primary</Button>
        <Button variant="outlined" color="secondary">Secondary</Button>
        <Button variant="outlined" color="error">Error</Button>
        <Button variant="outlined" color="success">Success</Button>
        <Button variant="outlined" color="info">Info</Button>
        <Button variant="outlined" color="warning">Warning</Button>
      </div>
    </div>
  ),
};

export const LoadingState: Story = {
  name: 'Loading',
  render: () => (
    <div style={rowStyle}>
      <Button variant="filled" loading>Filled</Button>
      <Button variant="tonal" loading>Tonal</Button>
      <Button variant="elevated" loading>Elevated</Button>
      <Button variant="outlined" loading>Outlined</Button>
    </div>
  ),
};
