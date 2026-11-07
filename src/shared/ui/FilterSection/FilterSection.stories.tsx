import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { FilterSection } from './FilterSection'
import { Checkbox } from '../Checkbox'
import { RadioGroup } from '../Radio'
import { GENDER_OPTIONS, MODE_OPTIONS } from '@/shared/lib/constants'
import { useState } from 'react'

const meta: Meta<typeof FilterSection> = {
  title: 'Shared/UI/FilterSection',
  component: FilterSection,
  tags: ['autodocs'],
  argTypes: {
    onActionClick: { action: 'clicked' },
    isExpanded: { control: 'boolean' },
  },
  args: {
    onActionClick: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', background: '#f9fafb', width: '324px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const StoriesCheckboxes = () => {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)
  const [checked3, setChecked3] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Checkbox label="Бизнес и карьера" checked={checked1} onChange={setChecked1} />
      <Checkbox label="Творчество и искусство" checked={checked2} onChange={setChecked2} />
      <Checkbox label="Иностранные языки" checked={checked3} onChange={setChecked3} />
    </div>
  )
}

export const Default: Story = {
  args: {
    title: 'Навыки',
    actionText: 'Все категории',
    isExpanded: false,
    children: <StoriesCheckboxes />,
  },
}

export const Expanded: Story = {
  args: {
    ...Default.args,
    actionText: 'Скрыть',
    isExpanded: true,
  },
}

export const WithoutTitle: Story = {
  args: {
    children: <RadioGroup name="mode" options={MODE_OPTIONS} value="all" onChange={fn()} />,
  },
}

export const WithoutAction: Story = {
  args: {
    title: 'Пол автора',
    children: (
      <RadioGroup
        name="gender"
        options={GENDER_OPTIONS}
        value="Не имеет значения"
        onChange={fn()}
      />
    ),
  },
}
