import { getSavedUserProfile, patchSavedUserProfile } from '@/features/auth/model/authUtils'

export const applyLikesToPersistedProfile = (userId: string, liked: boolean): void => {
  const profile = getSavedUserProfile()

  if (!profile) {
    return
  }

  if (profile.likes.includes(userId) === liked) {
    return
  }

  patchSavedUserProfile((current) => ({
    ...current,
    likes: liked ? [...current.likes, userId] : current.likes.filter((id) => id !== userId),
  }))
}
