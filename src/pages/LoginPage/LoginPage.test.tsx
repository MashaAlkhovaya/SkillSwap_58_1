import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import authReducer from '@/features/auth/model/authSlice'
import LoginPage from './index'

vi.mock('@/widgets', () => ({
  AuthWidget: () => <div>Форма входа</div>,
  AuthDecoration: () => <div>Оформление страницы</div>,
}))

const user = {
  id: 'user-01',
  name: 'Анна',
  email: 'anna@example.com',
  token: 'token-user-01',
}

function renderLoginPage(isLoginInProgress: boolean) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user,
        sessionCheckStatus: 'idle' as const,
        isLoginInProgress,
      },
    },
  })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<p>Каталог открыт</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('LoginPage', () => {
  it('оставляет форму на странице, пока вход ещё выполняется', () => {
    renderLoginPage(true)

    expect(screen.getByText('Форма входа')).toBeInTheDocument()
    expect(screen.queryByText('Каталог открыт')).not.toBeInTheDocument()
  })

  it('перенаправляет вошедшего пользователя при открытии страницы входа', () => {
    renderLoginPage(false)

    expect(screen.getByText('Каталог открыт')).toBeInTheDocument()
  })
})
