// TODO: реализовать страницу LoginPage

import { AuthDecoration, AuthWidget } from '@/widgets'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <AuthWidget />
        <AuthDecoration />
      </div>
    </main>
  )
}
