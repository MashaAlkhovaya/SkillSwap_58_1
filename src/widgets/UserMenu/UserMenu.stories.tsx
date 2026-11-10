import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import { UserMenu } from './UserMenu'
import * as authUtils from '@/features/auth/model/authUtils'

const meta = {
  title: 'widgets/UserMenu',
  component: UserMenu,
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '20px',
          background: 'var(--color-bg-secondary)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof UserMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Guest: Story = {
  beforeEach: () => {
    authUtils.clearAuthUser()
  },
}

export const Authorized: Story = {
  beforeEach: () => {
    localStorage.setItem(
      'skillswap_auth_user',
      JSON.stringify({
        id: '1',
        name: 'Соня',
        email: 'sonya@example.com',
        token: 'mock_token',
      }),
    )
  },
}

export const DropdownOpen: Story = {
  beforeEach: () => {
    localStorage.setItem(
      'skillswap_auth_user',
      JSON.stringify({
        id: '1',
        name: 'Соня',
        email: 's@t.com',
        token: 't',
      }),
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const menuBtn = canvas.getByLabelText('Меню пользователя')
    await userEvent.click(menuBtn)
  },
}
