import { render, screen } from '@testing-library/react'
import { lazy } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
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
  it('всегда показывает Header', () => {
    renderLayout('/')
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('показывает Header и Footer на обычной странице', () => {
    renderLayout('/')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('на /login скрывает Footer, Header остаётся', () => {
    renderLayout('/login')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('на /register скрывает Footer, Header остаётся', () => {
    renderLayout('/register')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('сохраняет шапку и подвал во время загрузки страницы', () => {
    const LoadingPage = lazy(() => new Promise<{ default: React.ComponentType }>(() => {}))

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LoadingPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(document.querySelector('main')).toBeInTheDocument()
  })
})
