import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.content}>
        {/* Outlet — это место, куда будут подставляться страницы */}
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
