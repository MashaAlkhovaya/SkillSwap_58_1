import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/shared/types'
import { clearAuthUser, clearUserProfile } from './authUtils'
import { baseApi } from '@/shared/api'

export type SessionCheckStatus = 'idle' | 'checking' | 'success' | 'error'

export interface AuthState {
  user: AuthUser | null
  sessionCheckStatus?: SessionCheckStatus
  isLoginInProgress?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

const initialState: AuthState = {
  user: null,
  sessionCheckStatus: 'idle',
  isLoginInProgress: false,
}

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  clearAuthUser()
  clearUserProfile()
  dispatch(baseApi.util.resetApiState())
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
    },

    setSessionCheckStatus: (state, action: PayloadAction<SessionCheckStatus>) => {
      state.sessionCheckStatus = action.payload
    },

    setLoginInProgress: (state, action: PayloadAction<boolean>) => {
      state.isLoginInProgress = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.sessionCheckStatus = 'idle'
      state.isLoginInProgress = false
    })
  },
})

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user

export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.user !== null

export const selectSessionCheckStatus = (state: { auth: AuthState }): SessionCheckStatus =>
  state.auth.sessionCheckStatus ?? 'idle'

export const selectIsLoginInProgress = (state: { auth: AuthState }): boolean =>
  state.auth.isLoginInProgress ?? false

export const { setAuthUser, setSessionCheckStatus, setLoginInProgress } = authSlice.actions

export default authSlice.reducer
