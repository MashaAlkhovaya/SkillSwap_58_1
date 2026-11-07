import type { Meta, StoryObj } from '@storybook/react-vite'
import { AuthWidget } from './AuthWidget'

const meta = {
  title: 'widgets/AuthWidget',
  component: AuthWidget,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AuthWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
}
