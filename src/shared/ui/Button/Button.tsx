import clsx from 'clsx'
import styles from './Button.module.css'
import { ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  trailingIcon?: ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  children,
  className,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) => {
  const isDisabled = disabled

  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        className,
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {trailingIcon && (
        <span className={styles.trailingIcon} aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  )
}
