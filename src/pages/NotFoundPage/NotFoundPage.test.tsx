import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFoundPage from './index'
import { vi, describe, it, expect } from 'vitest'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('NotFoundPage', () => {
  it('отображает заголовок 404 и текст', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Страница не найдена/i)).toBeInTheDocument()
  })

  it('вызывает navigate при клике на кнопку "На главную"', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )
    const button = screen.getByRole('button', { name: /На главную/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
