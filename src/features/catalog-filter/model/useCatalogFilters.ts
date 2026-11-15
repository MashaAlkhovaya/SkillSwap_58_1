import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiltersState, FilterMode, Gender } from '@/shared/types'
import { INITIAL_FILTERS_STATE } from '@/shared/lib/constants'
import { CITIES, SKILL_CATEGORIES } from '@/shared/lib/constants'
import type { City, SubCategoryId } from '@/shared/lib/constants'

const VALID_CITIES = new Set<City>(CITIES)
const VALID_SKILLS = new Set<SubCategoryId>(
  SKILL_CATEGORIES.flatMap((category) => category.subcategories.map((sub) => sub.id)),
)

const MODE_TO_TYPE: Record<string, string> = {
  wantToLearn: 'learn',
  canTeach: 'teach',
}
const TYPE_TO_MODE: Record<string, FilterMode> = {
  learn: 'wantToLearn',
  teach: 'canTeach',
}

const GENDER_TO_URL: Record<string, string> = {
  Мужской: 'male',
  Женский: 'female',
}
const URL_TO_GENDER: Record<string, Gender> = {
  male: 'Мужской',
  female: 'Женский',
}

export const useCatalogFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: FiltersState = useMemo(() => {
    const typeParam = searchParams.get('type')
    const mode = (typeParam && TYPE_TO_MODE[typeParam]) || INITIAL_FILTERS_STATE.mode

    const genderParam = searchParams.get('gender')
    const gender = (genderParam && URL_TO_GENDER[genderParam]) || INITIAL_FILTERS_STATE.gender

    const cities = searchParams
      .getAll('city')
      .filter((city) => VALID_CITIES.has(city as City)) as City[]

    const skillIds = searchParams
      .getAll('subCategoryId[]')
      .filter((skillId) => VALID_SKILLS.has(skillId as SubCategoryId)) as SubCategoryId[]

    const search = searchParams.get('q') || null

    return { mode, gender, cities, skillIds, search }
  }, [searchParams])

  const setFilters: React.Dispatch<React.SetStateAction<FiltersState>> = useCallback(
    (newFilters) => {
      const nextFilters = typeof newFilters === 'function' ? newFilters(filters) : newFilters

      const params = new URLSearchParams()

      if (nextFilters.mode !== 'all') {
        const typeValue = MODE_TO_TYPE[nextFilters.mode]
        if (typeValue) params.set('type', typeValue)
      }
      if (nextFilters.gender) {
        const genderValue = GENDER_TO_URL[nextFilters.gender]
        if (genderValue) params.set('gender', genderValue)
      }
      if (nextFilters.search) {
        params.set('q', nextFilters.search)
      }

      nextFilters.cities.forEach((city) => params.append('city', city))
      nextFilters.skillIds.forEach((skillId) => params.append('subCategoryId[]', skillId))

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
