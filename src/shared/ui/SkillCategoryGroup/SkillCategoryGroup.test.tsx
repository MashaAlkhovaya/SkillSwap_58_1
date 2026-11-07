import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SkillCategoryGroup } from './SkillCategoryGroup'
import { SKILL_CATEGORIES } from '../../lib/constants'

const MOCK_CATEGORY = SKILL_CATEGORIES[0]

describe('SkillCategoryGroup', () => {
  it('вызывает onChange со всеми ID при выборе родителя', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <SkillCategoryGroup category={MOCK_CATEGORY} selectedSkills={[]} onChange={handleChange} />,
    )

    await user.click(screen.getByText('Бизнес и карьера'))

    expect(handleChange).toHaveBeenCalledWith(MOCK_CATEGORY.subcategories.map((sub) => sub.id))
  })

  it('снимает выбор со всех ID при повторном клике на родителя', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    const allIds = MOCK_CATEGORY.subcategories.map((sub) => sub.id)

    render(
      <SkillCategoryGroup
        category={MOCK_CATEGORY}
        selectedSkills={allIds}
        onChange={handleChange}
      />,
    )

    await user.click(screen.getByText('Бизнес и карьера'))
    expect(handleChange).toHaveBeenCalledWith([])
  })

  it('корректно обрабатывает выбор одной подкатегории', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <SkillCategoryGroup category={MOCK_CATEGORY} selectedSkills={[]} onChange={handleChange} />,
    )

    const firstSubcategoryTitle = MOCK_CATEGORY.subcategories[0].title
    const firstSubcategoryId = MOCK_CATEGORY.subcategories[0].id

    await user.click(screen.getByText(firstSubcategoryTitle))
    expect(handleChange).toHaveBeenCalledWith([firstSubcategoryId])
  })
})
