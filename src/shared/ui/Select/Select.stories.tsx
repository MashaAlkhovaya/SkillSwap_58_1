import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Select } from './index'

const SELECT_OPTIONS = [
  { value: '1', label: 'one' },
  { value: '2', label: 'two' },
  { value: '3', label: 'three' },
  { value: '4', label: 'four' },
  { value: '5', label: 'five' },
]

const meta: Meta<typeof Select> = {
  title: 'shared/ui/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Выпадающий список с поиском по label, поддержкой клавиатурной навигации и кнопкой очистки выбора. Выбранный value передаётся в onChange как массив; очистка передаёт пустой массив.',
      },
    },
  },
  argTypes: {
    onChange: { action: 'changed' },
    disabled: { control: 'boolean' },
    options: { control: 'object' },
    className: { control: false },
  },
  args: {
    disabled: false,
    onChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {
    label: 'Выберите вариант',
    options: SELECT_OPTIONS,
    placeholder: 'Начните вводить или выберите вариант',
  },
}

export const WithoutPlaceholder: Story = {
  args: {
    label: 'Без placeholder',
    options: SELECT_OPTIONS,
    placeholder: '',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    options: SELECT_OPTIONS,
  },
}
