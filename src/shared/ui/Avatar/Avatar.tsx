import { useState } from 'react'
import styles from './Avatar.module.css'
import clsx from 'clsx'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  src: string | null
  alt: string
  size?: AvatarSize
}

export function Avatar({ src, alt, size = 'md' }: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return null
  }
  return (
    <img
      className={clsx(styles.avatar, styles[size])}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
    />
  )
}
