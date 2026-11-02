import styles from './SelectCustom.module.css'
import { useId } from 'react'
import Select, { type ClearIndicatorProps } from 'react-select'

interface SelectItem {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectItem[]
  onChange: (values: string[]) => void
  disabled?: boolean
  className?: string
}

const ClearIndicator = ({ clearValue }: ClearIndicatorProps<SelectItem>) => (
  <button
    type="button"
    className={styles.clearIndicator}
    aria-label="Очистить выбор"
    onMouseDown={(event) => event.preventDefault()}
    onClick={clearValue}
  >
    ×
  </button>
)

export const SelectCustom = ({
  label,
  placeholder,
  options,
  onChange,
  disabled = false,
  className,
}: SelectProps) => {
  const id = useId()
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <Select<SelectItem>
        inputId={id}
        options={options}
        placeholder={placeholder ?? ''}
        isDisabled={disabled}
        isClearable
        onChange={(selected) => onChange(selected ? [selected.value] : [])}
        components={{ ClearIndicator }}
        className={className}
        classNames={{
          control: () => styles.control,
          option: () => styles.option,
        }}
      />
    </div>
  )
}
