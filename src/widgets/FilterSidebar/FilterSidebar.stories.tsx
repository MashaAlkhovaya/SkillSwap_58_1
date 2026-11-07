import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { FilterSidebar } from './FilterSidebar'
import { FiltersState } from '../../shared/types/index'
import { CITIES, INITIAL_FILTERS_STATE, SKILL_CATEGORIES } from '../../shared/lib/constants'

const subcategoryId = SKILL_CATEGORIES[0].subcategories[1].id
const firstCity = CITIES[0]
const secondCity = CITIES[1]

type CustomFilterSidebarArgs = React.ComponentProps<typeof FilterSidebar> & {
  initialFilters: FiltersState
  onReset: () => void
}

const meta: Meta<CustomFilterSidebarArgs> = {
  title: 'Widgets/FilterSidebar',
  component: FilterSidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', background: '#f9fafb', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<CustomFilterSidebarArgs>

const renderFilterSidebar = (args: CustomFilterSidebarArgs) => {
  const [filters, setFilters] = useState<FiltersState>(args.initialFilters || INITIAL_FILTERS_STATE)

  return (
    <FilterSidebar
      filters={filters}
      setFilters={setFilters}
      onReset={() => {
        setFilters(INITIAL_FILTERS_STATE)
        args.onReset?.()
      }}
    />
  )
}

export const Default: Story = {
  render: renderFilterSidebar,
  args: {
    initialFilters: INITIAL_FILTERS_STATE,
    onReset: fn(),
    filters: INITIAL_FILTERS_STATE,
    setFilters: () => {},
  },
}

export const WithActiveFilters: Story = {
  render: renderFilterSidebar,
  args: {
    initialFilters: {
      ...INITIAL_FILTERS_STATE,
      mode: 'wantToLearn',
      skillIds: [subcategoryId],
      cities: [firstCity, secondCity],
    },
    onReset: fn(),
    filters: INITIAL_FILTERS_STATE,
    setFilters: () => {},
  },
}
