import type { CategoryId } from '@/shared/lib/constants'
import styles from './Chip.module.css'
import clsx from 'clsx'

interface ChipProps {
  label: string
  category?: CategoryId
}

export function Chip({ label, category }: ChipProps) {
  return <span className={clsx(styles.chip, category && styles[category])}>{label}</span>
}
