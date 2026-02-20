import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Switch } from './index';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    icons: { control: 'boolean' },
    showOnlySelectedIcon: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: 'md',
    icons: true,
    showOnlySelectedIcon: false,
    disabled: false,
  },
  render: (args: Parameters<typeof Switch>[0]) => {
    const [checked, setChecked] = createSignal(false);
    return <Switch {...args} checked={checked()} onChange={setChecked} />;
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '14px', padding: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
        <Switch checked />
        <Switch />
        <Switch icons checked />
        <Switch icons showOnlySelectedIcon />
      </div>
      <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
        <Switch size="sm" checked />
        <Switch size="sm" />
        <Switch size="sm" icons checked />
      </div>
      <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
        <Switch disabled checked />
        <Switch disabled />
      </div>
    </div>
  ),
};
