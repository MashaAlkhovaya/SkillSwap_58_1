import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { RadioGroup } from './RadioGroup'

const CATEGORIES = [
  { value: 'all', label: 'Всё' },
  { value: 'learn', label: 'Хочу научиться' },
  { value: 'teach', label: 'Могу научить' },
  { value: 'disabled', label: 'Недоступный вариант', disabled: true },
]

const meta: Meta<typeof RadioGroup> = {
  title: 'Shared/UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
}

export default meta

type Story = StoryObj<typeof RadioGroup>

export const Uncontrolled: Story = {
  args: {
    name: 'category',
    options: CATEGORIES,
    defaultValue: 'learn',
    onChange: fn(),
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('all')

    return (
      <RadioGroup
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          args.onChange?.(newValue)
        }}
      />
    )
  },
  args: {
    name: 'category-controlled',
    options: CATEGORIES,
  },
}
