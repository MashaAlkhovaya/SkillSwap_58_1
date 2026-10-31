import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { CheckboxGroup } from './CheckboxGroup'
import { Checkbox } from './Checkbox'

const SKILLS = [
  { value: '1', label: 'Бизнес и карьера' },
  { value: '2', label: 'Творчество и искусство' },
  { value: '3', label: 'Иностранные языки' },
  { value: '4', label: 'Образование и развитие' },
  { value: '5', label: 'Дом и уют' },
  { value: '6', label: 'Здоровье и лайфстайл' },
]

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Shared/UI/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
}

export default meta

type Story = StoryObj<typeof CheckboxGroup>

const renderCheckboxGroup = (args: any) => {
  const [values, setValues] = useState<string[]>(['2'])

  return (
    <CheckboxGroup
      {...args}
      values={values}
      onChange={(newValues) => {
        setValues(newValues)
        args.onChange?.(newValues)
      }}
    />
  )
}

export const Default: Story = {
  render: renderCheckboxGroup,
  args: {
    options: SKILLS,
    onChange: fn(),
  },
}

export const WithDisabledOption: Story = {
  render: renderCheckboxGroup,
  args: {
    options: [...SKILLS, { value: '6', label: 'Недоступный навык', disabled: true }],
    onChange: fn(),
  },
}

export const WithIndeterminateParent: Story = {
  render: () => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['2']) //

    const allValues = SKILLS.map((s) => s.value)

    const isAllSelected = selectedSkills.length === allValues.length
    const isIndeterminate = selectedSkills.length > 0 && !isAllSelected

    const handleSelectAll = (checked: boolean) => {
      setSelectedSkills(checked ? allValues : [])
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Checkbox
          label="Выбрать все навыки"
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={handleSelectAll}
        />

        <div style={{ paddingLeft: '28px' }}>
          <CheckboxGroup options={SKILLS} values={selectedSkills} onChange={setSelectedSkills} />
        </div>
      </div>
    )
  },
}
