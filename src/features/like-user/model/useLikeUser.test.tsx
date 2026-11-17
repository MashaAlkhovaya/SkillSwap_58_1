import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { baseApi } from '@/shared/api'
import authReducer, { logout } from '@/features/auth/model/authSlice'
import { authApi } from '@/features/auth/api/authApi'
import notificationsReducer from '@/features/notifications/model/notificationsSlice'
import { saveServerAuthUser, saveUserProfile } from '@/features/auth/model/authUtils'
import type { AuthUser, User } from '@/shared/types'
import { useLikeUser } from './useLikeUser'

// ---------- Управляемая заглушка fetch (устанавливается ДО импортов проекта) ----------

const { pendingRequests, profileHolder, fetchMock, jsonResponse } = vi.hoisted(() => {
  type DeferredRequest = {
    method: string
    url: string
    headers: Headers
    resolve: (response: Response) => void
  }

  const pendingRequests: DeferredRequest[] = []

  const jsonResponse = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })

  const profileHolder = { current: null as unknown }

  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const isRequest = input instanceof Request
    const url = isRequest ? input.url : String(input)
    const method = (isRequest ? input.method : (init?.method ?? 'GET')).toUpperCase()
    const headers = isRequest ? input.headers : new Headers(init?.headers)

    if (method === 'GET' && url.includes('/auth/me')) {
      return jsonResponse(profileHolder.current)
    }

    if ((method === 'PUT' || method === 'DELETE') && url.includes('/auth/me/likes/')) {
      return new Promise<Response>((resolve) => {
        pendingRequests.push({ method, url, headers, resolve })
      })
    }

    throw new Error(`Неожиданный запрос: ${method} ${url}`)
  })

  vi.stubGlobal('fetch', fetchMock)

  return { pendingRequests, profileHolder, fetchMock, jsonResponse }
})

const likeRequestCalls = () =>
  fetchMock.mock.calls.filter(([input, init]) => {
    const url = input instanceof Request ? input.url : String(input)
    const method = (input instanceof Request ? input.method : (init?.method ?? 'GET')).toUpperCase()

    return (method === 'PUT' || method === 'DELETE') && url.includes('/auth/me/likes/')
  })

const takeLikeRequest = async (
  method: string,
  targetUserId: string,
): Promise<{
  method: string
  url: string
  headers: Headers
  resolve: (response: Response) => void
}> => {
  await waitFor(() => {
    expect(
      pendingRequests.some(
        (request) =>
          request.method === method && request.url.includes(`/auth/me/likes/${targetUserId}`),
      ),
    ).toBe(true)
  })

  const index = pendingRequests.findIndex(
    (request) =>
      request.method === method && request.url.includes(`/auth/me/likes/${targetUserId}`),
  )

  expect(index, `запрос ${method} /auth/me/likes/${targetUserId} не найден`).toBeGreaterThanOrEqual(
    0,
  )

  const [request] = pendingRequests.splice(index, 1)

  return request
}

// ---------- Фикстуры ----------

const authUser: AuthUser = {
  id: 'user-01',
  name: 'Анна',
  email: 'anna.smirnova@example.com',
  token: 'token-user-01',
}

const makeProfile = (likes: string[]): User => ({
  id: 'user-01',
  name: 'Анна',
  email: 'anna.smirnova@example.com',
  avatarUrl: null,
  birthDate: '1995-02-08T00:00:00.000Z',
  gender: 'female',
  city: 'Москва',
  bio: 'Люблю рисовать',
  createdAt: '2025-01-01T00:00:00.000Z',
  likes,
  canTeach: { id: 'skill-01', category: 'art', subCategory: 'illustration' },
  wantsToLearn: [],
})

// ---------- Стор ----------

const reducer = combineReducers({
  baseApi: baseApi.reducer,
  auth: authReducer,
  notifications: notificationsReducer,
})

type TestStore = ReturnType<typeof makeTestStore>

function makeTestStore(preloadedAuth: { user: AuthUser | null; profile: User | null }) {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    preloadedState: { auth: preloadedAuth },
  })
}

/** Ждёт появления ровно одной error-нотификации с ожидаемым сообщением */
const waitForErrorNotification = async (store: TestStore, expectedMessage: string) => {
  await waitFor(() => {
    expect(store.getState().notifications.items).toEqual([
      expect.objectContaining({ type: 'error', message: expectedMessage }),
    ])
  })
}

// ---------- Проба и рендер ----------

function LikeProbe({ targetUserId, label }: { targetUserId: string; label: string }) {
  const { isLiked, isPending, toggle } = useLikeUser(targetUserId)

  return (
    <button type="button" aria-pressed={isLiked} disabled={isPending} onClick={toggle}>
      {label}: {isLiked ? 'лайк' : 'нет лайка'}
    </button>
  )
}

