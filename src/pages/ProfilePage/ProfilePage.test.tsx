import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { baseApi } from '@/shared/api'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import ProfilePage from './index'

const profile = {
  id: 'user-01',
  name: 'Анна',
  email: 'anna@example.com',
  avatarUrl: null,
  birthDate: '1990-01-01T00:00:00.000Z',
  gender: 'female',
  city: 'Москва',
  bio: 'Учу рисовать',
  createdAt: '2020-01-01T00:00:00.000Z',
  likes: [],
  canTeach: { id: 'skill-01', category: 'business', subCategory: 'management' },
  wantsToLearn: [],
}

function renderPage() {
  const store = configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  })

  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </Provider>,
  )
}

function requestOf(input: RequestInfo | URL) {
  return input instanceof Request ? input : new Request(String(input))
}

describe('ProfilePage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('заполняет форму данными пользователя и отправляет их при сохранении', async () => {
    const user = userEvent.setup()
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.AUTH_USER,
      JSON.stringify({
        id: 'user-01',
        name: 'Анна',
        email: 'anna@example.com',
        token: 'token-user-01',
      }),
    )
    const fetchMock = vi.fn(async (_input: RequestInfo | URL) => Response.json(profile))
    vi.stubGlobal('fetch', fetchMock)

    renderPage()

    expect(await screen.findByLabelText('Почта')).toHaveValue('anna@example.com')
    expect(screen.getByLabelText('Имя')).toHaveValue('Анна')
    expect(screen.getByLabelText('Дата рождения')).toHaveValue('01.01.1990')
    expect(screen.getByText('Женский')).toBeInTheDocument()
    expect(screen.getByText('Москва')).toBeInTheDocument()
    expect(screen.getByLabelText('О себе')).toHaveValue('Учу рисовать')

    await user.click(screen.getByRole('button', { name: 'Очистить имя' }))
    await user.type(screen.getByLabelText('Имя'), 'Мария')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    await waitFor(() =>
      expect(fetchMock.mock.calls.some(([input]) => requestOf(input).method === 'PATCH')).toBe(
        true,
      ),
    )
    const patch = fetchMock.mock.calls
      .map(([input]) => requestOf(input))
      .find((request) => request.method === 'PATCH')
    if (!patch) throw new Error('PATCH не отправлен')

    expect(patch.url).toBe('http://localhost/api/auth/me')
    expect(patch.headers.get('Authorization')).toBe('Bearer token-user-01')
    expect(await patch.clone().json()).toEqual({
      email: 'anna@example.com',
      name: 'Мария',
      birthDate: '1990-01-01T00:00:00.000Z',
      gender: 'female',
      city: 'Москва',
      bio: 'Учу рисовать',
    })
  })
})
