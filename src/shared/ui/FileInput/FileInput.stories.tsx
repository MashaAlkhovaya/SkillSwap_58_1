import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileInput } from './FileInput'

const meta = {
  component: FileInput,
  args: {
    onChange: (file: File) => console.log('Файл выбран:', file.name),
  },
} satisfies Meta<typeof FileInput>

export default meta
type Story = StoryObj<typeof meta>

export const Skill: Story = {
  args: {
    variant: 'skill',
  },
}

export const Avatar: Story = {
  args: {
    variant: 'avatar',
  },
}
