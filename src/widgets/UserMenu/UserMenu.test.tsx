import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { UserMenu } from './UserMenu'
import * as authUtils from '@/features/auth/model/authUtils'

const mockedNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  }
})

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('показывает кнопку "Войти" и не показывает иконки уведомлений для гостя', () => {
    vi.spyOn(authUtils, 'getAuthUser').mockReturnValue(null)

    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>,
    )

    expect(screen.getByText('Войти')).toBeInTheDocument()
    expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument()

    expect(screen.queryByLabelText('Уведомления')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Избранное')).not.toBeInTheDocument()
  })

  it('показывает имя пользователя и иконки уведомлений', () => {
    vi.spyOn(authUtils, 'getAuthUser').mockReturnValue({
      id: '1',
      name: 'Соня',
      email: 's@t.com',
      token: 't',
    })

    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>,
    )

    expect(screen.getByText('Соня')).toBeInTheDocument()
    expect(screen.getByLabelText('Уведомления')).toBeInTheDocument()

    const favLink = screen.getByLabelText('Избранное')
    expect(favLink).toHaveAttribute('href', '/favorites')
  })

  it('открывает дропдаун по клику на триггер', () => {
    vi.spyOn(authUtils, 'getAuthUser').mockReturnValue({
      id: '1',
      name: 'Соня',
      email: 's@t.com',
      token: 't',
    })

    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByLabelText('Меню пользователя'))

    expect(screen.getByText('Личный кабинет')).toBeInTheDocument()
    expect(screen.getByText('Выйти из аккаунта')).toBeInTheDocument()
  })

  it('вызывает logout и редирект при клике на "Выйти из аккаунта"', () => {
    vi.spyOn(authUtils, 'getAuthUser').mockReturnValue({
      id: '1',
      name: 'Соня',
      email: 's@t.com',
      token: 't',
    })
    const clearSpy = vi.spyOn(authUtils, 'clearAuthUser').mockImplementation(() => {})

    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByLabelText('Меню пользователя'))
    fireEvent.click(screen.getByText('Выйти из аккаунта'))

    expect(clearSpy).toHaveBeenCalledTimes(1)
    expect(mockedNavigate).toHaveBeenCalledWith('/')
  })

  it('переключает тему по клику на луну', () => {
    vi.spyOn(authUtils, 'getAuthUser').mockReturnValue(null)

    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>,
    )

    const themeBtn = screen.getByLabelText(/Включить темную тему/i)
    fireEvent.click(themeBtn)

    expect(localStorage.getItem('skillswap_theme')).toBe('dark')
  })
})
