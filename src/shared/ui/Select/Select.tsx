import clsx from 'clsx'
import styles from './Select.module.css'
import { useId } from 'react'

interface SelectItemProps {
  value: string
  label: string
  key: string
  title?: boolean
}

interface SelectProps {
  name: string
  options: SelectItemProps[]
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export const Select = ({ name, options, onChange, disabled = false, className }: SelectProps) => {
  const id = useId()
  const placeholder = options.find((item) => item.title)

  return (
    <div className={clsx(styles.wrapper, disabled && styles.wrapperDisabled, className)}>
      <select
        id={id}
        name={name}
        disabled={disabled}
        className={clsx(styles.input, disabled && styles.inputDisabled)}
        defaultValue={placeholder?.value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((item) => (
          <option value={item.value} disabled={item.title} key={item.key} label={item.label}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )
}
