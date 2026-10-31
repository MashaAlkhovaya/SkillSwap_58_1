import clsx from 'clsx'
import { useState, useRef, useEffect } from 'react'
import styles from './SelectCustom.module.css'
import { useId } from 'react'

interface SelectItemProps {
  value: string
  label: string
  key: string
  title?: boolean
}

interface SelectProps {
  options: SelectItemProps[]
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export const SelectCustom = ({ options, onChange, disabled = false, className }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<SelectItemProps | undefined>(
    () => options.find((option) => option.title) ?? options[0],
  )
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()

  const filteredIndexes = options.reduce<number[]>((indexes, option, index) => {
    const matchesSearch = option.label
      .toLocaleLowerCase()
      .includes(search.trim().toLocaleLowerCase())
    return !option.title && matchesSearch ? [...indexes, index] : indexes
  }, [])

  const getInitialActiveIndex = () => {
    const selectedIndex = options.findIndex((option) => option.value === selected?.value)
    return filteredIndexes.includes(selectedIndex) ? selectedIndex : filteredIndexes[0]
  }

  const openDropdown = (index = getInitialActiveIndex()) => {
    if (filteredIndexes.length === 0) return
    setActiveIndex(index)
    setIsOpen(true)
  }

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: SelectItemProps) => {
    if (option.title || disabled) return

    setSelected(option)
    setIsOpen(false)
    setSearch('')
    setIsFocused(false)
    onChange(option.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    if (event.currentTarget instanceof HTMLInputElement && event.key === ' ') return

    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openDropdown()
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        openDropdown(filteredIndexes[filteredIndexes.length - 1])
      }
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      setSearch('')
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (activeIndex !== null) handleSelect(options[activeIndex])
      return
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(
        event.key === 'Home' ? filteredIndexes[0] : filteredIndexes[filteredIndexes.length - 1],
      )
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      if (filteredIndexes.length === 0) return
      const currentPosition = filteredIndexes.indexOf(activeIndex ?? filteredIndexes[0])
      const nextPosition =
        (currentPosition + direction + filteredIndexes.length) % filteredIndexes.length
      setActiveIndex(filteredIndexes[nextPosition])
    }
  }

  return (
    <div className={clsx(styles.dropdownContainer, className)} ref={dropdownRef} id={id}>
      {/* Кнопка (триггер) */}
      <div
        className={clsx(styles.dropdownTrigger, isOpen && styles.open)}
        onClick={() => {
          inputRef.current?.focus()
          if (!isOpen) openDropdown()
        }}
      >
        <input
          aria-label="Выберите вариант"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={
            isOpen && activeIndex !== null ? `${id}-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          className={styles.triggerInput}
          disabled={disabled}
          ref={inputRef}
          onChange={(event) => {
            const value = event.target.value
            setSearch(value)
            setIsOpen(true)
            const firstMatch = options.findIndex(
              (option) =>
                !option.title &&
                option.label.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()),
            )
            setActiveIndex(firstMatch === -1 ? null : firstMatch)
          }}
          onFocus={() => {
            setIsFocused(true)
            setSearch('')
          }}
          onBlur={() => {
            setIsFocused(false)
            setIsOpen(false)
            setSearch('')
          }}
          onKeyDown={handleKeyDown}
          placeholder={isFocused ? '' : selected?.label}
          role="combobox"
          value={search}
        />
        <button
          aria-label={isOpen ? 'Закрыть список' : 'Открыть список'}
          className={styles.arrowButton}
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.stopPropagation()
            inputRef.current?.focus()
            if (isOpen) {
              setIsOpen(false)
              setSearch('')
            } else {
              openDropdown()
            }
          }}
          tabIndex={-1}
          type="button"
        >
          <svg
            className={clsx(styles.arrow, isOpen && styles.arrowOpen)}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="m4 6 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <ul className={styles.dropdownMenu} id={`${id}-listbox`} role="listbox">
          {!search.trim() &&
            options.map((option) =>
              option.title ? (
                <li
                  key={option.key}
                  className={clsx(styles.dropdownItem, styles.disabledItem)}
                  role="option"
                  aria-selected={selected?.value === option.value}
                  aria-disabled="true"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {option.label}
                </li>
              ) : null,
            )}
          {filteredIndexes.length > 0 ? (
            filteredIndexes.map((index) => {
              const option = options[index]

              return (
                <li
                  key={option.key}
                  id={`${id}-option-${index}`}
                  className={clsx(
                    styles.dropdownItem,
                    selected?.value === option.value && styles.selected,
                    activeIndex === index && styles.activeItem,
                  )}
                  onClick={() => handleSelect(option)}
                  onMouseDown={(event) => event.preventDefault()}
                  role="option"
                  aria-selected={selected?.value === option.value}
                >
                  {option.label}
                </li>
              )
            })
          ) : (
            <li className={styles.emptyMessage} role="presentation">
              Ничего не найдено
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
