import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Select } from './index'

const SELECT_OPTIONS = [
  { value: '', label: 'что-то надо выбрать', key: '0', title: true },
  { value: '1', label: 'one', key: '1' },
  { value: '2', label: 'two', key: '2' },
  { value: '3', label: 'three', key: '3' },
  { value: '4', label: 'four', key: '4' },
  { value: '5', label: 'five', key: '5' },
]

const meta: Meta<typeof Select> = {
  title: 'shared/ui/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Нативный выпадающий список. Если среди options есть элемент с title, он используется как отключённый placeholder.',
      },
    },
  },
  argTypes: {
    onChange: { action: 'changed' },
    disabled: { control: 'boolean' },
    name: { control: 'text' },
    options: { control: 'object' },
    className: { control: false },
  },
  args: {
    name: 'demo-native-select',
    disabled: false,
    onChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {
    disabled: false,
    options: SELECT_OPTIONS,
  },
}

export const WithoutPlaceholder: Story = {
  args: {
    options: SELECT_OPTIONS.filter((option) => !option.title),
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    options: SELECT_OPTIONS,
  },
}
