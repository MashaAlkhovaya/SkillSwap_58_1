import { baseApi } from '@/shared/api'
import type { AuthUser } from '@/shared/types'
import type { RegistrationFormValues } from '../model/registrationSchema'

const TEXT_FIELDS: Array<Exclude<keyof RegistrationFormValues, 'avatar' | 'teachImage'>> = [
  'email',
  'password',
  'name',
  'birthDate',
  'gender',
  'city',
  'wantedCategory',
  'wantedSubCategory',
  'teachSkillName',
  'teachCategory',
  'teachSubCategory',
  'teachDescription',
]

export const buildRegistrationFormData = (values: RegistrationFormValues): FormData => {
  const formData = new FormData()

  TEXT_FIELDS.forEach((field) => formData.append(field, values[field]))

  if (values.avatar) formData.append('avatar', values.avatar)
  if (values.teachImage) formData.append('teachImage', values.teachImage)

  return formData
}

export const registrationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthUser, FormData>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useRegisterMutation } = registrationApi
