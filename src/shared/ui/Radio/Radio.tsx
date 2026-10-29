import { useId } from 'react'
import { RadioIcon } from './RadioIcon'
import styles from './Radio.module.css'
import clsx from 'clsx'

interface RadioProps {
  label: string
  value: string
  name: string
  checked: boolean
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export const Radio = ({
  label,
  value,
  name,
  checked,
  onChange,
  disabled = false,
  className,
}: RadioProps) => {
  const id = useId()

  return (
    <label htmlFor={id} className={clsx(styles.label, { [styles.disabled]: disabled }, className)}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        disabled={disabled}
        className={styles.hiddenInput}
        data-testid={`radio-${value}`}
      />
      <span className={clsx(styles.iconWrapper, { [styles.active]: checked })}>
        <RadioIcon width={20} height={20} />
      </span>

      <span className={styles.text}>{label}</span>
    </label>
  )
}
