import { TextInput, SearchIcon, CloseIcon } from '@/shared/ui'
import styles from './SkillInput.module.css'

interface SkillInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SkillInput = ({ value, onChange, placeholder = 'Искать навык' }: SkillInputProps) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      leftContent={<SearchIcon width={20} height={20} color="var(--color-text-secondary)" />}
      rightContent={
        value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className={styles.clearButton}
            aria-label="Очистить поиск"
          >
            <CloseIcon width={16} height={16} />
          </button>
        ) : null
      }
    />
  )
}
