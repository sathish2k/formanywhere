import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Radio, RadioGroup } from './index';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Material 3 radio controls with grouped selection.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: 'md',
    disabled: false,
  },
  render: (args: Parameters<typeof Radio>[0]) => {
    const [value, setValue] = createSignal('standard');
    return (
      <div style={{ padding: '16px' }}>
        <RadioGroup name="plan" value={value()} onChange={setValue}>
          <div style={{ display: 'grid', gap: '10px' }}>
            <Radio value="standard" label="Standard" size={args.size} disabled={args.disabled} />
            <Radio value="pro" label="Pro" size={args.size} disabled={args.disabled} />
            <Radio value="enterprise" label="Enterprise" size={args.size} disabled={args.disabled} />
          </div>
        </RadioGroup>
      </div>
    );
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '20px', padding: '16px' }}>
      <RadioGroup name="sizes" defaultValue="sm-a">
        <div style={{ display: 'grid', gap: '8px' }}>
          <Radio value="sm-a" label="Small A" size="sm" />
          <Radio value="sm-b" label="Small B" size="sm" />
        </div>
      </RadioGroup>
      <RadioGroup name="disabled" defaultValue="d-a" disabled>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Radio value="d-a" label="Disabled A" />
          <Radio value="d-b" label="Disabled B" />
        </div>
      </RadioGroup>
    </div>
  ),
};

export const Standalone: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates standalone `Radio` controls using `checked`/`onChange`/`name` without `RadioGroup`.',
      },
    },
  },
  render: () => {
    const [selected, setSelected] = createSignal('draft');

    return (
      <div style={{ display: 'grid', gap: '10px', padding: '16px' }}>
        <Radio
          name="status"
          value="draft"
          label="Draft"
          checked={selected() === 'draft'}
          onChange={(checked) => checked && setSelected('draft')}
        />
        <Radio
          name="status"
          value="review"
          label="In Review"
          checked={selected() === 'review'}
          onChange={(checked) => checked && setSelected('review')}
        />
        <Radio
          name="status"
          value="published"
          label="Published"
          checked={selected() === 'published'}
          onChange={(checked) => checked && setSelected('published')}
        />
      </div>
    );
  },
};
