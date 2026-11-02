import { useEffect, useId, useRef } from 'react'
import { CheckboxIcon } from './CheckboxIcon'
import styles from './Checkbox.module.css'
import clsx from 'clsx'

export interface CheckboxProps {
  label: string
  checked: boolean
  indeterminate?: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export const Checkbox = ({
  label,
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
  className,
}: CheckboxProps) => {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (indeterminate) {
      onChange(false)
    } else {
      onChange(e.target.checked)
    }
  }

  const visualState = indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'

  return (
    <label htmlFor={id} className={clsx(styles.label, { [styles.disabled]: disabled }, className)}>
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={styles.hiddenInput}
        data-testid={`checkbox-${label}`}
      />
      <span className={styles.iconWrapper}>
        <CheckboxIcon state={visualState} width={20} height={20} />
      </span>
      <span className={styles.text}>{label}</span>
    </label>
  )
}
