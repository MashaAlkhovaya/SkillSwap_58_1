import React from 'react'
import clsx from 'clsx'
import { ChevronDown } from '../Icons/ChevronDown'
import { Text } from '../Text/Text'
import styles from './FilterSection.module.css'

interface FilterSectionProps {
  title?: string
  children: React.ReactNode
  actionText?: string
  onActionClick?: () => void
  isExpanded?: boolean
  className?: string
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  actionText,
  onActionClick,
  isExpanded = false,
  className,
}: FilterSectionProps) => {
  return (
    <div className={clsx(styles.section, className)}>
      {title && (
        <div className={styles.titleWrapper}>
          <Text variant="lg" weight="bold" as="h3">
            {title}
          </Text>
        </div>
      )}
      <div className={styles.content}>{children}</div>
      {actionText && (
        <button
          type="button"
          className={styles.actionButton}
          onClick={onActionClick}
          aria-expanded={isExpanded}
        >
          <Text variant="sm">{actionText}</Text>
          <ChevronDown
            data-testid="chevron-icon"
            className={clsx(styles.icon, { [styles.rotated]: isExpanded })}
          />
        </button>
      )}
    </div>
  )
}
