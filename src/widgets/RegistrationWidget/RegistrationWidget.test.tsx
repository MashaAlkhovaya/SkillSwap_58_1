import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { RegistrationWidget } from './RegistrationWidget'

describe('RegistrationWidget', () => {
  // ─────────────── ШАГ 1 ───────────────
  describe('шаг 1', () => {
    it('отображает поля первого шага', () => {
      render(<RegistrationWidget step={1} />)

      expect(screen.getByRole('button', { name: /Продолжить с Google/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Продолжить с Apple/i })).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Пароль')).toBeInTheDocument()
    })

    it('вызывает onNext по клику на «Далее»', () => {
      const onNext = vi.fn()
      render(<RegistrationWidget step={1} onNext={onNext} />)

      fireEvent.click(screen.getByRole('button', { name: 'Далее' }))
      expect(onNext).toHaveBeenCalledTimes(1)
    })

    it('не показывает кнопку «Назад»', () => {
      render(<RegistrationWidget step={1} />)
      expect(screen.queryByRole('button', { name: 'Назад' })).not.toBeInTheDocument()
    })
  })

  // ─────────────── ШАГ 2 ───────────────
  describe('шаг 2', () => {
    it('отображает поля второго шага', () => {
      render(<RegistrationWidget step={2} />)

      expect(screen.getByLabelText('Загрузить аватар')).toBeInTheDocument()
      expect(screen.getByLabelText('Имя')).toBeInTheDocument()
      expect(screen.getByText('Дата рождения')).toBeInTheDocument()
      expect(screen.getByText('Пол')).toBeInTheDocument()
      expect(screen.getByText('Город')).toBeInTheDocument()
      expect(screen.getByText('Категория навыка, которому хотите научиться')).toBeInTheDocument()
      expect(screen.getByText('Подкатегория навыка, которому хотите научиться')).toBeInTheDocument()
    })

    it('вызывает onNext по клику на «Продолжить»', () => {
      const onNext = vi.fn()
      render(<RegistrationWidget step={2} onNext={onNext} />)

      fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
      expect(onNext).toHaveBeenCalledTimes(1)
    })

    it('вызывает onBack по клику на «Назад»', () => {
      const onBack = vi.fn()
      render(<RegistrationWidget step={2} onBack={onBack} />)

      fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
      expect(onBack).toHaveBeenCalledTimes(1)
    })
  })

  // ─────────────── ШАГ 3 ───────────────
  describe('шаг 3', () => {
    it('отображает поля третьего шага', () => {
      render(<RegistrationWidget step={3} />)

      expect(screen.getByLabelText('Название навыка')).toBeInTheDocument()
      expect(screen.getByText('Категория навыка')).toBeInTheDocument()
      expect(screen.getByText('Подкатегория навыка')).toBeInTheDocument()
      expect(screen.getByLabelText('Описание')).toBeInTheDocument()
      expect(screen.getByText('Перетащите или выберите изображения навыка')).toBeInTheDocument()
    })

    it('вызывает onNext по клику на «Продолжить»', () => {
      const onNext = vi.fn()
      render(<RegistrationWidget step={3} onNext={onNext} />)

      fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
      expect(onNext).toHaveBeenCalledTimes(1)
    })

    it('вызывает onBack по клику на «Назад»', () => {
      const onBack = vi.fn()
      render(<RegistrationWidget step={3} onBack={onBack} />)

      fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
      expect(onBack).toHaveBeenCalledTimes(1)
    })
  })

  //
  it('не падает при клике на кнопки, если onNext/onBack не переданы', () => {
    render(<RegistrationWidget step={2} />)

    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))).not.toThrow()
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Назад' }))).not.toThrow()
  })
})
