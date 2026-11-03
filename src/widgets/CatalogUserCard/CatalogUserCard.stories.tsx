import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CatalogUserCard } from './CatalogUserCard'
import type { User } from '@/shared/types'

function CatalogUserCardPreview() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [user, setUser] = useState<User | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showStressTest, setShowStressTest] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true

    fetch('/db/users.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Не удалось загрузить пользователей')
        }

        return response.json()
      })
      .then((data: User[] | User) => {
        const users = Array.isArray(data) ? data : [data]

        if (isMounted && users.length > 0) {
          setUser(users[0])
        } else if (isMounted) {
          setError(true)
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const previewUser = user
    ? {
        ...user,

        name: showStressTest ? 'Александра Константинопольская Оченьдлинная' : user.name,

        city: showStressTest ? 'Санкт-Петербург Очень длинное название города' : user.city,

        canTeach: showStressTest
          ? {
              ...user.canTeach,
              category: 'languages' as const,
              subCategory: 'exam-preparation' as const,
            }
          : user.canTeach,

        wantsToLearn: showStressTest
          ? ([
              'exam-preparation',
              'balance-life-work',
              'marketing-advertising',
              'project-management',
              'personal-development',
            ] as User['wantsToLearn'])
          : user.wantsToLearn,
      }
    : null

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: '100vh',
        padding: '16px',
        boxSizing: 'border-box',
        backgroundColor: theme === 'light' ? '#e5e7eb' : '#020617',
        color: 'var(--color-text)',
        transition: 'background-color 0.2s ease',
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

        <button
          type="button"
          onClick={() => setShowStressTest((prev) => !prev)}
          style={{
            padding: '10px 16px',
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          {showStressTest ? 'Обычные данные' : 'Включить проверку'}
        </button>
      </div>

      {error && <p>Не удалось загрузить пользователя из users.json</p>}

      {!user && !error && <p>Загрузка пользователя...</p>}

      {previewUser && (
        <CatalogUserCard
          user={previewUser}
          isFavorite={isFavorite}
          onDetails={() => console.info('Подробнее:', previewUser.name)}
          onFavoriteToggle={() => setIsFavorite((prev) => !prev)}
        />
      )}
    </div>
  )
}

const meta = {
  title: 'Widgets/CatalogUserCard',
  component: CatalogUserCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CatalogUserCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    user: {} as User,
    isFavorite: false,
    onDetails: () => {},
    onFavoriteToggle: () => {},
  },
  render: () => <CatalogUserCardPreview />,
}
