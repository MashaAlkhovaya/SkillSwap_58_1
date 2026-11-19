import { generatePath, Navigate, useLocation } from 'react-router'
import { useAppSelector } from '@/store/hooks'
import { AuthDecoration, AuthWidget } from '@/widgets'
import {
  selectIsAuthenticated,
  selectIsLoginInProgress,
  selectSessionCheckStatus,
} from '@/features/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'
import { getAuthReturnPath } from '@/shared/lib/authRedirect'
import { Skeleton } from '@/shared/ui'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { state } = useLocation()
  const skillId: unknown = state?.returnToSkillId

  const returnTo =
    typeof skillId === 'string' && skillId
      ? generatePath(ROUTES.SKILL, { id: encodeURIComponent(skillId) })
      : getAuthReturnPath(state)

  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isLoginInProgress = useAppSelector(selectIsLoginInProgress)
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

  if (isAuthenticated && !isLoginInProgress) {
    return <Navigate to={returnTo} replace />
  }

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <AuthWidget returnTo={returnTo} />
        <AuthDecoration />
      </div>
    </main>
  )
}
