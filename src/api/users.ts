import type { User } from '@/shared/types'

const BASE_URL = '/api'

interface UsersResponse {
  items: User[]
  page: number
  limit: number
  total: number
  hasMore: boolean
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users?delay=2000`)
  if (!response.ok) throw new Error('Failed to fetch users')
  const data: UsersResponse = await response.json()
  return data.items
}

export async function fetchUserById(id: string): Promise<User | undefined> {
  const users = await fetchUsers()
  return users.find((user) => user.id === id)
}
