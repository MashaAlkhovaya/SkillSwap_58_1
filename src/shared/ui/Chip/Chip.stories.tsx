import type { Meta, StoryObj } from '@storybook/react-vite'

import { Chip } from './Chip'

const meta = {
  component: Chip,
  args: {
    label: 'Медитация',
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Business: Story = {
  args: { category: 'business' },
}

export const Art: Story = {
  args: { category: 'art' },
}

export const Languages: Story = {
  args: { category: 'languages' },
}

export const Education: Story = {
  args: { category: 'education' },
}

export const HomeCoziness: Story = {
  args: { category: 'home-coziness' },
}

export const Health: Story = {
  args: { category: 'health' },
}

export const More: Story = {
  args: { label: '+2' },
}

export const LongText: Story = {
  args: { label: 'Подготовка к экзаменам для поступления' },
}
