import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiltersState, FilterMode, Gender } from '@/shared/types'
import { INITIAL_FILTERS_STATE } from '@/shared/lib/constants'
import { CITIES, SKILL_CATEGORIES } from '@/shared/lib/constants'
import type { City, SubCategoryId } from '@/shared/lib/constants'

const VALID_MODES: FilterMode[] = ['all', 'wantToLearn', 'canTeach']
const VALID_GENDERS: Gender[] = ['Мужской', 'Женский']
const VALID_CITIES = new Set<City>(CITIES)
const VALID_SKILLS = new Set<SubCategoryId>(
  SKILL_CATEGORIES.flatMap((category) => category.subcategories.map((sub) => sub.id)),
)

export const useCatalogFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: FiltersState = useMemo(() => {
    const modeParam = searchParams.get('mode')
    const mode = VALID_MODES.includes(modeParam as FilterMode)
      ? (modeParam as FilterMode)
      : INITIAL_FILTERS_STATE.mode

    const genderParam = searchParams.get('gender')
    const gender = VALID_GENDERS.includes(genderParam as Gender)
      ? (genderParam as Gender)
      : INITIAL_FILTERS_STATE.gender

    const cities = searchParams
      .getAll('city')
      .filter((city) => VALID_CITIES.has(city as City)) as City[]

    const skillIds = searchParams
      .getAll('skillId')
      .filter((skillId) => VALID_SKILLS.has(skillId as SubCategoryId)) as SubCategoryId[]
    const name = searchParams.get('name')

    return { mode, gender, cities, skillIds, name }
  }, [searchParams])

  const setFilters: React.Dispatch<React.SetStateAction<FiltersState>> = useCallback(
    (newFilters) => {
      const nextFilters = typeof newFilters === 'function' ? newFilters(filters) : newFilters

      const params = new URLSearchParams()

      if (nextFilters.mode !== 'all') {
        params.set('mode', nextFilters.mode)
      }
      if (nextFilters.gender) {
        params.set('gender', nextFilters.gender)
      }
      if (nextFilters.name) {
        params.set('name', nextFilters.name)
      }

      nextFilters.cities.forEach((city) => params.append('city', city))
      nextFilters.skillIds.forEach((skillId) => params.append('skillId', skillId))

      setSearchParams(params, { replace: true })
    },
    [filters, setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  return {
    filters,
    setFilters,
    resetFilters,
  }
}
