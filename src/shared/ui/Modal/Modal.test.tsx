import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('рендерит children', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Контент</p>
      </Modal>,
    )
    expect(screen.getByText('Контент')).toBeInTheDocument()
  })

  it('вызывает onClose по клику на оверлей', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Контент</p>
      </Modal>,
    )
    fireEvent.click(screen.getByTestId('modal-overlay'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('не закрывает при клике внутри модалки', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Контент</p>
      </Modal>,
    )
    fireEvent.click(screen.getByText('Контент'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('закрывает по ESC', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Контент</p>
      </Modal>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
