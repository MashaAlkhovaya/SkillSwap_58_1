import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

const getToken = (): string | null => {
  try {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)

    if (!savedUser) {
      return null
    }

    const user: unknown = JSON.parse(savedUser)

    if (
      typeof user === 'object' &&
      user !== null &&
      'token' in user &&
      typeof user.token === 'string'
    ) {
      return user.token
    }

    return null
  } catch {
    return null
  }
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = getToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: () => ({}),
})
