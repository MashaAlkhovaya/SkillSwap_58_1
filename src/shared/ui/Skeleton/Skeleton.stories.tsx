import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'shared/ui/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Rect: Story = {
  args: { variant: 'rect', width: 200, height: 100 },
}

export const Circle: Story = {
  args: { variant: 'circle', width: 64, height: 64 },
}

export const Text: Story = {
  args: { variant: 'text', width: '60%' },
}

export const Dark: Story = {
  args: { variant: 'rect', width: 200, height: 100 },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: 16, backgroundColor: 'var(--color-bg)' }}>
        <Story />
      </div>
    ),
  ],
}
