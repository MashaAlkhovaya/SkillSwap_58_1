import { fireEvent, render, screen } from '@testing-library/react'
import { SkillInfoCard } from './SkillInfoCard'
import type { Skill } from '@/shared/types'

const MOCK_IMAGES = [
  '/images/photo-1.jpg',
  '/images/photo-2.jpg',
  '/images/photo-3.jpg',
  '/images/photo-4.jpg',
  '/images/photo-5.jpg',
  '/images/photo-6.jpg',
  '/images/photo-7.jpg',
]

const createMockSkill = (overrides: Partial<Skill> = {}): Skill => ({
  id: 'skill-01',
  title: 'Игра на барабанах',
  description: 'Покажу базовые ритмы и помогу разучить простую партию.',
  type: 'teach',
  category: 'art',
  subCategory: 'music-sound',
  tags: ['барабаны', 'ритм', 'музыка'],
  imageUrls: MOCK_IMAGES.slice(0, 4),
  authorId: 'user-01',
  createdAt: '2025-01-15T10:15:00.000Z',
  ...overrides,
})

describe('SkillInfoCard', () => {
  it('корректно отображает информацию о навыке', () => {
    const skill = createMockSkill()

    render(<SkillInfoCard skill={skill} />)

    expect(screen.getByText('Игра на барабанах')).toBeInTheDocument()

    expect(screen.getByText('Творчество и искусство / Музыка и звук')).toBeInTheDocument()

    expect(
      screen.getByText('Покажу базовые ритмы и помогу разучить простую партию.'),
    ).toBeInTheDocument()
  })

  it('отображает главное фото навыка', () => {
    render(<SkillInfoCard skill={createMockSkill()} />)

    const mainImage = screen.getByRole('img', {
      name: 'Игра на барабанах — фото 1',
    })

    expect(mainImage).toHaveAttribute('src', MOCK_IMAGES[0])
  })

  it('переключает фотографию вперед', () => {
    render(<SkillInfoCard skill={createMockSkill()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Следующее фото' }))

    expect(
      screen.getByRole('img', {
        name: 'Игра на барабанах — фото 2',
      }),
    ).toHaveAttribute('src', MOCK_IMAGES[1])
  })

  it('переключает фотографию назад', () => {
    render(<SkillInfoCard skill={createMockSkill()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Предыдущее фото' }))

    expect(
      screen.getByRole('img', {
        name: 'Игра на барабанах — фото 4',
      }),
    ).toHaveAttribute('src', MOCK_IMAGES[3])
  })

  it('возвращается к первой фотографии после последней', () => {
    render(<SkillInfoCard skill={createMockSkill()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Предыдущее фото' }))

    fireEvent.click(screen.getByRole('button', { name: 'Следующее фото' }))

    expect(
      screen.getByRole('img', {
        name: 'Игра на барабанах — фото 1',
      }),
    ).toHaveAttribute('src', MOCK_IMAGES[0])
  })

  it('переключает главное фото при клике на миниатюру', () => {
    render(<SkillInfoCard skill={createMockSkill()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Показать фото 3' }))

    expect(
      screen.getByRole('img', {
        name: 'Игра на барабанах — фото 3',
      }),
    ).toHaveAttribute('src', MOCK_IMAGES[2])
  })

  it('показывает оверлей с количеством дополнительных фотографий', () => {
    render(
      <SkillInfoCard
        skill={createMockSkill({
          imageUrls: MOCK_IMAGES,
        })}
      />,
    )

    expect(screen.getByText('+4')).toBeInTheDocument()
  })

  it('отображает заглушку, если фотографий нет', () => {
    render(
      <SkillInfoCard
        skill={createMockSkill({
          imageUrls: [],
        })}
      />,
    )

    expect(screen.getByText('Фотографии пока не добавлены')).toBeInTheDocument()

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('не отображает стрелки, если фотография только одна', () => {
    render(
      <SkillInfoCard
        skill={createMockSkill({
          imageUrls: [MOCK_IMAGES[0]],
        })}
      />,
    )

    expect(screen.queryByRole('button', { name: 'Предыдущее фото' })).not.toBeInTheDocument()

    expect(screen.queryByRole('button', { name: 'Следующее фото' })).not.toBeInTheDocument()
  })

  it('отображает переданный через controls контент', () => {
    render(
      <SkillInfoCard
        skill={createMockSkill()}
        controls={<button type="button">Предложить обмен</button>}
      />,
    )

    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeInTheDocument()
  })
})
