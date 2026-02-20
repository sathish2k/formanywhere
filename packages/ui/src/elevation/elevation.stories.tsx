import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
import { Elevation } from './index';

const meta: Meta<typeof Elevation> = {
  title: 'Components/Elevation',
  component: Elevation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Material-style elevation utility for applying surface shadow levels (0-5).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    level: 2,
  },
  render: (args: Parameters<typeof Elevation>[0]) => (
    <Elevation
      {...args}
      style={{
        padding: '20px',
        'border-radius': '16px',
        background: 'var(--m3-color-surface, #fff)',
        width: '260px',
      }}
    >
      Elevated container
    </Elevation>
  ),
};

export const Levels: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '14px', width: '280px' }}>
      <For each={[0, 1, 2, 3, 4, 5] as const}>
        {(level) => (
          <Elevation
            level={level}
            style={{
              padding: '14px 16px',
              'border-radius': '14px',
              background: 'var(--m3-color-surface, #fff)',
            }}
          >
            Elevation level {level}
          </Elevation>
        )}
      </For>
    </div>
  ),
};
