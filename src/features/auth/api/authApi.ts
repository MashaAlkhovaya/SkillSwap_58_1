import { baseApi } from '@/shared/api'
import type { AuthUser, User } from '@/shared/types'
import type { LoginCredentials } from '../model/authSlice'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthUser, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getAuthMe: builder.query<User, void>({
      query: () => '/auth/me',
    }),
  }),
})

export const { useLoginMutation, useGetAuthMeQuery } = authApi
