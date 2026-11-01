import clsx from 'clsx'
import { Checkbox } from './Checkbox'
import styles from './CheckboxGroup.module.css'

export interface CheckboxGroupOption {
  value: string
  label: string
  disabled?: boolean
}

interface CheckboxGroupProps {
  options: CheckboxGroupOption[]
  values: string[]
  onChange: (values: string[]) => void
  className?: string
}

export const CheckboxGroup = ({ options, values, onChange, className }: CheckboxGroupProps) => {
  const handleToggle = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...values, value])
    } else {
      onChange(values.filter((v) => v !== value))
    }
  }

  return (
    <div className={clsx(styles.group, className)}>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          disabled={option.disabled}
          checked={values.includes(option.value)}
          onChange={(checked) => handleToggle(option.value, checked)}
        />
      ))}
    </div>
  )
}
