import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SelectCustom } from './index'

const SELECT_OPTIONS = [
  { value: '', label: 'что-то надо выбрать', key: 'placeholder', title: true },
  { value: '1', label: 'one', key: '1' },
  { value: '2', label: 'two', key: '2' },
  { value: '3', label: 'three', key: '3' },
  { value: '4', label: 'four', key: '4' },
  { value: '5', label: 'five', key: '5' },
]

const meta: Meta<typeof SelectCustom> = {
  title: 'shared/ui/SelectCustom',
  component: SelectCustom,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Кастомный выпадающий список с поиском по label и поддержкой клавиатурной навигации. При фокусе placeholder скрывается, а ввод текста автоматически открывает и фильтрует список. Элемент с title отображается как начальный, недоступный для выбора placeholder.',
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
type Story = StoryObj<typeof SelectCustom>

export const Default: Story = {
  args: {
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
