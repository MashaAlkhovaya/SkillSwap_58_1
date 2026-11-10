import { useUpdateProfileMutation } from '@/features/auth/api/authApi'
import { ProfileForm, type ProfileFormValues } from '@/widgets/ProfileForm'
import { ProfileSidebar } from '@/widgets/ProfileSidebar'
import { toProfileUpdate } from './toProfileUpdate'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const [updateProfile] = useUpdateProfileMutation()

  const handleSubmit = (values: ProfileFormValues) => {
    const result = toProfileUpdate(values)
    if (!result.ok) return
    void updateProfile(result.payload)
  }

  return (
    <div className={styles.page}>
      <ProfileSidebar />
      <ProfileForm onSubmit={handleSubmit} />
    </div>
  )
}
