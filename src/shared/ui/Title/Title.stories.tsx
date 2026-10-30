import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Title } from './index'

const meta = {
  title: 'shared/ui/Title',
  component: Title,
  args: {
    level: 2,
    children: 'Все навыки',
  },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3, 4] },
    size: { control: 'inline-radio', options: [1, 2, 3, 4] },
  },
} satisfies Meta<typeof Title>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Все уровни одним списком */
export const AllLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {([1, 2, 3, 4] as const).map((level) => (
        <Title key={level} level={level}>
          Заголовок H{level}
        </Title>
      ))}
    </div>
  ),
}

/** Тег h1, но визуально — как H2 */
export const SizeDifferentFromLevel: Story = {
  args: { level: 1, size: 2, children: 'Семантический h1 размера H2' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1 })).toBeInTheDocument()
  },
}
