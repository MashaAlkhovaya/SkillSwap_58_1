import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dropdown } from './index'

const meta = {
  title: 'shared/ui/Dropdown',
  component: Dropdown,
  args: {
    trigger: 'Открыть меню',
    triggerLabel: 'Открыть меню',
    children: (_close: () => void) => <p>Содержимое выпадающей панели</p>,
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Profile: Story = {
  args: {
    trigger: 'Профиль ▾',
    triggerLabel: 'Открыть меню профиля',
    children: (close) => (
      <div style={{ display: 'grid', gap: 16 }}>
        <a href="/profile" onClick={close}>
          Личный кабинет
        </a>
        <button type="button" onClick={close}>
          Выйти из аккаунта
        </button>
      </div>
    ),
  },
}

export const NearRightEdge: Story = {
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
        <Story />
      </div>
    ),
  ],
}

export const LargeContent: Story = {
  args: {
    trigger: 'Все навыки ▾',
    triggerLabel: 'Открыть список навыков',
    children: () => (
      <div style={{ width: 1000, maxWidth: '100%' }}>
        {Array.from({ length: 30 }, (_, index) => (
          <p key={index}>Пример категории {index + 1}</p>
        ))}
      </div>
    ),
  },
}
