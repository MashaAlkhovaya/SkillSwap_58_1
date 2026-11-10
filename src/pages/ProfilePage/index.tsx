import { useGetAuthMeQuery, useUpdateProfileMutation } from '@/features/auth/api/authApi'
import { ProfileForm, type ProfileFormValues } from '@/widgets/ProfileForm'
import { ProfileSidebar } from '@/widgets/ProfileSidebar'
import { toProfileDefaults } from './profileUser'
import { toProfileUpdate } from './toProfileUpdate'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetAuthMeQuery()
  const [updateProfile] = useUpdateProfileMutation()

  const handleSubmit = (values: ProfileFormValues) => {
    const result = toProfileUpdate(values)
    if (!result.ok) return
    void updateProfile(result.payload)
  }

  return (
    <div className={styles.page}>
      <ProfileSidebar />
      {isLoading ? null : (
        <ProfileForm
          defaultValues={profile ? toProfileDefaults(profile) : undefined}
          avatarUrl={profile?.avatarUrl}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