function renderLikeProbes({
  targetUserIds,
  initialProfile,
  authenticated = true,
}: {
  targetUserIds: string[]
  initialProfile: User
  authenticated?: boolean
}) {
  if (authenticated) {
    saveServerAuthUser(authUser)
    saveUserProfile(initialProfile)
  }

  profileHolder.current = initialProfile

  const store = makeTestStore({
    user: authenticated ? authUser : null,
    profile: authenticated ? initialProfile : null,
  })

  function wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<>{children}</>} />
            <Route path="/login" element={<p>Страница входа</p>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  }

  const getLikes = () => {
    const cached = authApi.endpoints.getAuthMe.select()(store.getState()).data

    return {
      cached: cached?.likes,
      slice: store.getState().auth.profile?.likes,
      storage: JSON.parse(localStorage.getItem('skillswap_user_profile') ?? 'null')?.likes as
        | string[]
        | undefined,
    }
  }

  const content = (
    <>
      {targetUserIds.map((id, index) => (
        <LikeProbe key={`${id}-${index}`} targetUserId={id} label={`Карточка ${index + 1}`} />
      ))}
    </>
  )

  return { store, getLikes, ...render(content, { wrapper }) }
}

// ---------- Тесты ----------

describe('useLikeUser', () => {
  const drainPendingRequests = async () => {
    const leftovers = pendingRequests.splice(0)

    if (leftovers.length === 0) {
      return
    }

    await act(async () => {
      for (const request of leftovers) {
        request.resolve(new Response(null, { status: 201 }))
      }

      await new Promise((resolve) => setTimeout(resolve, 0))
    })
  }
  beforeEach(async () => {
    await drainPendingRequests()
    fetchMock.mockClear()
  })

  afterEach(async () => {
    await drainPendingRequests()
  })

  it('ставит лайк и синхронизирует кеш, слайс и localStorage', async () => {
    const initial = makeProfile([])
    const userEvents = userEvent.setup()
    const { store, getLikes } = renderLikeProbes({
      targetUserIds: ['user-02'],
      initialProfile: initial,
    })

    await userEvents.click(screen.getByRole('button', { name: /Карточка 1/ }))

    const request = await takeLikeRequest('PUT', 'user-02')
    expect(request.headers.get('Authorization')).toBe(`Bearer ${authUser.token}`)

    await act(async () => {
      request.resolve(new Response(null, { status: 201 }))
    })

    await waitFor(() => {
      const likes = getLikes()

      expect(likes.cached).toEqual(['user-02'])
      expect(likes.slice).toEqual(['user-02'])
      expect(likes.storage).toEqual(['user-02'])
    })

    expect(screen.getByRole('button', { name: /Карточка 1/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: /Карточка 1/ })).toBeEnabled()
    expect(JSON.parse(localStorage.getItem('skillswap_user_profile') ?? 'null')).toEqual({
      ...initial,
      likes: ['user-02'],
    })
    expect(store.getState().notifications.items).toEqual([])
  })

  it('снимает лайк и синхронизирует кеш, слайс и localStorage', async () => {
    const initial = makeProfile(['user-02'])
    const userEvents = userEvent.setup()
    const { store, getLikes } = renderLikeProbes({
      targetUserIds: ['user-02'],
      initialProfile: initial,
    })

    const button = screen.getByRole('button', { name: /Карточка 1/ })
    expect(button).toHaveAttribute('aria-pressed', 'true')

    await userEvents.click(button)

    const request = await takeLikeRequest('DELETE', 'user-02')
    expect(request.headers.get('Authorization')).toBe(`Bearer ${authUser.token}`)

    await act(async () => {
      request.resolve(new Response(null, { status: 204 }))
    })

    await waitFor(() => {
      const likes = getLikes()

      expect(likes.cached).toEqual([])
      expect(likes.slice).toEqual([])
      expect(likes.storage).toEqual([])
    })

    expect(screen.getByRole('button', { name: /Карточка 1/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(store.getState().notifications.items).toEqual([])
  })

  it('при ошибке откатывает UI, показывает тост с сообщением сервера и сохраняет другие лайки', async () => {
    const initial = makeProfile(['user-03'])
    const userEvents = userEvent.setup()
    const { store, getLikes } = renderLikeProbes({
      targetUserIds: ['user-02'],
      initialProfile: initial,
    })

    await userEvents.click(screen.getByRole('button', { name: /Карточка 1/ }))

    const request = await takeLikeRequest('PUT', 'user-02')

    await act(async () => {
      request.resolve(jsonResponse({ message: 'Внутренняя ошибка сервера' }, 500))
    })

    await waitForErrorNotification(store, 'Внутренняя ошибка сервера')
    expect(screen.getByRole('button', { name: /Карточка 1/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )

    await waitFor(() => {
      const likes = getLikes()

      expect(likes.cached).toEqual(['user-03'])
      expect(likes.slice).toEqual(['user-03'])
      expect(likes.storage).toEqual(['user-03'])
    })

    // Профиль в localStorage не перезаписан снимком с ошибкой
    expect(JSON.parse(localStorage.getItem('skillswap_user_profile') ?? 'null')).toEqual(initial)
  })

  it('при ошибке без тела показывает fallback-сообщение в тосте', async () => {
    const initial = makeProfile([])
    const userEvents = userEvent.setup()
    const { store, getLikes } = renderLikeProbes({
      targetUserIds: ['user-02'],
      initialProfile: initial,
    })

    await userEvents.click(screen.getByRole('button', { name: /Карточка 1/ }))

    const request = await takeLikeRequest('PUT', 'user-02')

    await act(async () => {
      request.resolve(new Response(null, { status: 500 }))
    })

    await waitForErrorNotification(store, 'Не удалось обновить избранное')

    await waitFor(() => {
      expect(getLikes().slice).toEqual([])
    })
  })

  it('параллельные лайки разных пользователей не затирают друг друга', async () => {
    const initial = makeProfile([])
    const userEvents = userEvent.setup()
    const { getLikes } = renderLikeProbes({
      targetUserIds: ['user-02', 'user-03'],
      initialProfile: initial,
    })

    await userEvents.click(screen.getByRole('button', { name: /Карточка 1/ }))

    // Первый запрос блокирует только свою карточку
    expect(screen.getByRole('button', { name: /Карточка 1/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Карточка 2/ })).toBeEnabled()

    await userEvents.click(screen.getByRole('button', { name: /Карточка 2/ }))
    expect(screen.getByRole('button', { name: /Карточка 2/ })).toBeDisabled()

    const requestB = await takeLikeRequest('PUT', 'user-03')
    const requestA = await takeLikeRequest('PUT', 'user-02')

    await act(async () => {
      requestB.resolve(new Response(null, { status: 201 }))
    })

    await act(async () => {
      requestA.resolve(new Response(null, { status: 201 }))
    })

    await waitFor(() => {
      const likes = getLikes()

      expect(likes.cached).toEqual(expect.arrayContaining(['user-02', 'user-03']))
      expect(likes.slice).toEqual(expect.arrayContaining(['user-02', 'user-03']))
      expect(likes.storage).toEqual(expect.arrayContaining(['user-02', 'user-03']))
    })

    expect(getLikes().slice).toHaveLength(2)
  })

  it('при параллельных запросах успех одного и ошибка другого не мешают друг другу', async () => {
    const initial = makeProfile([])
    const userEvents = userEvent.setup()
    const { store, getLikes } = renderLikeProbes({
      targetUserIds: ['user-02', 'user-03'],
      initialProfile: initial,
    })

    await userEvents.click(screen.getByRole('button', { name: /Карточка 1/ }))
    await userEvents.click(screen.getByRole('button', { name: /Карточка 2/ }))

    const requestA = await takeLikeRequest('PUT', 'user-02')
    const requestB = await takeLikeRequest('PUT', 'user-03')

    await act(async () => {
      requestA.resolve(new Response(null, { status: 201 }))
    })

    await act(async () => {
      requestB.resolve(jsonResponse({ message: 'Внутренняя ошибка сервера' }, 500))
    })

    await waitForErrorNotification(store, 'Внутренняя ошибка сервера')
    expect(screen.getByRole('button', { name: /Карточка 1/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: /Карточка 2/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )

    await waitFor(() => {
      const likes = getLikes()

      expect(likes.cached).toEqual(['user-02'])
      expect(likes.slice).toEqual(['user-02'])
      expect(likes.storage).toEqual(['user-02'])
    })
  })

  it('блокирует повторный клик по одному получателю во всех копиях карточки', async () => {
    const initial = makeProfile([])
    const userEvents = userEvent.setup()
    const { getLikes } = renderLikeProbes({
      targetUserIds: ['user-02', 'user-02'],
      initialProfile: initial,
    })

    await userEvents.click(screen.getByRole('button', { name: /Карточка 1/ }))

    expect(screen.getByRole('button', { name: /Карточка 2/ })).toBeDisabled()

    // Клик по второй копии не должен отправить второй запрос
    await userEvents.click(screen.getByRole('button', { name: /Карточка 2/ }))

    const request = await takeLikeRequest('PUT', 'user-02')

    await act(async () => {
      request.resolve(new Response(null, { status: 201 }))
    })

    await waitFor(() => {
      expect(getLikes().storage).toEqual(['user-02'])
    })

    expect(likeRequestCalls()).toHaveLength(1)
  })

  it('не сохраняет лайк, если пользователь вышел до ответа сервера', async () => {
    const initial = makeProfile(['user-03'])
    const userEvents = userEvent.setup()
    const { store } = renderLikeProbes({ targetUserIds: ['user-02'], initialProfile: initial })

    await userEvents.click(screen.getByRole('button', { name: /Карточка 1/ }))

    const request = await takeLikeRequest('PUT', 'user-02')

    await act(async () => {
      store.dispatch(logout())
      request.resolve(new Response(null, { status: 201 }))
    })

    await waitFor(() => {
      expect(store.getState().auth.profile).toBeNull()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Карточка 1/ })).toBeEnabled()
    })

    store.dispatch(baseApi.util.resetApiState())

    expect(localStorage.getItem('skillswap_user_profile')).toBeNull()
    expect(pendingRequests).toHaveLength(0)
  })
})
