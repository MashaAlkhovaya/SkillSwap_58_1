import clsx from 'clsx'
import { forwardRef } from 'react'
import styles from './TextInput.module.css'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    className,
    disabled,
    value,
    placeholder,
    onChange,
    type = 'text',
    leftContent,
    rightContent,
    ...props
  },
  ref,
) {
  const isDisabled = disabled ?? false

  return (
    <div className={clsx(styles.wrapper, isDisabled && styles.wrapperDisabled, className)}>
      {leftContent && <div className={styles.sideContent}>{leftContent}</div>}

      <input
        ref={ref}
        type={type}
        className={clsx(styles.input, isDisabled && styles.inputDisabled)}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      />

      {rightContent && <div className={styles.sideContent}>{rightContent}</div>}
    </div>
  )
})
