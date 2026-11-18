import { useCallback, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated, selectProfile } from '@/features/auth/model/authSlice'
import { useGetAuthMeQuery } from '@/features/auth/api/authApi'
import { addNotification } from '@/features/notifications/model/notificationsSlice'
import { useLikeUserAddMutation, useLikeUserRemoveMutation } from '../api/likeUserApi'
import { pendingLikes } from './pendingLikesStore'

const TOAST_DURATION_MS = 4000

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'status' in error) {
    const data = (error as { data?: { message?: string } }).data

    if (data?.message) {
      return data.message
    }
  }

  return 'Не удалось обновить избранное'
}

export function useLikeUser(targetUserId: string) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const sliceProfile = useAppSelector(selectProfile)

  const { data: cachedProfile } = useGetAuthMeQuery(undefined, {
    skip: !isAuthenticated,
  })

  const [addLike] = useLikeUserAddMutation()
  const [removeLike] = useLikeUserRemoveMutation()

  const profile = cachedProfile ?? sliceProfile
  const isLiked = profile ? profile.likes.includes(targetUserId) : false

  const isPending = useSyncExternalStore(
    pendingLikes.subscribe,
    () => pendingLikes.hasId(targetUserId),
    () => false,
  )

  const toggle = useCallback(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN)
      return
    }

    if (!profile || pendingLikes.hasId(targetUserId)) {
      return
    }

    pendingLikes.add(targetUserId)

    const request = isLiked ? removeLike(targetUserId) : addLike(targetUserId)

    void request
      .unwrap()
      .catch((error: unknown) => {
        dispatch(
          addNotification({
            type: 'error',
            title: 'Не удалось обновить избранное',
            message: getErrorMessage(error),
            duration: TOAST_DURATION_MS,
          }),
        )
      })
      .finally(() => {
        pendingLikes.remove(targetUserId)
      })
  }, [isAuthenticated, profile, isLiked, targetUserId, addLike, removeLike, navigate, dispatch])

  return {
    isLiked,
    isPending,
    toggle,
  }
}
