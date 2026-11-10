import { ReactNode } from 'react'
import { Modal, Title, Text, Button } from '@/shared/ui'
import penIcon from './pen.svg'
import styles from './OfferConfirmationModal.module.css'

interface OfferConfirmationModalProps {
  isOpen: boolean
  /** «Редактировать» — закрывает модалку, пользователь возвращается к шагу 3 */
  onClose: () => void
  /** «Готово» — подтверждение данных */
  onConfirm: () => void
  /** Содержимое модалки: описание навыка + галерея (виджет) */
  children: ReactNode
}

export function OfferConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  children,
}: OfferConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className={styles.content}>
        <div className={styles.header}>
          <Title level={2} className={styles.headerTitle}>
            Ваше предложение
          </Title>
          <Text variant="sm" className={styles.headerSubtitle}>
            Пожалуйста, проверьте и подтвердите правильность данных
          </Text>
        </div>

        <div className={styles.body}>{children}</div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="md"
            trailingIcon={<img src={penIcon} alt="" width={24} height={24} />}
            onClick={onClose}
          >
            Редактировать
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm}>
            Готово
          </Button>
        </div>
      </div>
    </Modal>
  )
}
