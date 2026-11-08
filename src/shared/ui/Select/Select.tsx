import styles from './Select.module.css'
import { forwardRef, useCallback, useId, useRef } from 'react'
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
  { label, placeholder, options, onChange, disabled = false, className },
  ref,
) {
  const id = useId()
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
        placeholder={placeholder ?? ''}
        isDisabled={disabled}
        isClearable
        onChange={(selected) => onChange(selected ? [selected.value] : [])}
        components={{ ClearIndicator }}
        className={className}
        classNames={{
          control: () => styles.control,
          option: () => styles.option,
          singleValue: () => styles.singleValue,
          placeholder: () => styles.placeholder,
          input: () => styles.input,
          menu: () => styles.menu,
        }}
        styles={{
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
