import { FiltersState, User } from '@/shared/types/index.ts'
import { INITIAL_FILTERS_STATE } from '@/shared/lib/constants'
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
  requestIds?: Partial<Record<UserSort, string>>
  filterKeys?: Partial<Record<UserSort, string>>
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

interface LoadUsersArgs {
  page?: number
  limit?: number
  sort: UserSort
  filters?: FiltersState
}

function filterKey(filters = INITIAL_FILTERS_STATE) {
  return JSON.stringify({
    ...filters,
    name: filters.name?.trim() || null,
    cities: [...filters.cities].sort(),
    skillIds: [...filters.skillIds].sort(),
  })
}

export const loadUsers = createAsyncThunk(
  'users/load',
  async (params: LoadUsersArgs, { signal }) => {
    const { page = 1, limit = 9, sort, filters } = params
    const data = await fetchUsers(page, limit, sort, filters, signal)
    return { users: data.users, hasMore: data.hasMore, sort, page }
  },
  {
    condition: ({ page = 1, sort, filters }, { getState }) => {
      const state = (getState() as { users: UsersState }).users
      const isLoading =
        sort === 'popular'
          ? state.isPopularLoading
          : sort === 'new'
            ? state.isNewLoading
            : state.isRecommendedLoading
      const isFirstPage = page === 1
      const isNextPage = page === state.pages[sort] + 1

      return (
        isFirstPage ||
        (!isLoading &&
          state.hasMore[sort] &&
          isNextPage &&
          state.filterKeys?.[sort] === filterKey(filters))
      )
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
      const { sort, page = 1, filters } = action.meta.arg
      state.requestIds ??= {}
      state.filterKeys ??= {}
      state.requestIds[sort] = action.meta.requestId
      state.filterKeys[sort] = filterKey(filters)
      if (sort === 'popular') state.isPopularLoading = true
      if (sort === 'new') state.isNewLoading = true
      if (sort === 'random') state.isRecommendedLoading = true
      delete state.errors[sort]
      if (page === 1) {
        state.pages[sort] = 0
        state.hasMore[sort] = true
        if (sort === 'popular') state.popularUsers = []
        if (sort === 'new') state.newUsers = []
        if (sort === 'random') state.recommendedUsers = []
      }
    })
    builder.addCase(loadUsers.fulfilled, (state, action) => {
      const { users, hasMore, sort, page } = action.payload
      if (state.requestIds?.[sort] !== action.meta.requestId) return
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
      if (state.requestIds?.[sort] !== action.meta.requestId) return
      if (sort === 'popular') state.isPopularLoading = false
      if (sort === 'new') state.isNewLoading = false
      if (sort === 'random') state.isRecommendedLoading = false
      if (!action.meta.aborted) {
        state.errors[sort] = action.error.message || 'Ошибка загрузки пользователей'
      }
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
