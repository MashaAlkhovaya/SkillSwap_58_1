import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { baseApi } from '@/shared/api'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import ProfilePage from './index'

function renderPage() {
  const store = configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  })

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </Provider>,
  )
}

describe('ProfilePage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('отправляет профиль запросом PATCH по кнопке «Сохранить»', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      Response.json({}),
    )
    vi.stubGlobal('fetch', fetchMock)
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.AUTH_USER,
      JSON.stringify({
        id: 'user-01',
        name: 'Анна',
        email: 'anna@example.com',
        token: 'token-user-01',
      }),
    )

    renderPage()

    await user.type(screen.getByLabelText('Почта'), 'anna@example.com')
    await user.type(screen.getByLabelText('Имя'), 'Анна')
    await user.type(screen.getByLabelText('Дата рождения'), '01011990')
    await user.click(screen.getByTestId('confirm-btn'))
    fireEvent.keyDown(screen.getByLabelText('Пол'), { key: 'ArrowDown' })
    fireEvent.click(screen.getByRole('option', { name: 'Женский' }))
    fireEvent.keyDown(screen.getByLabelText('Город'), { key: 'ArrowDown' })
    fireEvent.click(screen.getByRole('option', { name: 'Москва' }))
    await user.type(screen.getByLabelText('О себе'), 'Учу рисовать')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    const input = fetchMock.mock.calls[0][0]
    if (!(input instanceof Request)) {
      throw new Error('fetch вызван без Request')
    }
    const request = input
    expect(request.method).toBe('PATCH')
    expect(request.url).toBe('http://localhost/api/auth/me')
    expect(request.headers.get('Authorization')).toBe('Bearer token-user-01')
    expect(request.headers.get('content-type')).toContain('application/json')
    expect(await request.clone().json()).toEqual({
      email: 'anna@example.com',
      name: 'Анна',
      birthDate: '1990-01-01T00:00:00.000Z',
      gender: 'female',
      city: 'Москва',
      bio: 'Учу рисовать',
    })
  })
})
