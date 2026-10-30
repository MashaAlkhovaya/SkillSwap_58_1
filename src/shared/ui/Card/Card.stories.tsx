import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'

const meta = {
  title: 'shared/ui/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

function CardPreview(args: Story['args']) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [width, setWidth] = useState('324')
  const [height, setHeight] = useState('200')

  const cardStyle: CSSProperties = {
    width: width ? `${width}px` : 'auto',
    height: height ? `${height}px` : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...args?.style,
  }

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: '100vh',
        padding: '32px',
        boxSizing: 'border-box',
        backgroundColor: theme === 'light' ? '#e5e7eb' : '#020617',
        color: 'var(--color-text)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
        }}
      >
        <button
          type="button"
          onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          style={{
            padding: '10px 16px',
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        </button>

        <label>
          Ширина (px):{' '}
          <input
            type="number"
            min="0"
            value={width}
            onChange={(event) => setWidth(event.target.value)}
            style={{ width: '100px' }}
          />
        </label>

        <label>
          Высота (px):{' '}
          <input
            type="number"
            min="0"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            style={{ width: '100px' }}
          />
        </label>
      </div>

      <Card {...args} style={cardStyle}>
        {args?.children ?? 'Содержимое карточки'}
      </Card>
    </div>
  )
}

export const Default: Story = {
  args: {
    children: 'Содержимое карточки',
  },
  render: (args) => <CardPreview {...args} />,
}
