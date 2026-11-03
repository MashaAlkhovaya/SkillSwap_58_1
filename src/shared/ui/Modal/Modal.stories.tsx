import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal } from './Modal'

const meta = {
  component: Modal,
  args: {
    onClose: () => {},
    isOpen: true,
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: {
    size: 'sm',
    children: <div>Маленькая модалка</div>,
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: <div>Большая модалка</div>,
  },
}
