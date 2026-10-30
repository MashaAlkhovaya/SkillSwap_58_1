import type { ElementType, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Text.module.css'

const variants = {
  sm: styles.sm,
  base: styles.base,
  lg: styles.lg,
  xl: styles.xl,
  '2xl': styles.size2xl,
} as const

const weights = {
  regular: styles.regular,
  medium: styles.medium,
  bold: styles.bold,
} as const

const colors = {
  text: styles.text,
  secondary: styles.secondary,
  error: styles.error,
  success: styles.success,
} as const

export type TextVariant = keyof typeof variants
export type TextWeight = keyof typeof weights
export type TextColor = keyof typeof colors

type TextProps = {
  variant?: TextVariant
  weight?: TextWeight
  color?: TextColor
  italic?: boolean
  as?: ElementType
  className?: string
  children: ReactNode
}

export function Text({
  variant = 'base',
  weight,
  color,
  italic = false,
  as: Component = 'span',
  className,
  children,
}: TextProps) {
  return (
    <Component
      className={clsx(
        styles.root,
        variants[variant],
        weight && weights[weight],
        color && colors[color],
        italic && styles.italic,
        className,
      )}
    >
      {children}
    </Component>
  )
}
