import { TextInput, SearchIcon } from '@/shared/ui'
import styles from './SkillSearcher.module.css'

interface SkillSearcherProps {
  value: string
  onChange: (value: string) => void
}

export function SkillSearcher({ value, onChange }: SkillSearcherProps) {
  return (
    <TextInput
      className={styles.searchInput}
      placeholder="Искать навык"
      leftContent={<SearchIcon size={20} color="var(--color-text-secondary)" />}
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  )
}
