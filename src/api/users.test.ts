import { beforeEach, describe, expect, it, vi } from 'vitest'
import { INITIAL_FILTERS_STATE } from '@/shared/lib/constants'
import type { FilterMode } from '@/shared/types'
import { fetchUsers } from './users'

const fetchMock = vi.fn()

describe('fetchUsers query parameters', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], page: 1, limit: 10, total: 0, hasMore: false }),
    })
    vi.stubGlobal('fetch', fetchMock)
  })

  it.each<[FilterMode, string]>([
    ['all', 'all'],
    ['wantToLearn', 'learn'],
    ['canTeach', 'teach'],
  ])('передаёт режим %s как type=%s', async (mode, type) => {
    await fetchUsers(1, 10, 'popular', { ...INITIAL_FILTERS_STATE, mode })

    const url = new URL(fetchMock.mock.calls[0][0], 'http://localhost')
    expect(url.searchParams.get('type')).toBe(type)
  })

  it('кодирует name в URL и восстанавливает исходное значение при чтении параметров', async () => {
    const name = 'Музыка & звук + C++'
    await fetchUsers(1, 10, 'popular', { ...INITIAL_FILTERS_STATE, name })

    const requestUrl = String(fetchMock.mock.calls[0][0])
    const url = new URL(requestUrl, 'http://localhost')
    expect(requestUrl).toContain(`name=${new URLSearchParams({ name }).toString().slice(5)}`)
    expect(url.searchParams.get('name')).toBe(name)
    expect(url.searchParams.size).toBe(6)
  })

  it('не передаёт пустой name в запросе', async () => {
    await fetchUsers(1, 10, 'popular', { ...INITIAL_FILTERS_STATE, name: '' })

    const url = new URL(fetchMock.mock.calls[0][0], 'http://localhost')
    expect(url.searchParams.has('name')).toBe(false)
  })
})
