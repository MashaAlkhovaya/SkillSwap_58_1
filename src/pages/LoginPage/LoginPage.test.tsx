import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './index'
import { useAppSelector } from '@/store/hooks'
import { vi, describe, it, expect } from 'vitest'

vi.mock('@/store/hooks', () => ({
  useAppSelector: vi.fn(),
}))

vi.mock('@/widgets', () => ({
  AuthWidget: () => <div data-testid="auth-widget">Auth Form</div>,
  AuthDecoration: () => <div data-testid="auth-decoration">Decoration</div>,
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('корректно рендерит страницу, если пользователь не авторизован', () => {
    vi.mocked(useAppSelector).mockReturnValue(false)
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('auth-widget')).toBeInTheDocument()
    expect(screen.getByTestId('auth-decoration')).toBeInTheDocument()
  })

  it('делает редирект (рендерит Navigate), если пользователь уже авторизован', () => {
    vi.mocked(useAppSelector).mockReturnValue(true)

    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.queryByTestId('auth-widget')).not.toBeInTheDocument()
    expect(screen.queryByTestId('auth-decoration')).not.toBeInTheDocument()
  })
})
