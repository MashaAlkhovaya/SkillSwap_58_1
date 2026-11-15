import { User } from '@/shared/types/index.ts'
import { fetchUsers, fetchUsersByIds } from '@/api/users.ts'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface UsersState {
  popularUsers: User[]
  newUsers: User[]
  recommendedUsers: User[]
  favoriteUsers: User[]
  pages: Record<UserSort, number>
  hasMore: Record<UserSort, boolean>
  isPopularLoading: boolean
  isNewLoading: boolean
  isRecommendedLoading: boolean
  isFavoritesLoading: boolean
  favoritesPage: number
  favoritesHasMore: boolean
  favoritesError: string | null
  favoritesIdsKey: string
  errors: Partial<Record<UserSort, string>>
  isExpanded: boolean
}

type UserSort = 'popular' | 'new' | 'random'

const initialState: UsersState = {
  popularUsers: [],
  newUsers: [],
  recommendedUsers: [],
  favoriteUsers: [],
  pages: { popular: 0, new: 0, random: 0 },
  hasMore: { popular: true, new: true, random: true },
  isPopularLoading: false,
  isNewLoading: false,
  isRecommendedLoading: false,
  isFavoritesLoading: false,
  favoritesPage: 0,
  favoritesHasMore: false,
  favoritesError: null,
  favoritesIdsKey: '',
  errors: {},
  isExpanded: false,
}

export const loadUsers = createAsyncThunk(
  'users/load',
  async (params: { page?: number; limit?: number; sort: UserSort }) => {
    const { page = 1, limit = 9, sort } = params
    const data = await fetchUsers(page, limit, sort)
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
      return !isLoading && state.hasMore[sort] && page === state.pages[sort] + 1
    },
  },
)

export const loadFavoriteUsers = createAsyncThunk(
  'users/loadFavoriteUsers',
  async ({ ids, page = 1, limit = 12 }: { ids: string[]; page?: number; limit?: number }) => {
    const data = await fetchUsersByIds(ids, page, limit)
    return { ...data, page }
  },
  {
    condition: ({ ids, page = 1 }, { getState }) => {
      const state = (getState() as { users: UsersState }).users
      const idsKey = ids.join('\u0000')
      if (ids.length === 0) return false
      if (state.isFavoritesLoading && state.favoritesIdsKey === idsKey) return false
      return page === 1 || (state.favoritesIdsKey === idsKey && state.favoritesHasMore)
    },
  },
)

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearFavoriteUsers: (state) => {
      state.favoriteUsers = []
      state.isFavoritesLoading = false
      state.favoritesPage = 0
      state.favoritesHasMore = false
      state.favoritesError = null
      state.favoritesIdsKey = ''
    },
  },
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
    builder
      .addCase(loadUsers.pending, (state, action) => {
        const { sort } = action.meta.arg
        if (sort === 'popular') state.isPopularLoading = true
        if (sort === 'new') state.isNewLoading = true
        if (sort === 'random') state.isRecommendedLoading = true
        delete state.errors[sort]
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
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
      .addCase(loadUsers.rejected, (state, action) => {
        const { sort } = action.meta.arg
        if (sort === 'popular') state.isPopularLoading = false
        if (sort === 'new') state.isNewLoading = false
        if (sort === 'random') state.isRecommendedLoading = false
        state.errors[sort] = action.error.message || 'Ошибка загрузки пользователей'
      })
    builder
      .addCase(loadFavoriteUsers.pending, (state, action) => {
        state.isFavoritesLoading = true
        state.favoritesError = null
        state.favoritesIdsKey = action.meta.arg.ids.join('\u0000')
      })
      .addCase(loadFavoriteUsers.fulfilled, (state, action) => {
        const { users, hasMore, page } = action.payload
        state.favoriteUsers = page === 1 ? users : [...state.favoriteUsers, ...users]
        state.favoritesPage = page
        state.favoritesHasMore = hasMore
        state.isFavoritesLoading = false
      })
      .addCase(loadFavoriteUsers.rejected, (state, action) => {
        state.isFavoritesLoading = false
        state.favoritesError = action.error.message || 'Ошибка загрузки избранных пользователей'
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

export const selectFavoriteUsers = (state: { users: UsersState }) => state.users.favoriteUsers
export const selectFavoritesPage = (state: { users: UsersState }) => state.users.favoritesPage
export const selectFavoritesHasMore = (state: { users: UsersState }) => state.users.favoritesHasMore
export const selectFavoritesLoading = (state: { users: UsersState }) =>
  state.users.isFavoritesLoading
export const selectFavoritesError = (state: { users: UsersState }) => state.users.favoritesError

export const { clearFavoriteUsers } = usersSlice.actions

export default usersSlice.reducer
