import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('клик по тексту (label) вызывает onChange', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox label="Бизнес" checked={false} onChange={handleChange} />)

    await user.click(screen.getByText('Бизнес'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('не вызывает onChange, если disabled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox label="Бизнес" checked={false} onChange={handleChange} disabled />)

    const checkbox = screen.getByTestId('checkbox-Бизнес')
    expect(checkbox).toBeDisabled()
    await user.click(checkbox)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('отображает состояние indeterminate', () => {
    render(<Checkbox label="Бизнес" checked={false} indeterminate={true} onChange={vi.fn()} />)
    const checkbox = screen.getByTestId('checkbox-Бизнес') as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
  })

  it('при клике из indeterminate вызывает onChange(false)', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox label="Бизнес" checked={false} indeterminate={true} onChange={handleChange} />)

    await user.click(screen.getByTestId('checkbox-Бизнес'))
    expect(handleChange).toHaveBeenCalledWith(false)
  })
})
