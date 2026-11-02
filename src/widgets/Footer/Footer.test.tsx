import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Footer } from './index'

describe('Footer', () => {
  it('показывает логотип и все ссылки с корректными адресами', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    )

    const footer = within(screen.getByRole('contentinfo'))
    const expectedLinks = [
      ['SkillSwap', ROUTES.HOME],
      ['О проекте', ROUTES.ABOUT],
      ['Все навыки', ROUTES.ALL_SKILLS],
      ['Контакты', ROUTES.CONTACTS],
      ['Блог', ROUTES.BLOG],
      ['Политика конфиденциальности', ROUTES.PRIVACY],
      ['Пользовательское соглашение', ROUTES.TERMS],
    ] as const

    expect(footer.getAllByRole('link')).toHaveLength(expectedLinks.length)

    for (const [name, href] of expectedLinks) {
      expect(footer.getByRole('link', { name })).toHaveAttribute('href', href)
    }

    expect(footer.getByText('SkillSwap — 2025')).toBeInTheDocument()
  })
})
