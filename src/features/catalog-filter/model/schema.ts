import { SubCategoryId } from '@/shared/lib/constants'
import { FilterMode, FiltersState, Gender } from '@/shared/types'
import * as yup from 'yup'
export const filtersSchema: yup.ObjectSchema<FiltersState> = yup.object({
  mode: yup
    .string<FilterMode>()
    .transform((value) => (value === null || value === '' ? 'all' : value))
    .oneOf(['all', 'wantToLearn', 'canTeach'])
    .default('all'),
  skillIds: yup.array().of(yup.mixed<SubCategoryId>().defined()).default([]),
  gender: yup.string<Gender>().nullable().oneOf(['Мужской', 'Женский', null]).default(null),
  cities: yup.array().of(yup.string().defined()).default([]),
})
