import { render, screen } from '@testing-library/react'
import { RegistrationDecoration } from './RegistrationDecoration'

describe('RegistrationDecoration', () => {
  it.each([
    [1, 'Добро пожаловать в SkillSwap!'],
    [2, 'Расскажите немного о себе'],
    [3, 'Укажите, чем вы готовы поделиться'],
  ] as const)('показывает заголовок шага %i', (step, title) => {
    render(<RegistrationDecoration step={step} />)

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Информация о регистрации' })).toBeInTheDocument()
  })
})
