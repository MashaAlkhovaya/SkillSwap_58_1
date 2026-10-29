import { render, screen } from '@testing-library/react'
import { truncate } from '@/shared/lib/helpers'

/**
 * Проверяет не код проекта, а сам тестовый контур: что Vitest подхватывает файлы,
 * работают globals, jsdom, матчеры jest-dom, алиас `@/` и рендер React-компонентов.
 */
describe('тесты', () => {
  it('подхватывает тест-файлы', () => {
    expect(true).toBe(true)
  })

  it('работает в jsdom', () => {
    expect(typeof document).toBe('object')
    expect(document.body).toBeDefined()
  })

  it('резолвит алиас @/', () => {
    expect(truncate('очень длинная строка', 5)).toBe('очень...')
  })

  it('рендерит компоненты и знает матчеры jest-dom', () => {
    render(<span>компонент на месте</span>)
    expect(screen.getByText('компонент на месте')).toBeInTheDocument()
  })
})
