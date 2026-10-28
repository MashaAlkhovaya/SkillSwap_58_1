import { User } from '@/shared/types/index.ts'
import { fetchUsers } from '@/api/users.ts'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface UsersState {
  users: User[]
  isLoading: boolean
  error: string | null
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
}

export const loadUsers = createAsyncThunk('users/load', async () => {
  const data = await fetchUsers()
  return data
})

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  selectors: {
    selectUsers: (state) => state.users,
    selectUsersLoading: (state) => state.isLoading,
    selectUsersError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder.addCase(loadUsers.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(loadUsers.fulfilled, (state, action) => {
      state.isLoading = false
      state.users = action.payload
    })
    builder.addCase(loadUsers.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Ошибка загрузки пользователей'
    })
  },
})

export const { selectUsers, selectUsersLoading, selectUsersError } = usersSlice.selectors

export default usersSlice.reducer
