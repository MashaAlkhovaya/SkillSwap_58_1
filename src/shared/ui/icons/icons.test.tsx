import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { BellIcon } from './BellIcon'
import { HeartIcon } from './HeartIcon'
import { SearchIcon } from './SearchIcon'

describe('icons', () => {
  test('ставит размер и цвет', () => {
    const { container } = render(<SearchIcon size={32} color="#253017" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveStyle({ color: '#253017' })
    expect(svg?.querySelector('path')).toHaveAttribute('fill', 'currentColor')
  })

  test('filled закрашивает то же сердце', () => {
    const outline = render(<HeartIcon />)
    const filled = render(<HeartIcon filled color="#ABD27A" />)
    const outlinePath = outline.container.querySelector('path')?.getAttribute('d')
    const filledPath = filled.container.querySelector('path')?.getAttribute('d')

    expect(outlinePath).toBeTruthy()
    expect(filledPath).toBeTruthy()
    expect(filledPath).not.toEqual(outlinePath)
    expect(outlinePath?.startsWith(filledPath ?? '')).toBe(true)
    expect(filled.container.querySelector('svg')).toHaveStyle({ color: '#ABD27A' })
  })

  test('badge добавляет красный кружок на колокольчик', () => {
    const { container, rerender } = render(<BellIcon />)

    expect(container.querySelector('circle')).toBeNull()

    rerender(<BellIcon badge size={24} />)

    const circle = container.querySelector('circle')
    expect(circle).toHaveAttribute('fill', '#E0796E')
    expect(circle).toHaveAttribute('cx', '18')
    expect(circle).toHaveAttribute('cy', '6')
    expect(circle).toHaveAttribute('r', '6')
  })

  test('без подписи иконка скрыта от скринридера', () => {
    const { container, rerender } = render(<SearchIcon />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')

    rerender(<SearchIcon aria-label="Поиск" />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-label', 'Поиск')
    expect(svg).not.toHaveAttribute('aria-hidden')
  })
})
