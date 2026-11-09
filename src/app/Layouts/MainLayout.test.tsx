import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { MainLayout } from './MainLayout'

vi.mock('@/widgets/Header', () => ({ Header: () => <header>header</header> }))
vi.mock('@/widgets/Footer', () => ({ Footer: () => <footer>footer</footer> }))

const renderLayout = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <MainLayout />
    </MemoryRouter>,
  )

describe('MainLayout', () => {
  it('показывает Header и Footer на обычной странице', () => {
    renderLayout('/')

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('скрывает Header и Footer на /login', () => {
    renderLayout('/login')

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('скрывает Header и Footer на /register', () => {
    renderLayout('/register')

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })
})
