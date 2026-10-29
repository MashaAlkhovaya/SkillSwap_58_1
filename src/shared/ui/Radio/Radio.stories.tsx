import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Radio } from './Radio'

const meta: Meta<typeof Radio> = {
  title: 'Shared/UI/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
  args: {
    label: 'Хочу научиться',
    value: 'learn',
    name: 'demo-radio',
    checked: false,
    disabled: false,
    onChange: fn(),
  },
}

export default meta

type Story = StoryObj<typeof Radio>

export const Unchecked: Story = {}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
}
