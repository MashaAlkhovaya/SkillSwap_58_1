import { configureStore } from '@reduxjs/toolkit'
import { act, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { generatePath, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import authReducer, {
  type AuthState,
  setLoginInProgress,
  setSessionCheckStatus,
} from '@/features/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'
import LoginPage from './index'

vi.mock('@/widgets', () => ({
  AuthWidget: ({ returnTo }: { returnTo: string }) => (
    <div>
      Форма входа
      <output aria-label="Адрес после входа">{returnTo}</output>
    </div>
  ),
  AuthDecoration: () => <div>Оформление страницы</div>,
}))

const user = {
  id: 'user-01',
  name: 'Анна',
  email: 'anna@example.com',
  token: 'token-user-01',
}

function LocationProbe() {
  const { pathname, search, hash } = useLocation()

  return <output aria-label="Текущий адрес">{`${pathname}${search}${hash}`}</output>
}

function renderLoginPage(auth: Partial<AuthState> = {}, state?: unknown) {
  const initialAuth: AuthState = {
    user: null,
    sessionCheckStatus: 'idle',
    isLoginInProgress: false,
    ...auth,
  }

  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: initialAuth },
  })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: ROUTES.LOGIN, state }]}>
        <LocationProbe />
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.HOME} element={<p>Каталог открыт</p>} />
          <Route path="*" element={<p>Целевая страница</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

  return store
}

describe('LoginPage', () => {
  it('показывает форму и оформление неавторизованному пользователю', () => {
    renderLoginPage()

    expect(screen.getByText('Форма входа')).toBeInTheDocument()
    expect(screen.getByText('Оформление страницы')).toBeInTheDocument()
    expect(screen.getByLabelText('Текущий адрес').textContent).toBe(ROUTES.LOGIN)
  })

  it('оставляет форму на странице, пока вход ещё выполняется', () => {
    renderLoginPage({ user, isLoginInProgress: true })

    expect(screen.getByText('Форма входа')).toBeInTheDocument()
    expect(screen.queryByText('Каталог открыт')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Текущий адрес').textContent).toBe(ROUTES.LOGIN)
  })

  it('перенаправляет вошедшего пользователя при открытии страницы входа', () => {
    renderLoginPage({ user })

    expect(screen.getByText('Каталог открыт')).toBeInTheDocument()
    expect(screen.getByLabelText('Текущий адрес').textContent).toBe(ROUTES.HOME)
  })

  it('перенаправляет пользователя после завершения входа', () => {
    const store = renderLoginPage({ user, isLoginInProgress: true })

    act(() => {
      store.dispatch(setLoginInProgress(false))
    })

    expect(screen.getByText('Каталог открыт')).toBeInTheDocument()
    expect(screen.getByLabelText('Текущий адрес').textContent).toBe(ROUTES.HOME)
  })

  it('перенаправляет только после успешной проверки сохранённой сессии', () => {
    const store = renderLoginPage({ user, sessionCheckStatus: 'checking' })

    expect(screen.getByLabelText('Текущий адрес').textContent).toBe(ROUTES.LOGIN)
    expect(screen.queryByText('Форма входа')).not.toBeInTheDocument()
    expect(screen.queryByText('Каталог открыт')).not.toBeInTheDocument()

    act(() => {
      store.dispatch(setSessionCheckStatus('success'))
    })

    expect(screen.getByText('Каталог открыт')).toBeInTheDocument()
    expect(screen.getByLabelText('Текущий адрес').textContent).toBe(ROUTES.HOME)
  })

  it('показывает ошибку проверки сессии и возможность повторить попытку', () => {
    renderLoginPage({ user, sessionCheckStatus: 'error' })

    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось проверить вход')
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument()
    expect(screen.getByLabelText('Текущий адрес').textContent).toBe(ROUTES.LOGIN)
    expect(screen.queryByText('Форма входа')).not.toBeInTheDocument()
  })

  it.each([
    {
      scenario: 'на исходную страницу с параметрами и якорем',
      state: { from: `${ROUTES.PROFILE}?tab=skills#about` },
      expectedPath: `${ROUTES.PROFILE}?tab=skills#about`,
    },
    {
      scenario: 'на навык с закодированным идентификатором',
      state: { returnToSkillId: 'react/typescript' },
      expectedPath: generatePath(ROUTES.SKILL, { id: 'react%2Ftypescript' }),
    },
  ])('возвращает авторизованного пользователя $scenario', ({ state, expectedPath }) => {
    renderLoginPage({ user }, state)

    expect(screen.getByText('Целевая страница')).toBeInTheDocument()
    expect(screen.getByLabelText('Текущий адрес').textContent).toBe(expectedPath)
  })

  it('передаёт форме адрес возврата после входа', () => {
    renderLoginPage({}, { from: ROUTES.FAVORITES })

    expect(screen.getByLabelText('Адрес после входа').textContent).toBe(ROUTES.FAVORITES)
    expect(screen.getByLabelText('Текущий адрес').textContent).toBe(ROUTES.LOGIN)
  })
})
