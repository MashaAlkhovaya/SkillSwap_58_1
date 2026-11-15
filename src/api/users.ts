import type { User } from '@/shared/types'

const BASE_URL = '/api'

interface UsersResponse {
  items: User[]
  page: number
  limit: number
  total: number
  hasMore: boolean
}

export async function fetchUsers(
  page = 1,
  limit = 10,
  sort = 'random',
  type = 'all',
  name: string = '',
): Promise<{ users: User[]; hasMore: boolean }> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    type,
    ...(name ? { name } : {}),
    delay: '100',
    sort,
  })
  const response = await fetch(`${BASE_URL}/users?${params}`)
  if (!response.ok) throw new Error('Failed to fetch users')
  const data: UsersResponse = await response.json()
  return { users: data.items, hasMore: data.hasMore }
}

export async function fetchUsersByIds(
  ids: string[],
  page = 1,
  limit = 12,
  name: string = '',
): Promise<{ users: User[]; hasMore: boolean }> {
  if (ids.length === 0) return { users: [], hasMore: false }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(name ? { name } : {}),
  })
  ids.forEach((id) => params.append('ids[]', id))

  const response = await fetch(`${BASE_URL}/users?${params}`)
  if (!response.ok) throw new Error('Не удалось загрузить избранных пользователей')

  const data: UsersResponse = await response.json()
  return { users: data.items, hasMore: data.hasMore }
}

export async function fetchUserById(id: string): Promise<User | undefined> {
  const { users } = await fetchUsers()
  return users.find((user) => user.id === id)
}
