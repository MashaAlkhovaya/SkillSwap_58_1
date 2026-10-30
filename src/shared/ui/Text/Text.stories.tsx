import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Text } from './Text'

const meta = {
  component: Text,
  args: {
    children: 'Все навыки',
    variant: 'sm',
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Все навыки')).toBeInTheDocument()
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text variant="sm">Все навыки — sm</Text>
      <Text variant="base">Все навыки — base</Text>
      <Text variant="lg">Все навыки — lg</Text>
      <Text variant="xl">Все навыки — xl</Text>
      <Text variant="2xl">Все навыки — 2xl</Text>
    </div>
  ),
}

export const Weights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text weight="regular">Обычное начертание</Text>
      <Text weight="medium">Среднее начертание</Text>
      <Text weight="bold">Жирное начертание</Text>
      <Text italic>Курсив</Text>
      <Text variant="sm" weight="medium">
        Все навыки
      </Text>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text color="text">Основной текст</Text>
      <Text color="secondary">Вторичный текст</Text>
      <Text color="error">Текст ошибки</Text>
      <Text color="success">Успешное действие</Text>
    </div>
  ),
}
