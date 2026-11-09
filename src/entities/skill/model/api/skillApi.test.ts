import { describe, test, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { skillApi } from './skillApi'
import { baseApi } from '@/shared/api'

const setupStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  })

globalThis.fetch = vi.fn()

describe('getSkillById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('успешный запрос', async () => {
    const mockData = { id: '1', title: 'React', description: 'Frontend library' }

    const mockResponse = {
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve(mockData),
      text: () => Promise.resolve(JSON.stringify(mockData)),
      clone: function () {
        return this
      },
    }

    ;(globalThis.fetch as any).mockResolvedValueOnce(mockResponse)

    const store = setupStore()
    const data = await store.dispatch(skillApi.endpoints.getSkillById.initiate('1')).unwrap()

    expect(data).toEqual({
      id: '1',
      title: 'React',
      description: 'Frontend library',
    })
  })

  test('неуспешный запрос (404)', async () => {
    const mockErrorResponse = {
      ok: false,
      status: 404,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({ message: 'Not found' }),
      clone: function () {
        return this
      },
    }

    ;(globalThis.fetch as any).mockResolvedValueOnce(mockErrorResponse)

    const store = setupStore()

    await expect(
      store.dispatch(skillApi.endpoints.getSkillById.initiate('999')).unwrap(),
    ).rejects.toThrow()
  })
})
