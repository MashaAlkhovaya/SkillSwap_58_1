import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, vi } from 'vitest'
import { DateInput } from './DateInput'

describe('DateInput', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 1. Label отображается корректно
  test('отображает label при передаче prop label', () => {
    render(<DateInput name="birthDate" label="Дата рождения" onChange={vi.fn()} />)
    expect(screen.getByLabelText('Дата рождения')).toBeInTheDocument()
  })

  // 2. Placeholder есть у инпута (ищем по data-testid, так как TextInput — обёртка)
  test('показывает placeholder "дд.мм.гггг" в инпуте', () => {
    render(<DateInput name="birthDate" onChange={vi.fn()} />)
    const input = screen.getByTestId('date-input-field')
    expect(input).toHaveAttribute('placeholder', 'дд.мм.гггг')
  })

  // 3. Календарь открывается по клику на кнопку-иконку
  test('открывает календарь по клику на кнопку-иконку', async () => {
    render(<DateInput name="birthDate" onChange={vi.fn()} />)

    const toggleBtn = screen.getByTestId('calendar-toggle')
    await user.click(toggleBtn)

    await waitFor(() => {
      expect(screen.getByTestId('date-picker-popup')).toBeInTheDocument()
    })
  })

  // 4. Календарь закрывается при клике вне его
  test('закрывает календарь при клике вне его', async () => {
    const onChange = vi.fn()
    render(<DateInput name="birthDate" onChange={onChange} />)

    const toggleBtn = screen.getByTestId('calendar-toggle')
    await user.click(toggleBtn)

    expect(screen.getByTestId('date-picker-popup')).toBeInTheDocument()

    await user.click(document.body)

    await waitFor(() => {
      expect(screen.queryByTestId('date-picker-popup')).not.toBeInTheDocument()
    })
  })

  // 5. Ручной ввод + подтверждение
  test('принимает ручной ввод и передаёт строку при подтверждении', async () => {
    const onChange = vi.fn()
    render(<DateInput name="birthDate" onChange={onChange} />)

    const input = screen.getByTestId('date-input-field')
    await user.type(input, '12.03.2020')

    const toggleBtn = screen.getByTestId('calendar-toggle')
    await user.click(toggleBtn)

    const confirmBtn = screen.getByTestId('confirm-btn')
    await user.click(confirmBtn)

    expect(onChange).toHaveBeenCalledTimes(1)
    const [result] = onChange.mock.calls[0]
    expect(result).toBe('12.03.2020')
  })

  // 6. Блокировка кнопки "Выбрать", если ничего не выбрано
  test('блокирует кнопку "Выбрать", если нет ни ручного ввода, ни выбранной даты', async () => {
    const onChange = vi.fn()
    render(<DateInput name="birthDate" onChange={onChange} />)

    const toggleBtn = screen.getByTestId('calendar-toggle')
    await user.click(toggleBtn)

    const confirmBtn = screen.getByTestId('confirm-btn')
    expect(confirmBtn).toBeDisabled()
  })

  // 7. Обработка Escape
  test('обрабатывает нажатие Escape и закрывает календарь', async () => {
    const onChange = vi.fn()
    render(<DateInput name="birthDate" onChange={onChange} />)

    const toggleBtn = screen.getByTestId('calendar-toggle')
    await user.click(toggleBtn)
    await waitFor(() => expect(screen.getByTestId('date-picker-popup')).toBeInTheDocument())

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByTestId('date-picker-popup')).not.toBeInTheDocument()
    })
  })

  // 8. Disabled: календарь не открывается
  test('не открывает календарь, если disabled=true', () => {
    const onChange = vi.fn()
    render(<DateInput name="birthDate" disabled={true} onChange={onChange} />)

    const toggleBtn = screen.getByTestId('calendar-toggle')
    expect(toggleBtn).toBeDisabled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // 9. Отображение переданного значения (Date)
  test('корректно отображает переданное значение (Date)', () => {
    const value = new Date(2023, 4, 15) // 15.05.2023
    const onChange = vi.fn()
    render(<DateInput name="birthDate" value={value} onChange={onChange} />)

    const input = screen.getByTestId('date-input-field')
    expect(input).toHaveValue('15.05.2023')
  })

  // 10. Отображение переданного значения (строка)
  test('корректно отображает переданное значение (строка)', () => {
    const onChange = vi.fn()
    render(<DateInput name="birthDate" value="10.10.2010" onChange={onChange} />)

    const input = screen.getByTestId('date-input-field')
    expect(input).toHaveValue('10.10.2010')
  })
})
