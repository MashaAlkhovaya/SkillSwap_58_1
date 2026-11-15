import type { FiltersState, User } from '@/shared/types'

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
  filters?: FiltersState,
): Promise<{ users: User[]; hasMore: boolean; total: number }> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    delay: '100',
    sort: sort,
  })

  if (filters) {
    if (filters.mode !== 'all') {
      const typeMap: Record<string, string> = {
        wantToLearn: 'learn',
        canTeach: 'teach',
      }
      const typeValue = typeMap[filters.mode]
      if (typeValue) {
        params.append('type', typeValue)
      }
    }
    if (filters.gender) {
      const genderMap: Record<string, string> = {
        Мужской: 'male',
        Женский: 'female',
      }
      const genderValue = genderMap[filters.gender]
      if (genderValue) {
        params.append('gender', genderValue)
      }
    }
    filters.cities.forEach((city) => params.append('city', city))
    filters.skillIds.forEach((skillId) => params.append('subCategoryId[]', skillId))
  }

  const response = await fetch(`${BASE_URL}/users?${params}`)
  if (!response.ok) throw new Error('Failed to fetch users')
  const data: UsersResponse = await response.json()
  return { users: data.items, hasMore: data.hasMore, total: data.total }
}

export async function fetchUserById(id: string): Promise<User | undefined> {
  const { users } = await fetchUsers()
  return users.find((user) => user.id === id)
}
