import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { User } from '@/shared/types'
import authReducer from '@/features/auth/model/authSlice'
import { useGetAuthMeQuery } from '@/features/auth/api/authApi'
import usersReducer from '@/entities/user/model/usersSlice'
import { fetchUsersByIds } from '@/api/users'
import FavoritesPage from './index'

vi.mock('@/features/auth/api/authApi', () => ({
  useGetAuthMeQuery: vi.fn(),
}))

vi.mock('@/api/users', () => ({
  fetchUsers: vi.fn(),
  fetchUsersByIds: vi.fn(),
}))

vi.mock('@/widgets', () => ({
  CatalogSection: ({
    title,
    users,
    onLoadMore,
  }: {
    title: string
    users: User[]
    onLoadMore: () => void
  }) => (
    <section aria-label={title}>
      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
      <button type="button" onClick={onLoadMore}>
        Загрузить ещё
      </button>
    </section>
  ),
}))

const queryMock = vi.mocked(useGetAuthMeQuery)
const fetchUsersByIdsMock = vi.mocked(fetchUsersByIds)

const createUser = (id: string): User => ({
  id,
  name: `Пользователь ${id}`,
  email: `${id}@example.com`,
  avatarUrl: null,
  birthDate: '1995-02-08',
  gender: 'female',
  city: 'Москва',
  bio: '',
  createdAt: '2025-01-16T11:15:00.000Z',
  likes: [],
  canTeach: { id: `skill-${id}`, category: 'art', subCategory: 'music-sound' },
  wantsToLearn: ['acting'],
})

function renderFavoritesPage() {
  const store = configureStore({ reducer: { users: usersReducer, auth: authReducer } })
  const view = render(
    <Provider store={store}>
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    </Provider>,
  )

  return { store, ...view }
}

describe('FavoritesPage', () => {
  beforeEach(() => {
    fetchUsersByIdsMock.mockReset()
    queryMock.mockReset()
  })

  it('загружает пользователей по likes, а не запрашивает общий каталог', async () => {
    const user = createUser('user-01')
    queryMock.mockReturnValue({ data: { ...user, likes: ['user-02', 'user-03'] } } as never)
    fetchUsersByIdsMock.mockResolvedValue({ users: [createUser('user-02')], hasMore: false })

    renderFavoritesPage()

    expect(await screen.findByText('Пользователь user-02')).toBeVisible()
    await waitFor(() => {
      expect(fetchUsersByIdsMock).toHaveBeenCalledWith(['user-02', 'user-03'], 1, 12)
    })
  })

  it('показывает пустое состояние и не делает запрос каталога при пустом likes', async () => {
    queryMock.mockReturnValue({ data: { ...createUser('current'), likes: [] } } as never)

    renderFavoritesPage()

    expect(await screen.findByRole('button', { name: 'Вернуться в каталог' })).toBeVisible()
    expect(fetchUsersByIdsMock).not.toHaveBeenCalled()
  })

  it('запрашивает и отображает следующую страницу избранного', async () => {
    const user = userEvent.setup()
    queryMock.mockReturnValue({ data: { ...createUser('current'), likes: ['user-02'] } } as never)
    fetchUsersByIdsMock
      .mockResolvedValueOnce({ users: [createUser('user-02')], hasMore: true })
      .mockResolvedValueOnce({ users: [createUser('user-03')], hasMore: false })

    renderFavoritesPage()

    await screen.findByText('Пользователь user-02')
    await user.click(screen.getByRole('button', { name: 'Загрузить ещё' }))

    expect(await screen.findByText('Пользователь user-03')).toBeVisible()
    expect(fetchUsersByIdsMock).toHaveBeenNthCalledWith(2, ['user-02'], 2, 12)
  })

  it('показывает ошибку загрузки избранного', async () => {
    queryMock.mockReturnValue({ data: { ...createUser('current'), likes: ['user-02'] } } as never)
    fetchUsersByIdsMock.mockRejectedValueOnce(new Error('Ошибка сети'))

    renderFavoritesPage()

    expect(await screen.findByRole('heading', { name: /500|ошибка/i })).toBeVisible()
  })
})
