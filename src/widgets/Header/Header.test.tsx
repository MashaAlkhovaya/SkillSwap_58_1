import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Header } from './index'

function renderHeader() {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
}

describe('Header', () => {
  it('показывает логотип и все ссылки с корректными адресами', () => {
    renderHeader()

    const header = within(screen.getByRole('banner'))
    const expectedLinks = [
      ['SkillSwap', ROUTES.HOME],
      ['О проекте', ROUTES.ABOUT],
      ['Все навыки', ROUTES.ALL_SKILLS],
    ] as const

    expect(header.getAllByRole('link')).toHaveLength(expectedLinks.length)

    for (const [name, href] of expectedLinks) {
      expect(header.getByRole('link', { name })).toHaveAttribute('href', href)
    }
  })

  it('показывает поле поиска с надписью "Искать навык"', () => {
    renderHeader()

    expect(screen.getByPlaceholderText('Искать навык')).toBeInTheDocument()
  })

  it('показывает кнопку войти', () => {
    renderHeader()

    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
  })

  it('показывает кнопку зарегистрироваться', () => {
    renderHeader()

    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument()
  })
})
