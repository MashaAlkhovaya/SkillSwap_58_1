import { useState } from 'react'
import { useGetAuthMeQuery, useUpdateProfileMutation } from '@/features/auth/api/authApi'
import { ProfileForm, type ProfileFormValues } from '@/widgets/ProfileForm'
import { ProfileSidebar } from '@/widgets/ProfileSidebar'
import { apiErrorMessage, toProfileDefaults } from './profileUser'
import { toProfileUpdate } from './toProfileUpdate'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { data: profile, isLoading, isError, error: loadError } = useGetAuthMeQuery()
  const [updateProfile] = useUpdateProfileMutation()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (values: ProfileFormValues) => {
    const result = toProfileUpdate(values)
    if (!result.ok) {
      setSubmitError(result.message)
      return
    }

    try {
      await updateProfile(result.payload).unwrap()
      setSubmitError(null)
    } catch (error) {
      setSubmitError(apiErrorMessage(error))
    }
  }

  const message = submitError ?? (isError ? apiErrorMessage(loadError) : null)

  return (
    <div className={styles.page}>
      <ProfileSidebar />
      {isLoading ? null : (
        <ProfileForm
          defaultValues={profile ? toProfileDefaults(profile) : undefined}
          avatarUrl={profile?.avatarUrl}
          error={message}
          onSubmit={(values) => {
            void handleSubmit(values)
          }}
        />
      )}
    </div>
  )
}
