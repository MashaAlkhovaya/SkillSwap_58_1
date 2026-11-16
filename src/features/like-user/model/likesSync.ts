import type { UnknownAction } from '@reduxjs/toolkit'
import { selectProfile, setProfile } from '@/features/auth/model/authSlice'
import { applyLikesToPersistedProfile } from './likesPersistence'

export type LikeAction = 'add' | 'remove'

/**
 * Единый обработчик подтверждённого изменения лайков.
 * Вызывается только после успешного ответа сервера (201/204).
 * Слайс читается заново через getState — параллельные операции не затирают друг друга.
 */
export const applyConfirmedLikesChange = (
  dispatch: (action: UnknownAction) => unknown,
  getState: () => unknown,
  targetUserId: string,
  action: LikeAction,
): void => {
  const profile = selectProfile(getState() as Parameters<typeof selectProfile>[0])

  if (!profile) {
    return
  }

  const wants = action === 'add'

  if (profile.likes.includes(targetUserId) === wants) {
    applyLikesToPersistedProfile(targetUserId, wants)
    return
  }

  const likes = wants
    ? [...profile.likes, targetUserId]
    : profile.likes.filter((id) => id !== targetUserId)

  dispatch(setProfile({ ...profile, likes }))
  applyLikesToPersistedProfile(targetUserId, wants)
}
