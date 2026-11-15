import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { useCatalogFilters } from './useCatalogFilters'
import { CITIES, SKILL_CATEGORIES } from '@/shared/lib/constants'
import { INITIAL_FILTERS_STATE } from '@/shared/lib/constants'

const renderHookWithRouter = (initialEntries: string[] = ['/']) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  )

  return renderHook(() => useCatalogFilters(), { wrapper })
}

describe('useCatalogFilters', () => {
  it('инициализируется с дефолтными значениями, если URL пустой', () => {
    const { result } = renderHookWithRouter()

    expect(result.current.filters).toEqual(INITIAL_FILTERS_STATE)
  })

  it('парсит валидные значения из URL', () => {
    const realCity = CITIES[0]
    const realSkill = SKILL_CATEGORIES[0].subcategories[0].id
    const { result } = renderHookWithRouter([
      `/?mode=wantToLearn&gender=Мужской&city=${realCity}&skillId=${realSkill}`,
    ])

    expect(result.current.filters.mode).toBe('wantToLearn')
    expect(result.current.filters.gender).toBe('Мужской')
    expect(result.current.filters.cities).toEqual([realCity])
    expect(result.current.filters.skillIds).toEqual([realSkill])
  })

  it('поддерживает несколько городов и навыков (повторение параметра)', () => {
    const realCity1 = CITIES[0]
    const realCity2 = CITIES[1]
    const realSkill1 = SKILL_CATEGORIES[0].subcategories[0].id
    const realSkill2 = SKILL_CATEGORIES[1].subcategories[0].id
    const { result } = renderHookWithRouter([
      `/?city=${realCity1}&city=${realCity2}&skillId=${realSkill1}&skillId=${realSkill2}`,
    ])

    expect(result.current.filters.cities).toEqual([realCity1, realCity2])
    expect(result.current.filters.skillIds).toEqual([realSkill1, realSkill2])
  })

  it('отбрасывает невалидные значения из URL', () => {
    const { result } = renderHookWithRouter([
      '/?mode=invalid&gender=invalid&city=InvalidCity&skillId=invalidSkill',
    ])

    expect(result.current.filters.mode).toBe('all')
    expect(result.current.filters.gender).toBeNull()
    expect(result.current.filters.cities).toEqual([])
    expect(result.current.filters.skillIds).toEqual([])
  })

  it('обновляет URL при вызове setFilters', () => {
    const { result } = renderHookWithRouter()
    const newCity = CITIES[0]
    const newSkill = SKILL_CATEGORIES[0].subcategories[0].id

    act(() => {
      result.current.setFilters({
        mode: 'canTeach',
        gender: 'Женский',
        cities: [newCity],
        skillIds: [newSkill],
      })
    })

    expect(result.current.filters.mode).toBe('canTeach')
    expect(result.current.filters.gender).toBe('Женский')
    expect(result.current.filters.cities).toEqual([newCity])
    expect(result.current.filters.skillIds).toEqual([newSkill])
  })

  it('сбрасывает фильтры и очищает URL', () => {
    const realCity = CITIES[0]
    const { result } = renderHookWithRouter([`/?mode=wantToLearn&city=${realCity}`])

    expect(result.current.filters.mode).toBe('wantToLearn')

    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.filters).toEqual(INITIAL_FILTERS_STATE)
  })
})
