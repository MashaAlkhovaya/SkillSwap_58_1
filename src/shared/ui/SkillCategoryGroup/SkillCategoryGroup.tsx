import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Checkbox, CheckboxGroup } from '../Checkbox'
import { Category, SubCategoryId } from '../../lib/constants'
import { ChevronDown } from '@/shared/ui/icons'
import styles from './SkillCategoryGroup.module.css'

interface SkillCategoryGroupProps {
  category: Category
  selectedSkills: SubCategoryId[]
  onChange: (skills: SubCategoryId[]) => void
  forceCollapse?: number
}

export const SkillCategoryGroup = ({
  category,
  selectedSkills,
  onChange,
  forceCollapse,
}: SkillCategoryGroupProps) => {
  const categorySubIds = category.subcategories.map((sub) => sub.id)

  const selectedSubs = selectedSkills.filter((id) => categorySubIds.includes(id))

  const isAllSelected = selectedSubs.length === categorySubIds.length && categorySubIds.length > 0
  const isIndeterminate = selectedSubs.length > 0 && !isAllSelected

  const [isExpanded, setIsExpanded] = useState(selectedSubs.length > 0)

  useEffect(() => {
    if (isIndeterminate) setIsExpanded(true)
  }, [isIndeterminate])

  useEffect(() => {
    if (forceCollapse !== undefined && forceCollapse > 0) {
      setIsExpanded(false)
    }
  }, [forceCollapse])

  const handleCategoryChange = (checked: boolean) => {
    if (checked) {
      onChange([...new Set([...selectedSkills, ...categorySubIds])])
    } else {
      onChange(selectedSkills.filter((id) => !categorySubIds.includes(id)))
    }
  }

  const handleSubsChange = (newSelectedSubs: string[]) => {
    const otherSkills = selectedSkills.filter((id) => !categorySubIds.includes(id))
    onChange([...otherSkills, ...(newSelectedSubs as SubCategoryId[])])
  }

  return (
    <div className={clsx(styles.container, { [styles.isExpanded]: isExpanded })}>
      <div className={styles.header}>
        <Checkbox
          label={category.title}
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={handleCategoryChange}
        />

        <button
          type="button"
          className={styles.expandBtn}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Свернуть категорию' : 'Развернуть категорию'}
          aria-expanded={isExpanded}
        >
          <ChevronDown className={clsx(styles.icon, { [styles.rotated]: isExpanded })} />
        </button>
      </div>

      <div className={clsx(styles.collapsible, { [styles.expanded]: isExpanded })}>
        <div className={styles.subcategoriesInner}>
          <div className={styles.subcategories}>
            <CheckboxGroup
              options={category.subcategories.map((sub) => ({ value: sub.id, label: sub.title }))}
              values={selectedSubs}
              onChange={handleSubsChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
