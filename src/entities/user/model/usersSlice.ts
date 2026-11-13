import { User } from '@/shared/types/index.ts'
import { fetchUsers } from '@/api/users.ts'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface UsersState {
  popularUsers: User[]
  newUsers: User[]
  recommendedUsers: User[]
  pages: Record<UserSort, number>
  hasMore: Record<UserSort, boolean>
  isPopularLoading: boolean
  isNewLoading: boolean
  isRecommendedLoading: boolean
  errors: Partial<Record<UserSort, string>>
  isExpanded: boolean
}

type UserSort = 'popular' | 'new' | 'random'

const initialState: UsersState = {
  popularUsers: [],
  newUsers: [],
  recommendedUsers: [],
  pages: { popular: 0, new: 0, random: 0 },
  hasMore: { popular: true, new: true, random: true },
  isPopularLoading: false,
  isNewLoading: false,
  isRecommendedLoading: false,
  errors: {},
  isExpanded: false,
}

export const loadUsers = createAsyncThunk(
  'users/load',
  async (params: {
    page?: number
    limit?: number
    sort: UserSort
    type?: string
    name?: string
  }) => {
    const { page = 1, limit = 9, sort, type = 'all', name = '' } = params
    const data = await fetchUsers(page, limit, sort, type, name.trim())
    return { users: data.users, hasMore: data.hasMore, sort, page }
  },
  {
    condition: ({ page = 1, sort }, { getState }) => {
      const state = (getState() as { users: UsersState }).users
      const isLoading =
        sort === 'popular'
          ? state.isPopularLoading
          : sort === 'new'
            ? state.isNewLoading
            : state.isRecommendedLoading
      return !isLoading && (page === 1 || (state.hasMore[sort] && page === state.pages[sort] + 1))
    },
  },
)

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  selectors: {
    selectPopularUsers: (state) => state.popularUsers,
    selectNewUsers: (state) => state.newUsers,
    selectRecommendedUsers: (state) => state.recommendedUsers,
    selectUsersPages: (state) => state.pages,
    selectUsersHasMore: (state) => state.hasMore,
    selectPopularLoading: (state) => state.isPopularLoading,
    selectNewLoading: (state) => state.isNewLoading,
    selectRecommendedLoading: (state) => state.isRecommendedLoading,
    selectUsersErrors: (state) => state.errors,
  },
  extraReducers: (builder) => {
    builder.addCase(loadUsers.pending, (state, action) => {
      const { sort } = action.meta.arg
      if (sort === 'popular') state.isPopularLoading = true
      if (sort === 'new') state.isNewLoading = true
      if (sort === 'random') state.isRecommendedLoading = true
      delete state.errors[sort]
    })
    builder.addCase(loadUsers.fulfilled, (state, action) => {
      const { users, hasMore, sort, page } = action.payload
      if (sort === 'popular') {
        state.popularUsers = page === 1 ? users : [...state.popularUsers, ...users]
      }
      if (sort === 'new') {
        state.newUsers = page === 1 ? users : [...state.newUsers, ...users]
      }
      if (sort === 'random') {
        state.recommendedUsers = page === 1 ? users : [...state.recommendedUsers, ...users]
      }
      state.pages[sort] = page
      state.hasMore[sort] = hasMore
      if (sort === 'popular') state.isPopularLoading = false
      if (sort === 'new') state.isNewLoading = false
      if (sort === 'random') state.isRecommendedLoading = false
    })
    builder.addCase(loadUsers.rejected, (state, action) => {
      const { sort } = action.meta.arg
      if (sort === 'popular') state.isPopularLoading = false
      if (sort === 'new') state.isNewLoading = false
      if (sort === 'random') state.isRecommendedLoading = false
      state.errors[sort] = action.error.message || 'Ошибка загрузки пользователей'
    })
  },
})

export const {
  selectPopularUsers,
  selectNewUsers,
  selectRecommendedUsers,
  selectUsersPages,
  selectUsersHasMore,
  selectPopularLoading,
  selectNewLoading,
  selectRecommendedLoading,
  selectUsersErrors,
} = usersSlice.selectors

export default usersSlice.reducer
