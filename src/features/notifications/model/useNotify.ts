import { useAppDispatch } from '@/store/hooks'
import { addNotification } from './notificationsSlice'

const DEFAULT_DURATION = 5000

export function useNotify() {
  const dispatch = useAppDispatch()

  return {
    success: (message: string, title = 'Успешно') =>
      dispatch(addNotification({ type: 'success', title, message, duration: DEFAULT_DURATION })),
    error: (message: string, title = 'Ошибка') =>
      dispatch(addNotification({ type: 'error', title, message, duration: DEFAULT_DURATION })),
    info: (message: string, title = 'Инфо') =>
      dispatch(addNotification({ type: 'info', title, message, duration: DEFAULT_DURATION })),
  }
}
