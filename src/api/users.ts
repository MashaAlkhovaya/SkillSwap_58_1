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
): Promise<{ users: User[]; hasMore: boolean }> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    delay: sort === 'new' ? '5000' : '100',
    sort: sort,
  })
  const response = await fetch(`${BASE_URL}/users?${params}`)
  if (!response.ok) throw new Error('Failed to fetch users')
  const data: UsersResponse = await response.json()
  return { users: data.items, hasMore: data.hasMore }
}

export async function fetchUserById(id: string): Promise<User | undefined> {
  const { users } = await fetchUsers()
  return users.find((user) => user.id === id)
}
