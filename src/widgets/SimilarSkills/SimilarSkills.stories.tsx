import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { User } from '@/shared/types'
import { SimilarSkills } from './index'

const users: User[] = Array.from({ length: 8 }, (_, index) => ({
  id: `similar-user-${index + 1}`,
  name: ['Анна', 'Иван', 'Мария', 'София', 'Максим', 'Елена', 'Дарья', 'Константин'][index],
  email: `user${index + 1}@example.com`,
  avatarUrl: '/db/avatars/figma/anna.jpg',
  birthDate: '1995-02-08',
  gender: index % 2 === 0 ? 'female' : 'male',
  city: 'Санкт-Петербург',
  bio: '',
  createdAt: '2025-01-16T11:15:00.000Z',
  likes: [],
  canTeach: {
    id: `similar-skill-${index + 1}`,
    category: 'art',
    subCategory: 'music-sound',
  },
  wantsToLearn: ['acting', 'german'],
}))

function SimilarSkillsPreview({ items }: { items: User[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  return (
    <div style={{ padding: 24, background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <SimilarSkills
        users={items}
        favoriteIds={favoriteIds}
        onDetails={(user) => console.info('Подробнее:', user.id)}
        onFavoriteToggle={(user) =>
          setFavoriteIds((previous) =>
            previous.includes(user.id)
              ? previous.filter((id) => id !== user.id)
              : [...previous, user.id],
          )
        }
      />
    </div>
  )
}

const meta = {
  title: 'widgets/SimilarSkills',
  component: SimilarSkills,
  args: {
    users,
    favoriteIds: [],
    onDetails: () => {},
    onFavoriteToggle: () => {},
  },
} satisfies Meta<typeof SimilarSkills>

export default meta
type Story = StoryObj<typeof meta>

export const Carousel: Story = {
  render: () => <SimilarSkillsPreview items={users} />,
}

export const FewerThanFour: Story = {
  render: () => <SimilarSkillsPreview items={users.slice(0, 2)} />,
}

export const Empty: Story = {
  args: {
    users: [],
  },
}
