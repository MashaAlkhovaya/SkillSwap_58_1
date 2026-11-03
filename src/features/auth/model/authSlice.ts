import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUsers } from '@/api/users'
import type { AuthUser } from '@/shared/types'
import { clearAuthUser, getAuthUser, saveAuthUser } from './authUtils'

export interface AuthState {
  user: AuthUser | null
}

export interface LoginCredentials {
  login: string
  password: string
}

const INVALID_CREDENTIALS = 'Неверный логин или пароль'

const initialState: AuthState = {
  user: getAuthUser(),
}

export const login = createAsyncThunk<AuthUser, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async ({ login: userLogin, password }, { rejectWithValue }) => {
    try {
      const users = await fetchUsers()
      const normalizedLogin = userLogin.trim()
      const found = users.find(
        (item) =>
          item.password === password &&
          (item.login === normalizedLogin || item.email === normalizedLogin),
      )

      if (!found) {
        return rejectWithValue(INVALID_CREDENTIALS)
      }

      return saveAuthUser({ id: found.id, name: found.name, email: found.email })
    } catch {
      return rejectWithValue('Не удалось загрузить список пользователей')
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  clearAuthUser()
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
    })
  },
})

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.user !== null

export default authSlice.reducer
