import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FilterSidebar } from './FilterSidebar'
import { INITIAL_FILTERS_STATE } from '../../shared/lib/constants'

describe('FilterSidebar', () => {
  it('вызывает setFilters при выборе режима', async () => {
    const user = userEvent.setup()
    const setFilters = vi.fn()

    render(
      <FilterSidebar filters={INITIAL_FILTERS_STATE} setFilters={setFilters} onReset={vi.fn()} />,
    )

    await user.click(screen.getByText('Хочу научиться'))
    expect(setFilters).toHaveBeenCalled()
  })

  it('показывает счетчик и кнопку сброса, если есть активные фильтры', () => {
    render(
      <FilterSidebar
        filters={{
          ...INITIAL_FILTERS_STATE,
          cities: ['Москва', 'Казань'],
        }}
        setFilters={vi.fn()}
        onReset={vi.fn()}
      />,
    )

    expect(screen.getByText('Фильтры (2)')).toBeInTheDocument()
    expect(screen.getByText('Сбросить')).toBeInTheDocument()
  })

  it('вызывает onReset при клике на кнопку сброса', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()

    render(
      <FilterSidebar
        filters={{ ...INITIAL_FILTERS_STATE, cities: ['Москва'] }}
        setFilters={vi.fn()}
        onReset={onReset}
      />,
    )

    await user.click(screen.getByText('Сбросить'))
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('вызывает setFilters с массивом городов при выборе чекбокса', async () => {
    const user = userEvent.setup()
    const setFilters = vi.fn()

    render(
      <FilterSidebar filters={INITIAL_FILTERS_STATE} setFilters={setFilters} onReset={vi.fn()} />,
    )

    await user.click(screen.getByText('Москва'))

    expect(setFilters).toHaveBeenCalled()
    const callback = setFilters.mock.calls[0][0]
    expect(callback(INITIAL_FILTERS_STATE).cities).toEqual(['Москва'])
  })
})
