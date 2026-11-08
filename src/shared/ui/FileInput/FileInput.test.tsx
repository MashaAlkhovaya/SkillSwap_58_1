import { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FileInput } from './FileInput'

describe('FileInput', () => {
  it('должен рендерить текст подсказки для варианта skill', () => {
    render(<FileInput onChange={vi.fn()} variant="skill" />)
    expect(screen.getByText(/Перетащите или выберите изображения навыка/i)).toBeInTheDocument()
    expect(screen.getByText(/Выберите изображение/i)).toBeInTheDocument()
  })

  it('должен рендерить иконку-плейсхолдер для варианта avatar (без текста)', () => {
    render(<FileInput onChange={vi.fn()} variant="avatar" />)

    expect(
      screen.queryByText(/Перетащите или выберите изображения навыка/i),
    ).not.toBeInTheDocument()
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument()
  })

  it('должен вызывать onChange при выборе валидного файла', () => {
    const handleChange = vi.fn()
    render(<FileInput onChange={handleChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    expect(handleChange).toHaveBeenCalledWith(file)
  })

  it('должен обрабатывать Drop файла', () => {
    const handleChange = vi.fn()
    render(<FileInput onChange={handleChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const dropzone = document.querySelector('input[type="file"]')?.parentElement as HTMLDivElement

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    })

    expect(handleChange).toHaveBeenCalledWith(file)
  })

  it('прокидывает ref на input файла и оставляет клик по зоне выбора', () => {
    const ref = createRef<HTMLInputElement>()
    render(<FileInput ref={ref} onChange={vi.fn()} />)

    const input = document.querySelector('input[type="file"]')
    expect(ref.current).toBe(input)

    const click = vi.spyOn(ref.current as HTMLInputElement, 'click')
    fireEvent.click(input?.parentElement as HTMLDivElement)

    expect(click).toHaveBeenCalled()
  })
})
