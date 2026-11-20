import { render } from '@testing-library/react'
import { AuthDecoration } from './AuthDecoration'
import { describe, it, expect } from 'vitest'

describe('AuthDecoration', () => {
  it('рендерит изображение-иллюстрацию', () => {
    const { container } = render(<AuthDecoration />)

    const image = container.querySelector('img')
    expect(image).toBeInTheDocument()

    expect(image?.getAttribute('src')).toContain('bulb')
  })
})
