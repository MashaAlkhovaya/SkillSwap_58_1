import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const getToken = (): string | null => {
  return localStorage.getItem('token')
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
