import { fireEvent, render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'
import styles from './Avatar.module.css'

describe('Avatar', () => {
  it('с валидным src рендерит img с src и alt', () => {
    render(<Avatar src="/avatar.jpg" alt="Аватар Ивана" />)

    const img = screen.getByRole('img')

    expect(img).toHaveAttribute('src', '/avatar.jpg')
    expect(img).toHaveAttribute('alt', 'Аватар Ивана')
  })

  it('при src === null ничего не рендерит', () => {
    render(<Avatar src={null} alt="Аватар" />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('при ошибке загрузки картинка исчезает', () => {
    render(<Avatar src="/broken.jpg" alt="Аватар" />)

    const img = screen.getByRole('img')
    fireEvent.error(img)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('по умолчанию применяет класс md', () => {
    render(<Avatar src="/avatar.jpg" alt="Аватар" />)

    expect(screen.getByRole('img')).toHaveClass(styles.md)
  })

  it.each(['sm', 'lg'] as const)('size=%s применяет свой класс', (size) => {
    render(<Avatar src="/avatar.jpg" alt="Аватар" size={size} />)

    expect(screen.getByRole('img')).toHaveClass(styles[size])
  })
})
