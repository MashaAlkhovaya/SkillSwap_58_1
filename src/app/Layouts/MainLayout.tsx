import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { ROUTES } from '@/shared/lib/constants'
import styles from './MainLayout.module.css'

const LAYOUTLESS_ROUTES: string[] = [ROUTES.LOGIN, ROUTES.REGISTER]

export const MainLayout = () => {
  const { pathname } = useLocation()
  const isLayoutless = LAYOUTLESS_ROUTES.includes(pathname)

  return (
    <div className={styles.layout}>
      {!isLayoutless && <Header />}

      <main className={styles.content}>
        {/* Outlet — это место, куда будут подставляться страницы */}
        <Outlet />
      </main>

      {!isLayoutless && <Footer />}
    </div>
  )
}
