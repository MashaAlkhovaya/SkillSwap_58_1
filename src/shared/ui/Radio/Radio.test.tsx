import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, vi } from 'vitest'
import { Radio } from './Radio'

describe('Radio', () => {
  test('рендерит текст label', () => {
    render(
      <Radio
        label="Хочу научиться"
        value="learn"
        name="test"
        checked={false}
        onChange={() => {}}
      />,
    )

    expect(screen.getByText('Хочу научиться')).toBeInTheDocument()
  })

  test('вызывает onChange с правильным значением при клике', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <Radio
        label="Хочу научиться"
        value="learn"
        name="test"
        checked={false}
        onChange={handleChange}
      />,
    )

    const radio = screen.getByTestId('radio-learn')

    await user.click(radio)

    expect(handleChange).toHaveBeenCalledWith('learn')
  })

  test('не вызывает onChange, если disabled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <Radio
        label="Хочу научиться"
        value="learn"
        name="test"
        checked={false}
        onChange={handleChange}
        disabled
      />,
    )

    const radio = screen.getByTestId('radio-learn')

    expect(radio).toBeDisabled()

    await user.click(radio)

    expect(handleChange).not.toHaveBeenCalled()
  })

  test('отображает checked состояние', () => {
    render(
      <Radio label="Хочу научиться" value="learn" name="test" checked={true} onChange={vi.fn()} />,
    )

    const radio = screen.getByTestId('radio-learn') as HTMLInputElement
    expect(radio.checked).toBe(true)
  })
})
