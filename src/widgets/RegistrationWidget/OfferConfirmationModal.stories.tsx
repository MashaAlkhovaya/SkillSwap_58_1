import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/shared/ui'
import { OfferConfirmationModal } from './OfferConfirmationModal'

const meta: Meta<typeof OfferConfirmationModal> = {
  title: 'Widgets/RegistrationWidget/OfferConfirmationModal',
  component: OfferConfirmationModal,
}

export default meta
type Story = StoryObj<typeof OfferConfirmationModal>

/** Заглушка контента: свой виджет верстает другой разработчик */
const MockOfferContent = () => (
  <div style={{ padding: 24, background: '#f5f5f5', borderRadius: 12 }}>
    Здесь будет виджет с описанием навыка и галереей
  </div>
)

/** Модалка открыта по умолчанию — для визуальной сверки с макетом */
export const Opened: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
    children: <MockOfferContent />,
  },
}

/** Сценарий открытия: кнопка «Продолжить» открывает модалку */
export const WithOpenScenario: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onConfirm: () => {},
    children: <MockOfferContent />,
  },
  render: (args) => {
    const [isOpen, setOpen] = useState(false)
    return (
      <>
        <Button variant="primary" size="md" onClick={() => setOpen(true)}>
          Продолжить
        </Button>
        <OfferConfirmationModal
          {...args}
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    )
  },
}
