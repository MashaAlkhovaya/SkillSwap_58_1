import { render, screen } from '@testing-library/react'

import { Text } from './Text'

describe('Text', () => {
  it('рендерит children и размер из варианта', () => {
    render(<Text variant="sm">Все навыки</Text>)

    const text = screen.getByText('Все навыки')
    expect(text.tagName).toBe('SPAN')
    expect(text.className).toContain('sm')
  })

  it('вешает класс насыщенности и курсив только когда их передали', () => {
    render(
      <Text variant="base" weight="medium" italic as="p">
        Добро пожаловать
      </Text>,
    )

    const text = screen.getByText('Добро пожаловать')
    expect(text.tagName).toBe('P')
    expect(text.className).toContain('medium')
    expect(text.className).toContain('italic')
  })

  it('вешает класс цвета только когда его передали', () => {
    render(<Text color="error">Неверный пароль</Text>)

    expect(screen.getByText('Неверный пароль').className).toContain('error')
  })
})
