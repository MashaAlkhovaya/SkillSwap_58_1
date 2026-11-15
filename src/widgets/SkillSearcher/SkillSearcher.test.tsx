import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SkillSearcher } from './SkillSearcher'

const { dispatchMock, loadUsersMock } = vi.hoisted(() => ({
  dispatchMock: vi.fn(),
  loadUsersMock: vi.fn((payload: unknown) => ({ type: 'users/load', payload })),
}))

vi.mock('@/store/hooks', () => ({
  useAppDispatch: () => dispatchMock,
}))

vi.mock('@/entities/user/model/usersSlice', () => ({
  loadUsers: loadUsersMock,
}))

describe('SkillSearcher', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    dispatchMock.mockClear()
    loadUsersMock.mockClear()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('откладывает поиск до истечения debounce и передаёт строку в name', async () => {
    render(<SkillSearcher />)
    fireEvent.change(screen.getByPlaceholderText('Искать навык'), {
      target: { value: '  Музыка и звук  ' },
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(999)
    })
    expect(dispatchMock).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })

    expect(loadUsersMock).toHaveBeenCalledWith({
      page: 1,
      sort: 'popular',
      type: 'all',
      name: 'Музыка и звук',
    })
    expect(dispatchMock).toHaveBeenCalledWith(loadUsersMock.mock.results[0].value)
  })

  it('ищет только по последнему значению, если ввод меняется в течение debounce', async () => {
    render(<SkillSearcher />)
    const input = screen.getByPlaceholderText('Искать навык')
    fireEvent.change(input, { target: { value: 'муз' } })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    fireEvent.change(input, { target: { value: 'музыка' } })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(loadUsersMock).toHaveBeenCalledTimes(1)
    expect(loadUsersMock).toHaveBeenCalledWith({
      page: 1,
      sort: 'popular',
      type: 'all',
      name: 'музыка',
    })
  })

  it('при очистке поля сбрасывает поиск запросом без name', async () => {
    render(<SkillSearcher />)
    const input = screen.getByPlaceholderText('Искать навык') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'Гитара' } })
    expect(input.value).toBe('Гитара')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(loadUsersMock).toHaveBeenLastCalledWith({
      page: 1,
      sort: 'popular',
      type: 'all',
      name: 'Гитара',
    })

    fireEvent.change(input, { target: { value: '' } })
    expect(input.value).toBe('')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(loadUsersMock).toHaveBeenLastCalledWith({
      page: 1,
      sort: 'popular',
      type: 'all',
      name: '',
    })
    expect(dispatchMock).toHaveBeenCalledTimes(2)
  })
})
