import type { Meta, StoryObj } from '@storybook/react-vite'
import { Header } from './index'

const meta = {
  title: 'widgets/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dark: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark">
        <Story />
      </div>
    ),
  ],
}

export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 375, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
}
