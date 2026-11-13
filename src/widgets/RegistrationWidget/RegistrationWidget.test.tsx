import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { RegistrationWidget } from './RegistrationWidget'

describe('RegistrationWidget', () => {
  // ─────────────── ШАГ 1 ───────────────
  describe('шаг 1', () => {
    it('отображает поля первого шага', () => {
      render(<RegistrationWidget step={1} />, { wrapper: MemoryRouter })

      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Пароль')).toBeInTheDocument()
    })
    it('ссылка «Войти» ведёт на страницу входа', () => {
      render(<RegistrationWidget step={1} />, { wrapper: MemoryRouter })

      expect(screen.getByRole('link', { name: 'Войти' })).toHaveAttribute('href', '/login')
    })

    it('вызывает onNext после заполнения валидных полей шага', async () => {
      const onNext = vi.fn()
      const user = userEvent.setup()
      render(<RegistrationWidget step={1} onNext={onNext} />, { wrapper: MemoryRouter })

      await user.type(screen.getByLabelText('Email'), 'user@example.com')
      await user.type(screen.getByLabelText('Пароль'), 'secure-pass-123')
      await user.click(screen.getByRole('button', { name: 'Далее' }))

      await waitFor(() => expect(onNext).toHaveBeenCalledOnce())
    })

    it('не показывает кнопку «Назад»', () => {
      render(<RegistrationWidget step={1} />, { wrapper: MemoryRouter })
      expect(screen.queryByRole('button', { name: 'Назад' })).not.toBeInTheDocument()
    })
  })

  // ─────────────── ШАГ 2 ───────────────
  describe('шаг 2', () => {
    it('отображает поля второго шага', () => {
      render(<RegistrationWidget step={2} />, { wrapper: MemoryRouter })

      expect(screen.getByLabelText('Загрузить аватар')).toBeInTheDocument()
      expect(screen.getByLabelText('Имя')).toBeInTheDocument()
      expect(screen.getByText('Дата рождения')).toBeInTheDocument()
      expect(screen.getByText('Пол')).toBeInTheDocument()
      expect(screen.getByText('Город')).toBeInTheDocument()
      expect(screen.getByText('Категория навыка, которому хотите научиться')).toBeInTheDocument()
      expect(screen.getByText('Подкатегория навыка, которому хотите научиться')).toBeInTheDocument()
    })

    it('не вызывает onNext, пока обязательные поля шага не заполнены', async () => {
      const onNext = vi.fn()
      render(<RegistrationWidget step={2} onNext={onNext} />, { wrapper: MemoryRouter })

      fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

      expect(await screen.findByText('Введите имя')).toBeInTheDocument()
      expect(onNext).not.toHaveBeenCalled()
    })

    it('вызывает onBack по клику на «Назад»', () => {
      const onBack = vi.fn()
      render(<RegistrationWidget step={2} onBack={onBack} />, { wrapper: MemoryRouter })

      fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
      expect(onBack).toHaveBeenCalledTimes(1)
    })
  })

  // ─────────────── ШАГ 3 ───────────────
  describe('шаг 3', () => {
    it('отображает поля третьего шага', () => {
      render(<RegistrationWidget step={3} />, { wrapper: MemoryRouter })

      expect(screen.getByLabelText('Название навыка')).toBeInTheDocument()
      expect(screen.getByText('Категория навыка')).toBeInTheDocument()
      expect(screen.getByText('Подкатегория навыка')).toBeInTheDocument()
      expect(screen.getByLabelText('Описание')).toBeInTheDocument()
      expect(screen.getByText('Перетащите или выберите изображения навыка')).toBeInTheDocument()
    })

    it('не вызывает onNext и не отправляет невалидную форму', async () => {
      const onNext = vi.fn()
      const onSubmit = vi.fn()
      render(<RegistrationWidget step={3} onNext={onNext} onSubmit={onSubmit} />, {
        wrapper: MemoryRouter,
      })

      fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

      expect(await screen.findByText('Введите название навыка')).toBeInTheDocument()
      expect(onNext).not.toHaveBeenCalled()
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('вызывает onBack по клику на «Назад»', () => {
      const onBack = vi.fn()
      render(<RegistrationWidget step={3} onBack={onBack} />, { wrapper: MemoryRouter })

      fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
      expect(onBack).toHaveBeenCalledTimes(1)
    })
  })

  //
  it('не падает при клике на кнопки, если onNext/onBack не переданы', async () => {
    const user = userEvent.setup()
    render(<RegistrationWidget step={2} />, { wrapper: MemoryRouter })

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await screen.findByText('Введите имя')
    await user.click(screen.getByRole('button', { name: 'Назад' }))
  })
})
