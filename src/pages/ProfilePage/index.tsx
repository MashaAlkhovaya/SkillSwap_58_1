import { ProfileSidebar } from '@/widgets/ProfileSidebar'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <ProfileSidebar />
      <section className={styles.stub} aria-label="Личные данные">
        <h1>Личные данные</h1>
        <p>Раздел в разработке</p>
      </section>
    </div>
  )
}
