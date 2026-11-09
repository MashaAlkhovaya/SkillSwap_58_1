import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/shared/types'
import { clearAuthUser } from './authUtils'
import { baseApi } from '@/shared/api'

export interface AuthState {
  user: AuthUser | null
}

export interface LoginCredentials {
  email: string
  password: string
}

const initialState: AuthState = {
  user: null,
}

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  clearAuthUser()
  dispatch(baseApi.util.resetApiState())
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
    })
  },
})

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user

export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.user !== null

export const { setAuthUser } = authSlice.actions

export default authSlice.reducer
