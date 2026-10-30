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

  it('должен показывать ошибку при неверном формате файла', () => {
    const handleChange = vi.fn()
    render(<FileInput onChange={handleChange} />)

    const pdfFile = new File(['test'], 'doc.pdf', { type: 'application/pdf' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [pdfFile] } })

    expect(screen.getByText(/Можно загружать только картинки/i)).toBeInTheDocument()
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('должен показывать ошибку при превышении размера файла', () => {
    const handleChange = vi.fn()
    render(<FileInput onChange={handleChange} />)

    const largeFile = new File(['a'.repeat(3 * 1024 * 1024)], 'big.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [largeFile] } })

    expect(screen.getByText(/не должен превышать 2 МБ/i)).toBeInTheDocument()
    expect(handleChange).not.toHaveBeenCalled()
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
})
