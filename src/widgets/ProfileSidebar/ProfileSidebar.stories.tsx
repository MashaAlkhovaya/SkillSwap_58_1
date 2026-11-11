import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProfileSidebar } from './ProfileSidebar'

const meta = {
  title: 'Widgets/ProfileSidebar',
  component: ProfileSidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 36, background: 'var(--color-bg)', minHeight: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProfileSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const PersonalData: Story = {
  args: {
    activeItemId: 'personal',
  },
}

export const WithoutActiveItem: Story = {}
