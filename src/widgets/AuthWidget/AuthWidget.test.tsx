import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { AuthWidget } from './AuthWidget'
import { describe, it, expect } from 'vitest'

describe('AuthWidget', () => {
  it('отображает форму входа', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthWidget />
        </MemoryRouter>
      </Provider>,
    )

    // Проверьте, что именно рендерит ваш виджет, чтобы селекторы совпали
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument()
  })
})
