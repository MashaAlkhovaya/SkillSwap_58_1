import { Navigate } from 'react-router'
import { useAppSelector } from '@/store/hooks'
import { AuthDecoration, AuthWidget } from '@/widgets'
import { selectIsAuthenticated } from '@/features/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <AuthWidget />
        <AuthDecoration />
      </div>
    </main>
  )
}
