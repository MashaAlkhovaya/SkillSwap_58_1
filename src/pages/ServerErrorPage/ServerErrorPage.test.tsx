import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ServerErrorPage from './index'
import { describe, it, expect } from 'vitest'

describe('ServerErrorPage', () => {
  it('отображает сообщение об ошибке сервера', () => {
    render(
      <MemoryRouter>
        <ServerErrorPage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/На сервере произошла ошибка/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Попробуйте позже или вернитесь на главную страницу/i),
    ).toBeInTheDocument()
  })
})
