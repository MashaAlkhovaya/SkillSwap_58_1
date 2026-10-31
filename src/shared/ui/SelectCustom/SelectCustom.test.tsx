import { fireEvent, render, screen } from '@testing-library/react'
import { SelectCustom } from './index'

const options = [
  { value: '', label: 'Выберите вариант', key: 'placeholder', title: true },
  { value: 'one', label: 'Первый вариант', key: 'one' },
  { value: 'two', label: 'Второй вариант', key: 'two' },
]

describe('SelectCustom', () => {
  it('показывает title-опцию как начальный, невыбираемый placeholder', () => {
    render(<SelectCustom options={options} onChange={vi.fn()} />)

    const trigger = screen.getByRole('combobox')

    expect(trigger).toHaveAttribute('placeholder', 'Выберите вариант')

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })

    const placeholder = screen.getByRole('option', { name: 'Выберите вариант' })

    expect(placeholder).toHaveAttribute('aria-disabled', 'true')

    fireEvent.click(placeholder)

    expect(trigger).toHaveAttribute('placeholder', 'Выберите вариант')
  })

  it('передаёт onChange для выбранной опции', () => {
    const onChange = vi.fn()
    render(<SelectCustom options={options} onChange={onChange} />)

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
    fireEvent.click(screen.getByRole('option', { name: 'Первый вариант' }))

    expect(onChange).toHaveBeenCalledWith('one')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Первый вариант')
  })

  it('открывает список и выбирает пункт мышью', () => {
    const onChange = vi.fn()
    render(<SelectCustom options={options} onChange={onChange} />)

    fireEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(screen.getByRole('option', { name: 'Первый вариант' }))

    expect(onChange).toHaveBeenCalledWith('one')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Первый вариант')
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('закрывает список повторным кликом по стрелке', () => {
    render(<SelectCustom options={options} onChange={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Открыть список' }))
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть список' }))
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('исключает кнопку-стрелку из последовательности Tab', () => {
    render(<SelectCustom options={options} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Открыть список' })).toHaveAttribute('tabindex', '-1')
  })

  it('фильтрует варианты по введённому label без учёта регистра', () => {
    render(<SelectCustom options={options} onChange={vi.fn()} />)

    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    expect(input).toHaveAttribute('placeholder', '')
    fireEvent.change(input, {
      target: { value: 'ВТОРОЙ' },
    })

    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('option', { name: 'Второй вариант' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Первый вариант' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Выберите вариант' })).not.toBeInTheDocument()
  })

  it('показывает сообщение, если вариантов с введённым label нет', () => {
    render(<SelectCustom options={options} onChange={vi.fn()} />)

    const input = screen.getByRole('combobox')
    fireEvent.change(input, {
      target: { value: 'неизвестный вариант' },
    })

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('выбирает найденный вариант и очищает поиск', () => {
    const onChange = vi.fn()
    render(<SelectCustom options={options} onChange={onChange} />)

    const input = screen.getByRole('combobox')
    fireEvent.change(input, {
      target: { value: 'Второй' },
    })
    fireEvent.click(screen.getByRole('option', { name: 'Второй вариант' }))

    expect(onChange).toHaveBeenCalledWith('two')
    expect(input).toHaveAttribute('placeholder', 'Второй вариант')
    expect(input).toHaveValue('')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('переходит к доступному пункту стрелкой вниз и выбирает его через Enter', () => {
    const onChange = vi.fn()
    render(<SelectCustom options={options} onChange={onChange} />)

    const trigger = screen.getByRole('combobox')
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })

    const item = screen.getByRole('option', { name: 'Первый вариант' })
    expect(trigger).toHaveAttribute('aria-activedescendant', item.id)

    fireEvent.keyDown(trigger, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith('one')
    expect(trigger).toHaveAttribute('placeholder', 'Первый вариант')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('закрывает список по Escape без изменения выбора', () => {
    render(<SelectCustom options={options} onChange={vi.fn()} />)

    const trigger = screen.getByRole('combobox')
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'Escape' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('placeholder', 'Выберите вариант')
  })
})
