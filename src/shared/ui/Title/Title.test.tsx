import { render, screen } from '@testing-library/react'
import { Title } from './Title'
import styles from './Title.module.css'

describe('Title', () => {
  it.each([1, 2, 3, 4] as const)('level=%i рендерит заголовок нужного уровня', (level) => {
    render(<Title level={level}>Заголовок</Title>)
    const heading = screen.getByRole('heading', { level })
    expect(heading.tagName).toBe(`H${level}`)
    expect(heading).toHaveTextContent('Заголовок')
  })

  it('по умолчанию размер совпадает с уровнем', () => {
    render(<Title level={3}>Текст</Title>)
    expect(screen.getByRole('heading', { level: 3 })).toHaveClass(styles.size3)
  })

  it('size меняет оформление, но не тег', () => {
    render(
      <Title level={1} size={2}>
        Все навыки
      </Title>,
    )
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass(styles.size2)
    expect(heading).not.toHaveClass(styles.size1)
  })

  it('пробрасывает className и html-атрибуты', () => {
    render(
      <Title level={2} className="custom" id="section-title">
        Текст
      </Title>,
    )
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveClass('custom')
    expect(heading).toHaveAttribute('id', 'section-title')
  })
})
