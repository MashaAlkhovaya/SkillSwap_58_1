import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { ROUTES } from '@/shared/lib/constants'
import { Skeleton } from '@/shared/ui'
import styles from './MainLayout.module.css'

const LAYOUTLESS_ROUTES: string[] = [ROUTES.LOGIN, ROUTES.REGISTER]

export const MainLayout = () => {
  const { pathname } = useLocation()
  const isLayoutless = LAYOUTLESS_ROUTES.includes(pathname)

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.content}>
        <Suspense fallback={<Skeleton width="100%" height="320px" />}>
          <Outlet />
        </Suspense>
      </main>

      {!isLayoutless && <Footer />}
    </div>
  )
}
