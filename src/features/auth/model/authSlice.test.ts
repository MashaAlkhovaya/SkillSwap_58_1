import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchUsers } from '@/api/users'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { User } from '@/shared/types'
import authReducer, { login, logout, selectAuthUser, selectIsAuthenticated } from './authSlice'

vi.mock('@/api/users', () => ({
  fetchUsers: vi.fn(),
}))

const user = {
  id: 'user-01',
  name: 'Анна',
  email: 'anna.smirnova@example.com',
  password: 'SkillSwapMock2025!',
} as User & { password: string }

const savedUser = {
  id: 'user-01',
  name: 'Анна',
  email: 'anna.smirnova@example.com',
  token: 'mock_token_user-01',
}

function createStore() {
  return configureStore({
    reducer: { auth: authReducer },
  })
}

describe('login', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(fetchUsers).mockReset()
  })

  it('находит пользователя по email и паролю и сохраняет сессию', async () => {
    vi.mocked(fetchUsers).mockResolvedValue([user])
    const store = createStore()

    await store.dispatch(login({ email: user.email, password: user.password }))

    expect(selectAuthUser(store.getState())).toEqual(savedUser)
    expect(selectIsAuthenticated(store.getState())).toBe(true)
    expect(store.getState().auth).toEqual({ user: savedUser })
    expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER) ?? 'null')).toEqual(
      savedUser,
    )
  })

  it('сравнивает email без пробелов и без учёта регистра', async () => {
    vi.mocked(fetchUsers).mockResolvedValue([user])
    const store = createStore()

    await store.dispatch(login({ email: '  ANNA.SMIRNOVA@EXAMPLE.COM  ', password: user.password }))

    expect(selectAuthUser(store.getState())).toEqual(savedUser)
  })

  it('не принимает старый логин вместо email', async () => {
    vi.mocked(fetchUsers).mockResolvedValue([user])
    const store = createStore()

    const result = await store.dispatch(login({ email: 'anna.smirnova', password: user.password }))

    expect(login.rejected.match(result)).toBe(true)
    if (login.rejected.match(result)) {
      expect(result.payload).toBe('Неверный логин или пароль')
    }
    expect(selectAuthUser(store.getState())).toBeNull()
  })

  it('возвращает ошибку, если email или пароль не совпадают', async () => {
    vi.mocked(fetchUsers).mockResolvedValue([user])
    const store = createStore()

    const result = await store.dispatch(login({ email: user.email, password: 'wrong' }))

    expect(login.rejected.match(result)).toBe(true)
    if (login.rejected.match(result)) {
      expect(result.payload).toBe('Неверный логин или пароль')
    }
    expect(store.getState().auth).toEqual({ user: null })
    expect(selectIsAuthenticated(store.getState())).toBe(false)
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()
  })

  it('возвращает ошибку, если users.json не загрузился', async () => {
    vi.mocked(fetchUsers).mockRejectedValue(new Error('Failed to fetch users'))
    const store = createStore()

    const result = await store.dispatch(login({ email: user.email, password: user.password }))

    expect(login.rejected.match(result)).toBe(true)
    if (login.rejected.match(result)) {
      expect(result.payload).toBe('Не удалось загрузить список пользователей')
    }
    expect(store.getState().auth).toEqual({ user: null })
  })

  it('очищает сессию при выходе', async () => {
    vi.mocked(fetchUsers).mockResolvedValue([user])
    const store = createStore()

    await store.dispatch(login({ email: user.email, password: user.password }))
    await store.dispatch(logout())

    expect(selectAuthUser(store.getState())).toBeNull()
    expect(selectIsAuthenticated(store.getState())).toBe(false)
    expect(store.getState().auth).toEqual({ user: null })
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()
  })

  it('не пишет в localStorage из редьюсера', () => {
    const store = createStore()

    store.dispatch(
      login.fulfilled(savedUser, 'request', { email: user.email, password: user.password }),
    )

    expect(selectAuthUser(store.getState())).toEqual(savedUser)
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()

    store.dispatch(logout.fulfilled(undefined, 'request'))

    expect(store.getState().auth).toEqual({ user: null })
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()
  })
})

describe('начальное состояние', () => {
  it('восстанавливает сессию из localStorage', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(savedUser))
    vi.resetModules()

    const slice = await import('./authSlice')
    const store = configureStore({ reducer: { auth: slice.default } })

    expect(slice.selectAuthUser(store.getState())).toEqual(savedUser)
    expect(slice.selectIsAuthenticated(store.getState())).toBe(true)
  })
})
