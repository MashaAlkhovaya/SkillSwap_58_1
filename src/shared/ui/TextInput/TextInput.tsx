import clsx from 'clsx'
import styles from './TextInput.module.css'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
}

export const TextInput = ({
  className,
  disabled,
  value,
  placeholder,
  onChange,
  type = 'text',
  leftContent,
  rightContent,
  ...props
}: TextInputProps) => {
  const isDisabled = disabled ?? false

  return (
    <div className={clsx(styles.wrapper, isDisabled && styles.wrapperDisabled, className)}>
      {leftContent && <div className={styles.sideContent}>{leftContent}</div>}

      <input
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
}
