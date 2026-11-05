import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RegisterPage from './index'

describe('RegisterPage', () => {
  it('показывает текущий шаг регистрации и общее количество шагов', () => {
    render(<RegisterPage currentStep={2} totalSteps={3} />)

    expect(screen.getByText('Шаг 2 из 3')).toBeInTheDocument()
  })

  it('отображает подсказку, соответствующую текущему шагу', () => {
    const steps = [
      [1, 'Добро пожаловать в SkillSwap!'],
      [2, 'Расскажите немного о себе'],
      [3, 'Укажите, чем вы готовы поделиться'],
    ] as const

    for (const [currentStep, title] of steps) {
      const { unmount } = render(<RegisterPage currentStep={currentStep} totalSteps={3} />)

      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      unmount()
    }
  })

  it('отображает индикатор для каждого шага регистрации', () => {
    render(<RegisterPage currentStep={1} totalSteps={4} />)

    const stepper = screen.getByText('Шаг 1 из 4').parentElement
    expect(stepper).not.toBeNull()
    expect(within(stepper as HTMLElement).getAllByTestId('stepper-line')).toHaveLength(4)
  })

  it.each([
    [-1, 1],
    [5, 3],
    [Number.NaN, 1],
    [2.8, 2],
  ])('ограничивает текущий шаг допустимым диапазоном (%i → %i)', (currentStep, expectedStep) => {
    render(<RegisterPage currentStep={currentStep} totalSteps={3} />)

    expect(screen.getByText(`Шаг ${expectedStep} из 3`)).toBeInTheDocument()
  })

  it('нормализует некорректное общее количество шагов', () => {
    render(<RegisterPage currentStep={3} totalSteps={0} />)

    expect(screen.getByText('Шаг 1 из 1')).toBeInTheDocument()
    expect(screen.getAllByTestId('stepper-line')).toHaveLength(1)
  })

  it('отображает блок авторизации с полями email и пароля', () => {
    render(<RegisterPage currentStep={1} totalSteps={3} />)

    const authSection = screen.getByRole('region', { name: 'Вход' })
    expect(within(authSection).getByLabelText('Email')).toBeInTheDocument()
    expect(within(authSection).getByLabelText('Пароль')).toBeInTheDocument()
  })
})
