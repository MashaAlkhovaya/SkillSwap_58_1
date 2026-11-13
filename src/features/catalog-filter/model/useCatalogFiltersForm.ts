import { FiltersState } from '@/shared/types'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { filtersSchema } from './schema'
import { SubCategoryId } from '@/shared/lib/constants'

export const getDefaultFilterValues = (): FiltersState => ({
  mode: 'all',
  skillIds: [],
  gender: null,
  cities: [],
  name: null,
})

const SET_VALUE_OPTIONS = { shouldValidate: true, shouldDirty: true } as const

const toggleInArray = <T>(array: T[], value: T): T[] =>
  array.includes(value) ? array.filter((item) => item !== value) : [...array, value]

export const useCatalogFiltersForm = () => {
  const form = useForm<FiltersState>({
    resolver: yupResolver(filtersSchema),
    defaultValues: getDefaultFilterValues(),
    mode: 'onChange',
  })

  const { setValue, getValues, reset } = form

  const toggleCity = (city: string) => {
    setValue('cities', toggleInArray(getValues('cities'), city), SET_VALUE_OPTIONS)
  }

  const toggleSkill = (skillId: SubCategoryId) => {
    setValue('skillIds', toggleInArray(getValues('skillIds'), skillId), SET_VALUE_OPTIONS)
  }

  const resetFilters = () => {
    reset(getDefaultFilterValues())
  }
  return {
    ...form,
    toggleCity,
    toggleSkill,
    resetFilters,
  }
}
