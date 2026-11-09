import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextInput } from './index'
import { SearchIcon } from '@/shared/ui'

const meta: Meta<typeof TextInput> = {
  title: 'shared/ui/TextInput',
  component: TextInput,
}

export default meta
type Story = StoryObj<typeof TextInput>

export const Default: Story = {
  args: {
    placeholder: 'Введите текст',
  },
}

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Искать навык',
    leftContent: <SearchIcon size={20} color="var(--color-text-secondary)" />,
  },
}

export const WithRightButton: Story = {
  args: {
    placeholder: 'Email',
    rightContent: (
      <button
        type="button"
        style={{
          border: 'none',
          background: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'inherit',
        }}
      >
        ✕
      </button>
    ),
  },
}

export const Disabled: Story = {
  args: {
    value: 'Заблокировано',
    disabled: true,
  },
}
