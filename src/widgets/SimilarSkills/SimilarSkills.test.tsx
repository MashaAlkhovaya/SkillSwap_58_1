import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { User } from '@/shared/types'
import { SimilarSkills } from './SimilarSkills'

function createUsers(count: number): User[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `user-${index + 1}`,
    name: `Пользователь ${index + 1}`,
    email: `user${index + 1}@example.com`,
    avatarUrl: null,
    birthDate: '1995-02-08',
    gender: 'female',
    city: 'Санкт-Петербург',
    bio: '',
    createdAt: '2025-01-16T11:15:00.000Z',
    likes: [],
    canTeach: {
      id: `skill-${index + 1}`,
      category: 'art',
      subCategory: 'music-sound',
    },
    wantsToLearn: ['acting'],
  }))
}

function mockCarouselLayout() {
  const viewWidth = 1368
  const slideWidth = 324
  const gap = 24
  const widthDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
  const leftDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetLeft')
  const originalGetComputedStyle = window.getComputedStyle.bind(window)

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      if (this.tagName === 'UL') return viewWidth
      if (this.tagName === 'LI') return slideWidth
      return 0
    },
  })

  Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
    configurable: true,
    get() {
      if (this.tagName !== 'LI' || !this.parentElement) return 0
      const index = Array.prototype.indexOf.call(this.parentElement.children, this)
      return index * (slideWidth + gap)
    },
  })

  window.getComputedStyle = ((element: Element) => {
    const style = originalGetComputedStyle(element)
    return new Proxy(style, {
      get(target, property, receiver) {
        if (property === 'getPropertyValue') {
          return (name: string) => {
            if (name.startsWith('margin')) return '0'
            return target.getPropertyValue(name)
          }
        }
        return Reflect.get(target, property, receiver)
      },
    })
  }) as typeof window.getComputedStyle

  return () => {
    window.getComputedStyle = originalGetComputedStyle
    if (widthDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', widthDescriptor)
    }
    if (leftDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'offsetLeft', leftDescriptor)
    }
  }
}

function renderWidget(users: User[], favoriteIds: string[] = []) {
  const onDetails = vi.fn()
  const onFavoriteToggle = vi.fn()

  render(
    <SimilarSkills
      users={users}
      favoriteIds={favoriteIds}
      onDetails={onDetails}
      onFavoriteToggle={onFavoriteToggle}
    />,
  )

  return { onDetails, onFavoriteToggle }
}

describe('SimilarSkills', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('показывает заголовок и карточку на каждого переданного пользователя', () => {
    renderWidget(createUsers(2))

    expect(screen.getByRole('region', { name: 'Похожие предложения' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Похожие предложения' })).toBeInTheDocument()
    expect(screen.getByText('Пользователь 1')).toBeInTheDocument()
    expect(screen.getByText('Пользователь 2')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Подробнее' })).toHaveLength(2)
  })

  it('показывает карточки без стрелок, когда они помещаются в ряд', () => {
    const restoreLayout = mockCarouselLayout()

    try {
      renderWidget(createUsers(3))

      expect(screen.getAllByRole('listitem')).toHaveLength(3)
      expect(screen.queryByRole('button', { name: 'Предыдущие карточки' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Следующие карточки' })).not.toBeInTheDocument()

      cleanup()
      renderWidget(createUsers(4))

      expect(screen.getAllByRole('listitem')).toHaveLength(4)
      expect(screen.queryByRole('button', { name: 'Предыдущие карточки' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Следующие карточки' })).not.toBeInTheDocument()
    } finally {
      restoreLayout()
    }
  })

  it('показывает заглушку для пустого списка', () => {
    renderWidget([])

    expect(screen.getByText('Похожих предложений пока нет')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Подробнее' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Следующие карточки' })).not.toBeInTheDocument()
  })

  it('передаёт выбранного пользователя в обработчики карточки', async () => {
    const user = userEvent.setup()
    const users = createUsers(2)
    const { onDetails, onFavoriteToggle } = renderWidget(users, [users[0].id])

    await user.click(screen.getAllByRole('button', { name: 'Подробнее' })[1])
    await user.click(screen.getByRole('button', { name: 'Убрать из избранного' }))

    expect(onDetails).toHaveBeenCalledWith(users[1])
    expect(onFavoriteToggle).toHaveBeenCalledWith(users[0])
  })

  it('прокручивает ленту на одну карточку и включает стрелку назад', async () => {
    const user = userEvent.setup()
    const restoreLayout = mockCarouselLayout()

    try {
      renderWidget(createUsers(6))

      expect(screen.queryByRole('button', { name: 'Предыдущие карточки' })).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Следующие карточки' }))

      expect(screen.getByRole('button', { name: 'Предыдущие карточки' })).toBeEnabled()
      expect(screen.getByRole('button', { name: 'Следующие карточки' })).toBeEnabled()
    } finally {
      restoreLayout()
    }
  })
})
