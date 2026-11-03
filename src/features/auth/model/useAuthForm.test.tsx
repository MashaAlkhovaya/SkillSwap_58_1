import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchUsers } from '@/api/users'
import type { User } from '@/shared/types'
import authReducer from './authSlice'
import { useAuthForm } from './useAuthForm'

vi.mock('@/api/users', () => ({
  fetchUsers: vi.fn(),
}))

const user = {
  id: 'user-01',
  name: 'Анна',
  email: 'anna.smirnova@example.com',
  login: 'anna.smirnova',
  password: 'SkillSwapMock2025!',
} as User

function AuthFormProbe() {
  const { register, handleSubmit, errors, isSubmitting, error } = useAuthForm()

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input {...register('login')} />
      </label>
      <label>
        Пароль
        <input {...register('password')} />
      </label>
      <button type="submit">Войти</button>
      {errors.login?.message ? <p>{errors.login.message}</p> : null}
      {errors.password?.message ? <p>{errors.password.message}</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      <p>{isSubmitting ? 'отправка' : 'ожидание'}</p>
    </form>
  )
}

function renderAuthForm() {
  const store = configureStore({
    reducer: { auth: authReducer },
  })

  function wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(<AuthFormProbe />, { wrapper }) }
}

describe('useAuthForm', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(fetchUsers).mockReset()
  })

  it('показывает ошибки полей и не отправляет пустую форму', async () => {
    const userEvents = userEvent.setup()
    renderAuthForm()

    await userEvents.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('Введите email')).toBeInTheDocument()
    expect(screen.getByText('Введите пароль')).toBeInTheDocument()
    expect(fetchUsers).not.toHaveBeenCalled()
    expect(screen.getByText('ожидание')).toBeInTheDocument()
  })

  it('при повторной отправке сбрасывает старые ошибки полей', async () => {
    const userEvents = userEvent.setup()
    renderAuthForm()

    await userEvents.click(screen.getByRole('button', { name: 'Войти' }))
    expect(await screen.findByText('Введите email')).toBeInTheDocument()

    await userEvents.type(screen.getByRole('textbox', { name: 'Email' }), 'anna.smirnova')
    await userEvents.click(screen.getByRole('button', { name: 'Войти' }))

    await waitFor(() => {
      expect(screen.queryByText('Введите email')).not.toBeInTheDocument()
      expect(screen.getByText('Введите пароль')).toBeInTheDocument()
    })
    expect(fetchUsers).not.toHaveBeenCalled()
  })

  it('показывает общую ошибку, если пара логина и пароля неверная', async () => {
    vi.mocked(fetchUsers).mockResolvedValue([user])
    const userEvents = userEvent.setup()
    const { store } = renderAuthForm()

    await userEvents.type(screen.getByRole('textbox', { name: 'Email' }), 'anna.smirnova')
    await userEvents.type(screen.getByLabelText('Пароль'), 'wrong')
    await userEvents.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Неверный логин или пароль')
    expect(screen.queryByText('Введите email')).not.toBeInTheDocument()
    expect(screen.queryByText('Введите пароль')).not.toBeInTheDocument()
    expect(store.getState().auth).toEqual({ user: null })
  })

  it('держит признак отправки, пока вход не завершился', async () => {
    let resolveUsers: (users: User[]) => void = () => {}
    vi.mocked(fetchUsers).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUsers = resolve
        }),
    )
    const userEvents = userEvent.setup()
    const { store } = renderAuthForm()

    await userEvents.type(screen.getByRole('textbox', { name: 'Email' }), user.login)
    await userEvents.type(screen.getByLabelText('Пароль'), user.password)
    await userEvents.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('отправка')).toBeInTheDocument()

    resolveUsers([user])

    expect(await screen.findByText('ожидание')).toBeInTheDocument()
    expect(store.getState().auth.user).toMatchObject({ id: 'user-01', email: user.email })
  })
})
