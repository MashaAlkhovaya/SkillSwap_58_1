import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Shared/UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },

  args: {
    label: 'Бизнес и карьера',
    checked: false,
    indeterminate: false,
    disabled: false,
    onChange: fn(),
  },
}

export default meta

type Story = StoryObj<typeof Checkbox>

export const Unchecked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked)
    const [indeterminate, setIndeterminate] = useState(args.indeterminate)

    return (
      <Checkbox
        {...args}
        checked={checked}
        indeterminate={indeterminate}
        onChange={(val) => {
          setChecked(val)
          setIndeterminate(false)
          args.onChange(val)
        }}
      />
    )
  },
}

export const Checked: Story = {
  render: Unchecked.render,
  args: {
    checked: true,
  },
}

export const Indeterminate: Story = {
  render: Unchecked.render,
  args: {
    indeterminate: true,
    checked: false,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
