import { useState } from 'react'
import styles from './RadioGroup.module.css'
import clsx from 'clsx'
import { Radio } from './Radio'

export interface RadioGroupOption {
  value: string
  label: string
  disabled?: boolean
}

interface RadioGroupProps {
  name: string
  options: RadioGroupOption[]
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  optionClassName?: string
}

export const RadioGroup = ({
  name,
  options,
  defaultValue = '',
  value: controlledValue,
  onChange,
  className,
  optionClassName,
}: RadioGroupProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const selectedValue = isControlled ? controlledValue : internalValue

  const handleChange = (newValue: string) => {
    if (!isControlled) setInternalValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div role="radiogroup" className={clsx(styles.group, className)} aria-label={`Группа ${name}`}>
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          disabled={option.disabled}
          checked={selectedValue === option.value}
          onChange={handleChange}
          className={optionClassName}
        />
      ))}
    </div>
  )
}
