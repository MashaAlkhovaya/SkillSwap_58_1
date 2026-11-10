import { ProfileForm } from '@/widgets/ProfileForm'
import { ProfileSidebar } from '@/widgets/ProfileSidebar'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <ProfileSidebar />
      <ProfileForm onSubmit={() => undefined} />
    </div>
  )
}
