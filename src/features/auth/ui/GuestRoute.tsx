import { Navigate, Outlet } from 'react-router-dom'
import { selectAuthUser, selectSessionCheckStatus } from '../model/authSlice'
import { ROUTES } from '@/shared/lib/constants'
import { Skeleton } from '@/shared/ui'
import { useAppSelector } from '@/store/hooks'

export function GuestRoute() {
  const user = useAppSelector(selectAuthUser)
  const sessionCheckStatus = useAppSelector(selectSessionCheckStatus)

  if (sessionCheckStatus === 'checking') {
    return <Skeleton width="100%" height="320px" />
  }

  if (sessionCheckStatus === 'error') {
    return (
      <div role="alert">
        <p>Не удалось проверить вход. Проверьте подключение и попробуйте ещё раз.</p>

        <button type="button" onClick={() => window.location.reload()}>
          Повторить
        </button>
      </div>
    )
  }

  if (user) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}
