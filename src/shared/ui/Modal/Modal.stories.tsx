import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Modal } from './Modal'

const meta = {
  component: Modal,
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: {
    size: 'sm',
    children: <div>Маленькая модалка</div>,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true) // ← состояние
    return (
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {args.children}
      </Modal>
    )
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: <div>Большая модалка</div>,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true) // ← состояние
    return (
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {args.children}
      </Modal>
    )
  },
}

export const SmallClosed: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <div>
        <button onClick={() => setIsOpen(true)}>Открыть маленькую модалку</button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
          <h2>Ваше предложение создано</h2>
          <p>Теперь вы можете предложить обмен</p>
          <button onClick={() => setIsOpen(false)}>Готово</button>
        </Modal>
      </div>
    )
  },
}

export const LargeClosed: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <div>
        <button onClick={() => setIsOpen(true)}>Открыть большую модалку</button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
          <h1>Ваше предложение</h1>
          <p>Пожалуйста, проверьте и подтвердите правильность данных</p>
          <button onClick={() => setIsOpen(false)}>Редактировать</button>
          <button onClick={() => setIsOpen(false)}>Принять</button>
        </Modal>
      </div>
    )
  },
}
