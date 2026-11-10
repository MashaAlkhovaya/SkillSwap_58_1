import styles from './Select.module.css'
import { forwardRef, useCallback, useId, useRef, useState } from 'react'
import ReactSelect, { type ClearIndicatorProps, type SelectInstance } from 'react-select'

interface SelectItem {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectItem[]
  onChange: (values: string[]) => void
  value?: string
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

export const Select = forwardRef<HTMLInputElement, SelectProps>(function Select(
  { label, placeholder, options, onChange, value, disabled = false, className },
  ref,
) {
  const id = useId()
  const [internalValue, setInternalValue] = useState<SelectItem | null>(null)
  const selectedValue =
    value === undefined ? internalValue : (options.find((option) => option.value === value) ?? null)
  const forwardedRef = useRef(ref)
  forwardedRef.current = ref
  const setSelectRef = useCallback((instance: SelectInstance<SelectItem> | null) => {
    const node = instance?.inputRef ?? null
    const currentRef = forwardedRef.current
    if (typeof currentRef === 'function') {
      currentRef(node)
    } else if (currentRef) {
      currentRef.current = node
    }
  }, [])

  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <ReactSelect<SelectItem>
        ref={setSelectRef}
        inputId={id}
        options={options}
        value={selectedValue}
        placeholder={placeholder ?? ''}
        isDisabled={disabled}
        isClearable
        onChange={(selected) => {
          if (value === undefined) setInternalValue(selected)
          onChange(selected ? [selected.value] : [])
        }}
        components={{ ClearIndicator }}
        className={className}
        menuPosition="fixed"
        menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
        classNames={{
          control: () => styles.control,
          option: () => styles.option,
          singleValue: () => styles.singleValue,
          placeholder: () => styles.placeholder,
          input: () => styles.input,
          menu: () => styles.menu,
        }}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 1000 }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'var(--color-bg-secondary)',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? 'var(--color-bg)' : 'transparent',
            color: 'var(--color-text)',
          }),
          singleValue: (base) => ({
            ...base,
            color: 'var(--color-text)',
          }),
        }}
      />
    </div>
  )
})
