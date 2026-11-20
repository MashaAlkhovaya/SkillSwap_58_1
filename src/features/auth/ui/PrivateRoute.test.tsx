import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import authReducer, { type SessionCheckStatus } from '../model/authSlice'
import { PrivateRoute } from './PrivateRoute'

function renderPrivateRoute(sessionCheckStatus: SessionCheckStatus) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        sessionCheckStatus,
      },
    },
  })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<p>Профиль</p>} />
          </Route>

          <Route path="/login" element={<p>Страница входа</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('PrivateRoute', () => {
  it('ожидает проверки сессии и не перенаправляет на вход', () => {
    renderPrivateRoute('checking')

    expect(screen.queryByText('Страница входа')).not.toBeInTheDocument()
    expect(screen.queryByText('Профиль')).not.toBeInTheDocument()
  })

  it('показывает ошибку и кнопку повтора при сбое проверки', () => {
    renderPrivateRoute('error')

    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось проверить вход')
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument()
    expect(screen.queryByText('Страница входа')).not.toBeInTheDocument()
  })

  it('перенаправляет гостя на страницу входа', () => {
    renderPrivateRoute('idle')

    expect(screen.getByText('Страница входа')).toBeInTheDocument()
  })
})
