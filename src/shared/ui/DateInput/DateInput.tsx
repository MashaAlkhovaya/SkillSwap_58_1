import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { TextInput } from '../TextInput'
import { Button } from '../Button'
import { DayPicker } from 'react-day-picker'
import { ru } from 'date-fns/locale'
import 'react-day-picker/style.css'
import styles from './DateInput.module.css'

interface DateInputProps {
  name: string
  label?: string
  value?: Date | string | null
  onChange?: (date: Date | string | null) => void
  disabled?: boolean
  className?: string
}

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.34904 6.18605C7.96765 6.18605 7.65137 5.86977 7.65137 5.48837V2.69767C7.65137 2.31628 7.96765 2 8.34904 2C8.73044 2 9.04672 2.31628 9.04672 2.69767V5.48837C9.04672 5.86977 8.73044 6.18605 8.34904 6.18605Z"
      fill="#253017"
    />
    <path
      d="M15.7904 6.18605C15.4091 6.18605 15.0928 5.86977 15.0928 5.48837V2.69767C15.0928 2.31628 15.4091 2 15.7904 2C16.1718 2 16.4881 2.31628 16.4881 2.69767V5.48837C16.4881 5.86977 16.1718 6.18605 15.7904 6.18605Z"
      fill="#253017"
    />
    <path
      d="M8.81402 14.3256C8.69309 14.3256 8.57216 14.2977 8.46053 14.2512C8.3396 14.2047 8.24658 14.1396 8.15356 14.0559C7.98612 13.8791 7.88379 13.6466 7.88379 13.3954C7.88379 13.2745 7.9117 13.1535 7.95821 13.0419C8.00472 12.9303 8.06984 12.828 8.15356 12.735C8.24658 12.6512 8.3396 12.5861 8.46053 12.5396C8.79542 12.4 9.21402 12.4745 9.47449 12.735C9.64193 12.9117 9.74425 13.1535 9.74425 13.3954C9.74425 13.4512 9.73495 13.5164 9.72565 13.5815C9.71635 13.6373 9.69774 13.6931 9.66983 13.7489C9.65123 13.8047 9.62333 13.8605 9.58612 13.9163C9.55821 13.9628 9.5117 14.0094 9.47449 14.0559C9.29774 14.2233 9.05588 14.3256 8.81402 14.3256Z"
      fill="#253017"
    />
    <path
      d="M12.0699 14.3256C11.949 14.3256 11.828 14.2977 11.7164 14.2512C11.5955 14.2047 11.5024 14.1396 11.4094 14.0558C11.242 13.8791 11.1396 13.6466 11.1396 13.3954C11.1396 13.2745 11.1676 13.1535 11.2141 13.0419C11.2606 12.9303 11.3257 12.828 11.4094 12.7349C11.5024 12.6512 11.5955 12.5861 11.7164 12.5396C12.0513 12.3907 12.4699 12.4745 12.7303 12.7349C12.8978 12.9117 13.0001 13.1535 13.0001 13.3954C13.0001 13.4512 12.9908 13.5163 12.9815 13.5815C12.9722 13.6373 12.9536 13.6931 12.9257 13.7489C12.9071 13.8047 12.8792 13.8605 12.842 13.9163C12.8141 13.9628 12.7676 14.0093 12.7303 14.0558C12.5536 14.2233 12.3117 14.3256 12.0699 14.3256Z"
      fill="#253017"
    />
    <path
      d="M15.3257 14.3256C15.2048 14.3256 15.0839 14.2977 14.9723 14.2512C14.8513 14.2047 14.7583 14.1396 14.6653 14.0558C14.6281 14.0093 14.5909 13.9628 14.5536 13.9163C14.5164 13.8605 14.4885 13.8047 14.4699 13.7489C14.442 13.6931 14.4234 13.6373 14.4141 13.5815C14.4048 13.5163 14.3955 13.4512 14.3955 13.3954C14.3955 13.1535 14.4978 12.9117 14.6653 12.7349C14.7583 12.6512 14.8513 12.5861 14.9723 12.5396C15.3164 12.3907 15.7257 12.4745 15.9862 12.7349C16.1536 12.9117 16.256 13.1535 16.256 13.3954C16.256 13.4512 16.2467 13.5163 16.2374 13.5815C16.2281 13.6373 16.2095 13.6931 16.1816 13.7489C16.1629 13.8047 16.135 13.8605 16.0978 13.9163C16.0699 13.9628 16.0234 14.0093 15.9862 14.0558C15.8095 14.2233 15.5676 14.3256 15.3257 14.3256Z"
      fill="#253017"
    />
    <path
      d="M8.81402 17.5814C8.69309 17.5814 8.57216 17.5535 8.46053 17.507C8.3489 17.4605 8.24658 17.3953 8.15356 17.3116C7.98612 17.1349 7.88379 16.893 7.88379 16.6511C7.88379 16.5302 7.9117 16.4093 7.95821 16.2976C8.00472 16.1767 8.06984 16.0744 8.15356 15.9907C8.49774 15.6465 9.1303 15.6465 9.47449 15.9907C9.64193 16.1674 9.74425 16.4093 9.74425 16.6511C9.74425 16.893 9.64193 17.1349 9.47449 17.3116C9.29774 17.479 9.05588 17.5814 8.81402 17.5814Z"
      fill="#253017"
    />
    <path
      d="M12.0699 17.5814C11.828 17.5814 11.5862 17.479 11.4094 17.3116C11.242 17.1349 11.1396 16.893 11.1396 16.6511C11.1396 16.5302 11.1676 16.4093 11.2141 16.2976C11.2606 16.1767 11.3257 16.0744 11.4094 15.9907C11.7536 15.6465 12.3862 15.6465 12.7303 15.9907C12.8141 16.0744 12.8792 16.1767 12.9257 16.2976C12.9722 16.4093 13.0001 16.5302 13.0001 16.6511C13.0001 16.893 12.8978 17.1349 12.7303 17.3116C12.5536 17.479 12.3117 17.5814 12.0699 17.5814Z"
      fill="#253017"
    />
    <path
      d="M15.3257 17.5814C15.0839 17.5814 14.842 17.4791 14.6653 17.3116C14.5816 17.2279 14.5164 17.1256 14.4699 17.0046C14.4234 16.893 14.3955 16.7721 14.3955 16.6512C14.3955 16.5302 14.4234 16.4093 14.4699 16.2977C14.5164 16.1767 14.5816 16.0744 14.6653 15.9907C14.8792 15.7767 15.2048 15.6744 15.5025 15.7395C15.5676 15.7488 15.6234 15.7674 15.6792 15.7953C15.735 15.8139 15.7909 15.8419 15.8467 15.8791C15.8932 15.907 15.9397 15.9535 15.9862 15.9907C16.1536 16.1674 16.256 16.4093 16.256 16.6512C16.256 16.893 16.1536 17.1349 15.9862 17.3116C15.8095 17.4791 15.5676 17.5814 15.3257 17.5814Z"
      fill="#253017"
    />
    <path
      d="M19.9765 9.99069H4.16252C3.78112 9.99069 3.46484 9.67441 3.46484 9.29301C3.46484 8.91162 3.78112 8.59534 4.16252 8.59534H19.9765C20.3579 8.59534 20.6741 8.91162 20.6741 9.29301C20.6741 9.67441 20.3579 9.99069 19.9765 9.99069Z"
      fill="#253017"
    />
    <path
      d="M15.7907 22H8.34884C4.95349 22 3 20.0465 3 16.6512V8.74422C3 5.34887 4.95349 3.39539 8.34884 3.39539H15.7907C19.186 3.39539 21.1395 5.34887 21.1395 8.74422V16.6512C21.1395 20.0465 19.186 22 15.7907 22ZM8.34884 4.79073C5.68837 4.79073 4.39535 6.08376 4.39535 8.74422V16.6512C4.39535 19.3117 5.68837 20.6047 8.34884 20.6047H15.7907C18.4512 20.6047 19.7442 19.3117 19.7442 16.6512V8.74422C19.7442 6.08376 18.4512 4.79073 15.7907 4.79073H8.34884Z"
      fill="#253017"
    />
  </svg>
)
const CustomChevron = () => (
  <svg
    width="16"
    height="8"
    viewBox="0 0 16 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ pointerEvents: 'none' }}
  >
    <path
      d="M8 7.93539C7.35391 7.93539 6.70782 7.68618 6.21863 7.197L0.20075 1.17912C-0.0669166 0.91145 -0.0669166 0.468416 0.20075 0.20075C0.468416 -0.0669166 0.911451 -0.0669166 1.17912 0.20075L7.197 6.21863C7.64003 6.66167 8.35997 6.66167 8.803 6.21863L14.8209 0.20075C15.0885 -0.0669166 15.5316 -0.0669166 15.7992 0.20075C16.0669 0.468416 16.0669 0.91145 15.7992 1.17912L9.78137 7.197C9.29218 7.68618 8.64609 7.93539 8 7.93539Z"
      fill="#253017"
    />
  </svg>
)

