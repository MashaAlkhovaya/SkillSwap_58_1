import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stepper } from './Stepper'
import styles from './Stepper.module.css'

describe('Stepper', () => {
  it('должен отображать правильный текст шага', () => {
    render(<Stepper totalSteps={3} currentStep={2} />)
    expect(screen.getByText('Шаг 2 из 3')).toBeInTheDocument()
  })

  it('должен рендерить правильное количество полосок', () => {
    render(<Stepper totalSteps={5} currentStep={1} />)

    const lines = screen.getAllByTestId('stepper-line')

    expect(lines).toHaveLength(5)
  })

  it('должен красить активные полоски правильным классом', () => {
    render(<Stepper totalSteps={3} currentStep={2} />)

    const lines = screen.getAllByTestId('stepper-line')

    expect(lines[0]).toHaveClass(styles.active)
    expect(lines[1]).toHaveClass(styles.active)

    expect(lines[2]).not.toHaveClass(styles.active)
  })
})
