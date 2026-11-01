import styles from './SelectCustom.module.css'
import { useId } from 'react'
import Select, { components, type OptionProps } from 'react-select'
import { Checkbox } from '../Checkbox'

interface SelectItem {
  value: string
  label: string
  key?: string
  title?: boolean
}

interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectItem[]
  onChange: (values: string[]) => void
  disabled?: boolean
  className?: string
}

const CheckboxOption = (props: OptionProps<SelectItem, true>) => (
  <components.Option {...props}>
    {/* <span className={styles.optionCheckbox}> */}
    <Checkbox
      label={props.label}
      checked={props.isSelected}
      onChange={() => undefined}
      className={styles.optionCheckbox}
    />
    {/* </span> */}
  </components.Option>
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
      <Select<SelectItem, true>
        id={id}
        options={options}
        placeholder={placeholder ?? ''}
        isMulti
        isDisabled={disabled}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ Option: CheckboxOption }}
        onChange={(selected) => onChange(selected.map((option) => option.value))}
        className={className}
        classNames={{
          control: () => styles.control,
          option: () => styles.option,
        }}
        styles={{
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? 'transparent'
              : state.isFocused
                ? 'var(--color-bg-secondary)'
                : 'transparent',
            color: 'inherit',
          }),
        }}
      />
    </div>
  )
}
