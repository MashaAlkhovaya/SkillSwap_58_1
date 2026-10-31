import { fireEvent, render, screen } from '@testing-library/react'
import { Select } from './Select'

const options = [
  { value: '', label: 'Выберите вариант', key: 'placeholder', title: true },
  { value: 'one', label: 'Первый вариант', key: 'one' },
]

describe('Select', () => {
  it('показывает элемент с title как выбранный placeholder', () => {
    render(<Select name="choice" options={options} onChange={vi.fn()} />)

    const select = screen.getByRole('combobox') as HTMLSelectElement
    const placeholder = screen.getByRole('option', { name: 'Выберите вариант' })

    expect(select.value).toBe('')
    expect((placeholder as HTMLOptionElement).selected).toBe(true)
    expect(placeholder).toBeDisabled()
  })

  it('передаёт onChange для выбранной опции', () => {
    const onChange = vi.fn()
    render(<Select name="choice" options={options} onChange={onChange} />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'one' } })

    expect(onChange).toHaveBeenCalledWith('one')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('передаёт name и отключает select, когда disabled равен true', () => {
    render(<Select name="skill" options={options} onChange={vi.fn()} disabled />)

    const select = screen.getByRole('combobox')

    expect(select).toHaveAttribute('name', 'skill')
    expect(select).toBeDisabled()
  })

  it('добавляет className к обёртке', () => {
    const { container } = render(
      <Select name="choice" options={options} onChange={vi.fn()} className="custom-class" />,
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('выбирает первую опцию, если placeholder не задан', () => {
    const optionsWithoutPlaceholder = [
      { value: 'one', label: 'Первый вариант', key: 'one' },
      { value: 'two', label: 'Второй вариант', key: 'two' },
    ]

    render(<Select name="choice" options={optionsWithoutPlaceholder} onChange={vi.fn()} />)

    const select = screen.getByRole('combobox') as HTMLSelectElement

    expect(select.value).toBe('one')
    expect(screen.getByRole('option', { name: 'Второй вариант' })).toBeInTheDocument()
  })
})