const MAX_DIGITS = 8
const formatDigits = (digits: string) => {
  const d = digits.slice(0, MAX_DIGITS)
  const parts = [d.slice(0, 2), d.slice(2, 4), d.slice(4, MAX_DIGITS)].filter(Boolean)
  return parts.join('.')
}

export const DateInput = ({
  name,
  label,
  value,
  onChange,
  disabled = false,
  className,
}: DateInputProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value instanceof Date ? value : undefined,
  )
  const [manualInput, setManualInput] = useState<string>(typeof value === 'string' ? value : '')
  const displayValue =
    manualInput || (value instanceof Date ? new Date(value).toLocaleDateString('ru-RU') : '')

  const togglePopup = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }

  const openPopup = () => {
    if (!disabled) setIsOpen(true)
  }

  const handleConfirm = () => {
    let result: Date | string | null = null
    if (manualInput.trim() !== '') {
      result = manualInput
    } else if (selectedDate !== undefined) {
      result = selectedDate
    }

    onChange?.(result)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setSelectedDate(value instanceof Date ? value : undefined)
    setManualInput(typeof value === 'string' ? value : '')
    setIsOpen(false)
  }

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '')
    setManualInput(formatDigits(digits))
  }

  useEffect(() => {
    const handleCloseEvents = (event: Event) => {
      if (!isOpen || !wrapperRef.current) return

      if (event.type === 'mousedown' && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }

      if (event.type === 'keydown' && (event as KeyboardEvent).key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleCloseEvents)
    document.addEventListener('keydown', handleCloseEvents)
    return () => {
      document.removeEventListener('mousedown', handleCloseEvents)
      document.removeEventListener('keydown', handleCloseEvents)
    }
  }, [isOpen])

  const currentYear = new Date().getFullYear()
  const startMonth = new Date(1950, 0)
  const endMonth = new Date(currentYear, 11)

  return (
    <div ref={wrapperRef} className={clsx('date-input-wrapper', className, styles.wrapper)}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <TextInput
          id={name}
          type="text"
          inputMode="numeric"
          placeholder="дд.мм.гггг"
          maxLength={10}
          value={displayValue}
          onChange={handleManualInputChange}
          onFocus={openPopup}
          aria-label={label || 'Дата'}
          data-testid="date-input-field"
          disabled={disabled}
          className={styles.input}
          aria-expanded={isOpen}
          aria-controls="date-picker-popup"
          rightContent={
            <Button
              type="button"
              className={styles.calendarBtn}
              aria-label="Открыть календарь"
              data-testid="calendar-toggle"
              variant="tertiary"
              size="sm"
              disabled={disabled}
              onClick={togglePopup}
            >
              <CalendarIcon />
            </Button>
          }
        />
      </div>

      {isOpen && !disabled && (
        <div id="date-picker-popup" className={styles.popup} data-testid="date-picker-popup">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date)
              if (date) {
                setManualInput(
                  `${String(date.getDate()).padStart(2, '0')}.` +
                    `${String(date.getMonth() + 1).padStart(2, '0')}.` +
                    `${date.getFullYear()}`,
                )
              }
            }}
            locale={ru}
            captionLayout="dropdown"
            hideNavigation={true}
            startMonth={startMonth}
            endMonth={endMonth}
            showOutsideDays={true}
            components={{
              Chevron: CustomChevron,
            }}
            classNames={{
              months: styles.monthsContainer,
              month_caption: styles.monthCaption,
              weekday: styles.weekday,
              day: styles.day,
              outside: styles.dayOutside,
              selected: styles.daySelected,
            }}
            footer={
              <div className={styles.footer}>
                <Button variant="secondary" size="md" onClick={handleCancel}>
                  Отменить
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleConfirm}
                  disabled={!(manualInput.trim() !== '' || selectedDate !== undefined)}
                  data-testid="confirm-btn"
                >
                  Выбрать
                </Button>
              </div>
            }
          />
        </div>
      )}
    </div>
  )
}
