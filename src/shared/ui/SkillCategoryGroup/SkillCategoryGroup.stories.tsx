import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SkillCategoryGroup } from './SkillCategoryGroup'
import { SKILL_CATEGORIES, SubCategoryId } from '../../lib/constants'

const MOCK_CATEGORY = SKILL_CATEGORIES[0]

const allSubcategoryIds = MOCK_CATEGORY.subcategories.map((sub) => sub.id)
const secondSubId = MOCK_CATEGORY.subcategories[1].id

type CustomStoryArgs = React.ComponentProps<typeof SkillCategoryGroup> & {
  initialSelected: SubCategoryId[]
  onChange: (skills: SubCategoryId[]) => void
}

const meta: Meta<CustomStoryArgs> = {
  title: 'Widgets/FilterSidebar/SkillCategoryGroup',
  component: SkillCategoryGroup,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', background: '#f9fafb', width: '324px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<CustomStoryArgs>

const renderSkillCategory = (args: CustomStoryArgs) => {
  const [selected, setSelected] = useState<SubCategoryId[]>(args.initialSelected || [])

  return (
    <SkillCategoryGroup
      category={args.category || MOCK_CATEGORY}
      selectedSkills={selected}
      onChange={(newSkills) => {
        setSelected(newSkills)
        args.onChange?.(newSkills)
      }}
    />
  )
}

const baseArgs: CustomStoryArgs = {
  category: MOCK_CATEGORY,
  selectedSkills: [],
  onChange: fn(),
  initialSelected: [],
}

export const Default: Story = {
  render: renderSkillCategory,
  args: {
    ...baseArgs,
    initialSelected: [],
  },
}

export const Indeterminate: Story = {
  render: renderSkillCategory,
  args: {
    ...baseArgs,
    initialSelected: [secondSubId],
  },
}

export const AllSelected: Story = {
  render: renderSkillCategory,
  args: {
    ...baseArgs,
    initialSelected: [...allSubcategoryIds],
  },
}
