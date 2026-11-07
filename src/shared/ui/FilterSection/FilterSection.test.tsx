import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FilterSection } from './FilterSection'

describe('FilterSection', () => {
  it('рендерит заголовок, если он передан', () => {
    render(
      <FilterSection title="Навыки">
        <div>Контент</div>
      </FilterSection>,
    )
    expect(screen.getByText('Навыки')).toBeInTheDocument()
  })

  it('поворачивает иконку, если isExpanded = true', () => {
    render(
      <FilterSection actionText="Все категории" isExpanded={true}>
        <div>Контент</div>
      </FilterSection>,
    )

    const icon = screen.getByTestId('chevron-icon')

    expect(icon.getAttribute('class') || '').toMatch(/rotated/)
  })

  it('не поворачивает иконку, если isExpanded = false', () => {
    render(
      <FilterSection actionText="Все категории" isExpanded={false}>
        <div>Контент</div>
      </FilterSection>,
    )

    const icon = screen.getByTestId('chevron-icon')

    expect(icon.getAttribute('class') || '').not.toMatch(/rotated/)
  })

  it('вызывает onActionClick при клике на кнопку', async () => {
    const handleActionClick = vi.fn()
    render(
      <FilterSection actionText="Все категории" onActionClick={handleActionClick}>
        <div>Контент</div>
      </FilterSection>,
    )

    screen.getByText('Все категории').click()
    expect(handleActionClick).toHaveBeenCalledTimes(1)
  })
})
