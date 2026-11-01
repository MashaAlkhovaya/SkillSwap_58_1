import { render, screen } from '@testing-library/react'
import { Chip } from './Chip'
import styles from './Chip.module.css'

describe('Chip', () => {
  it('без category не применяет класс business', () => {
    render(<Chip label="Йога" />)

    const chip = screen.getByText('Йога')

    expect(chip).not.toHaveClass(styles.business)
  })

  it('показывает текст label', () => {
    render(<Chip label="Медитация" />)
    expect(screen.getByText('Медитация')).toBeInTheDocument()
  })

  it('с category применяет базовый класс и класс категории', () => {
    render(<Chip label="Медитация" category="health" />)

    const chip = screen.getByText('Медитация')

    expect(chip).toHaveClass(styles.chip)
    expect(chip).toHaveClass(styles.health)
  })

  it.each(['business', 'art', 'languages', 'education', 'home-coziness', 'health'] as const)(
    'category=%s применяет свой класс',
    (category) => {
      render(<Chip label="Тест" category={category} />)

      expect(screen.getByText('Тест')).toHaveClass(styles[category])
    },
  )

  it('+N имеет базовый класс chip', () => {
    render(<Chip label="+2" />)

    expect(screen.getByText('+2')).toHaveClass(styles.chip)
  })

  it('рендерит длинный текст без ошибок', () => {
    render(<Chip label="Подготовка к экзаменам для поступления" />)

    expect(screen.getByText('Подготовка к экзаменам для поступления')).toBeInTheDocument()
  })
})
