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

const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: isTest ? 'http://localhost/api' : '/api',
    prepareHeaders: (headers) => {
      const token = getToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Skill'],
  endpoints: () => ({}),
})
