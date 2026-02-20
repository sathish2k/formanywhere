import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Select, SelectOptionItem } from './index';

const options = [
  { value: 'field', label: 'Field Operations' },
  { value: 'survey', label: 'Survey Collection' },
  { value: 'audit', label: 'Inspection Audit' },
  { value: 'offline', label: 'Offline Capture', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Use `options` for simple data-driven lists. Use composable `SelectOptionItem` children when options need richer content like supporting text or icons.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Template Category',
    variant: 'outlined',
    size: 'md',
    options,
    placeholder: 'Choose a category',
    supportingText: 'Select one option',
    disabled: false,
    error: false,
  },
  render: (args: Parameters<typeof Select>[0]) => {
    const [value, setValue] = createSignal('');
    return <Select {...args} value={value()} onChange={setValue} />;
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '16px', width: '320px' }}>
      <Select label="Outlined" variant="outlined" options={options} placeholder="Pick option" />
      <Select label="Filled" variant="filled" options={options} placeholder="Pick option" />
      <Select label="Error" variant="outlined" options={options} error errorText="Selection required" />
      <Select label="Disabled" variant="outlined" options={options} disabled value="field" />
    </div>
  ),
};

export const ComposableOptions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the composable children API using `SelectOptionItem` instead of the `options` prop.',
      },
    },
  },
  render: () => {
    const [value, setValue] = createSignal('inspection');

    return (
      <div style={{ width: '320px' }}>
        <Select
          label="Workflow"
          variant="outlined"
          value={value()}
          onChange={setValue}
          supportingText="Options supplied as children"
        >
          <SelectOptionItem
            value="inspection"
            label="Inspection"
            supportingText="Site checklist and audit flows"
          />
          <SelectOptionItem
            value="survey"
            label="Survey"
            supportingText="Field data capture forms"
          />
          <SelectOptionItem
            value="incident"
            label="Incident"
            supportingText="Report and escalation workflow"
          />
          <SelectOptionItem
            value="offline"
            label="Offline Queue"
            supportingText="Sync later when online"
            disabled
          />
        </Select>
      </div>
    );
  },
};

export const ComposableWithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Composable options with `leadingIcon` and `trailingIcon` for richer option rows.',
      },
    },
  },
  render: () => {
    const [value, setValue] = createSignal('field');

    return (
      <div style={{ width: '340px' }}>
        <Select
          label="Capture Mode"
          variant="outlined"
          value={value()}
          onChange={setValue}
          supportingText="Leading and trailing icons from composable options"
        >
          <SelectOptionItem
            value="field"
            label="Field Entry"
            supportingText="Offline-first on-site capture"
            leadingIcon={<span aria-hidden="true">📍</span>}
            trailingIcon={<span aria-hidden="true">⌘1</span>}
          />
          <SelectOptionItem
            value="scan"
            label="Barcode Scan"
            supportingText="Fast lookup and assignment"
            leadingIcon={<span aria-hidden="true">📷</span>}
            trailingIcon={<span aria-hidden="true">⌘2</span>}
          />
          <SelectOptionItem
            value="review"
            label="Supervisor Review"
            supportingText="Approval and quality checks"
            leadingIcon={<span aria-hidden="true">✅</span>}
            trailingIcon={<span aria-hidden="true">⌘3</span>}
          />
        </Select>
      </div>
    );
  },
};
