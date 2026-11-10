import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useCatalogFiltersForm, getDefaultFilterValues } from './useCatalogFiltersForm'

describe('useCatalogFiltersForm', () => {
  it('инициализируется дефолтными значениями', async () => {
    const { result } = renderHook(() => useCatalogFiltersForm())

    expect(result.current.watch()).toEqual(getDefaultFilterValues())

    const isValid = await result.current.trigger()
    expect(isValid).toBe(true)
  })

  it('корректно изменяет режим (mode)', () => {
    const { result } = renderHook(() => useCatalogFiltersForm())

    act(() => {
      result.current.setValue('mode', 'wantToLearn', { shouldValidate: true })
    })

    expect(result.current.watch('mode')).toBe('wantToLearn')
  })

  it('корректно изменяет пол (gender)', () => {
    const { result } = renderHook(() => useCatalogFiltersForm())

    act(() => {
      result.current.setValue('gender', 'Мужской', { shouldValidate: true })
    })
    expect(result.current.watch('gender')).toBe('Мужской')

    act(() => {
      result.current.setValue('gender', null, { shouldValidate: true })
    })
    expect(result.current.watch('gender')).toBeNull()
  })

  it('корректно добавляет и удаляет города (toggleCity)', () => {
    const { result } = renderHook(() => useCatalogFiltersForm())

    act(() => {
      result.current.toggleCity('Москва')
    })
    expect(result.current.watch('cities')).toEqual(['Москва'])

    act(() => {
      result.current.toggleCity('Санкт-Петербург')
    })
    expect(result.current.watch('cities')).toEqual(['Москва', 'Санкт-Петербург'])

    act(() => {
      result.current.toggleCity('Москва')
    })
    expect(result.current.watch('cities')).toEqual(['Санкт-Петербург'])
  })

  it('корректно добавляет и удаляет навыки (toggleSkill)', () => {
    const { result } = renderHook(() => useCatalogFiltersForm())

    act(() => {
      result.current.toggleSkill('team-management')
    })
    act(() => {
      result.current.toggleSkill('marketing-advertising')
    })
    expect(result.current.watch('skillIds')).toEqual(['team-management', 'marketing-advertising'])

    act(() => {
      result.current.toggleSkill('team-management')
    })
    expect(result.current.watch('skillIds')).toEqual(['marketing-advertising'])
  })

  it('сбрасывает все фильтры к начальному состоянию', () => {
    const { result } = renderHook(() => useCatalogFiltersForm())

    act(() => {
      result.current.setValue('mode', 'canTeach')
      result.current.setValue('gender', 'Женский')
      result.current.toggleCity('Казань')
      result.current.toggleSkill('english')
    })

    expect(result.current.watch()).not.toEqual(getDefaultFilterValues())

    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.watch()).toEqual(getDefaultFilterValues())
  })
})
