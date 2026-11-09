import { FC, useEffect, useRef, useState } from 'react'
import styles from './Notification.module.css'

export type NotificationType = 'success' | 'error' | 'info'

export interface NotificationProps {
  type: NotificationType
  title: string
  message?: string
  duration?: number
  onClose: () => void
}

export const Notification: FC<NotificationProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!duration) return

    if (!isHovered) {
      timerRef.current = setTimeout(() => {
        onClose()
      }, duration)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [duration, isHovered, onClose])

  const typeClass = styles[`notification_${type}`]

  return (
    <div
      className={`${styles.notification} ${typeClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        {/* Если message пустой, блок не рендерится, чтобы не было пустого места */}
        {message && <p className={styles.message}>{message}</p>}
      </div>

      <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
        {/* Иконка крестика */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
