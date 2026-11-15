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
  favoritesRequestId?: string | null
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
  favoritesRequestId: null,
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

export const loadFavoriteUsers = createAsyncThunk(
  'users/loadFavoriteUsers',
  async ({
    ids,
    page = 1,
    limit = 12,
    name = '',
  }: {
    ids: string[]
    page?: number
    limit?: number
    name?: string
  }) => {
    const trimmedName = name.trim()
    const data = trimmedName
      ? await fetchUsersByIds(ids, page, limit, trimmedName)
      : await fetchUsersByIds(ids, page, limit)
    return { ...data, page }
  },
  {
    condition: ({ ids, page = 1, name = '' }, { getState }) => {
      const state = (getState() as { users: UsersState }).users
      const idsKey = ids.join('\u0000')
      const searchKey = `${idsKey}\u0001${name.trim()}`
      if (ids.length === 0) return false
      if (state.isFavoritesLoading && state.favoritesIdsKey === searchKey) return false
      return page === 1 || (state.favoritesIdsKey === searchKey && state.favoritesHasMore)
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
      state.favoritesRequestId = null
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
        const searchKey = `${action.meta.arg.ids.join('\u0000')}\u0001${action.meta.arg.name?.trim() ?? ''}`
        if (state.favoritesIdsKey !== searchKey) {
          state.favoriteUsers = []
          state.favoritesPage = 0
          state.favoritesHasMore = false
        }
        state.isFavoritesLoading = true
        state.favoritesError = null
        state.favoritesIdsKey = searchKey
        state.favoritesRequestId = action.meta.requestId
      })
      .addCase(loadFavoriteUsers.fulfilled, (state, action) => {
        if (
          state.favoritesRequestId !== action.meta.requestId ||
          state.favoritesIdsKey !==
            `${action.meta.arg.ids.join('\u0000')}\u0001${action.meta.arg.name?.trim() ?? ''}`
        ) {
          return
        }
        const { users, hasMore, page } = action.payload
        state.favoriteUsers = page === 1 ? users : [...state.favoriteUsers, ...users]
        state.favoritesPage = page
        state.favoritesHasMore = hasMore
        state.isFavoritesLoading = false
        state.favoritesRequestId = null
      })
      .addCase(loadFavoriteUsers.rejected, (state, action) => {
        if (
          state.favoritesRequestId !== action.meta.requestId ||
          state.favoritesIdsKey !==
            `${action.meta.arg.ids.join('\u0000')}\u0001${action.meta.arg.name?.trim() ?? ''}`
        ) {
          return
        }
        state.isFavoritesLoading = false
        state.favoritesError = action.error.message || 'Ошибка загрузки избранных пользователей'
        state.favoritesRequestId = null
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
