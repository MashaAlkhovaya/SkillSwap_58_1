import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SkillSearcher } from './SkillSearcher'

function LocationOutput() {
  const location = useLocation()
  return <output data-testid="search">{location.search}</output>
}

function renderSearcher(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SkillSearcher />
      <LocationOutput />
    </MemoryRouter>,
  )
}

describe('SkillSearcher', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('откладывает ввод параметра и записывает строку без начальных и конечных пробелов в параметр name', async () => {
    vi.useFakeTimers()
    renderSearcher()

    fireEvent.change(screen.getByPlaceholderText('Искать навык'), {
      target: { value: '  Музыка и звук  ' },
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(999)
    })
    expect(screen.getByTestId('search').textContent).toBe('')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })

    expect(new URLSearchParams(screen.getByTestId('search').textContent ?? '').get('name')).toBe(
      'Музыка и звук',
    )
  })

  it('записывает только последнее значение, если ввод меняется во время debounce', async () => {
    vi.useFakeTimers()
    renderSearcher()
    const input = screen.getByPlaceholderText('Искать навык')

    fireEvent.change(input, { target: { value: 'муз' } })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    fireEvent.change(input, { target: { value: 'музыка' } })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(new URLSearchParams(screen.getByTestId('search').textContent ?? '').get('name')).toBe(
      'музыка',
    )
  })

  it('инициализирует поле из URL и удаляет name из URL при очистке', async () => {
    vi.useFakeTimers()
    renderSearcher('/?name=Гитара')
    const input = screen.getByPlaceholderText('Искать навык') as HTMLInputElement

    expect(input.value).toBe('Гитара')
    fireEvent.change(input, { target: { value: '' } })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(new URLSearchParams(screen.getByTestId('search').textContent ?? '').has('name')).toBe(
      false,
    )
  })
})
