import { Outlet } from 'react-router-dom'
//import { Header } from '@widgets/Header'; // Путь к будущему хедеру
//import { Footer } from '@widgets/Footer'; // Путь к будущему футеру
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      {/* TODO: здесь будет Header (из другой задачи) */}

      <main className={styles.content}>
        {/* Outlet — это место, куда будут подставляться страницы */}
        <Outlet />
      </main>

      {/* TODO: здесь будет Footer */}
    </div>
  )
}
