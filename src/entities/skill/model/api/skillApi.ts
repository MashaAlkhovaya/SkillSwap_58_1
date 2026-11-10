import { baseApi } from '@/shared/api'
import type { Skill } from '@/shared/types'

export const skillApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSkillById: builder.query<Skill, string>({
      query: (id) => `/skills/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Skill', id }],
    }),
  }),
})

export const { useGetSkillByIdQuery } = skillApi
