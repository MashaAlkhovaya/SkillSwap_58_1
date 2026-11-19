import { baseApi } from '@/shared/api'
import { authApi } from '@/features/auth/api/authApi'

export const likeUserApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    likeUserAdd: build.mutation<void, string>({
      query: (targetUserId) => ({
        url: `/auth/me/likes/${encodeURIComponent(targetUserId)}`,
        method: 'PUT',
      }),
      async onQueryStarted(targetUserId, { dispatch, getState, queryFulfilled }) {
        const initialProfile = authApi.endpoints.getAuthMe.select()(getState())
        const wasLiked = initialProfile.data?.likes.includes(targetUserId)

        dispatch(
          authApi.util.updateQueryData('getAuthMe', undefined, (profile) => {
            if (!profile.likes.includes(targetUserId)) {
              profile.likes.push(targetUserId)
            }
          }),
        )

        try {
          await queryFulfilled
        } catch {
          const currentProfile = authApi.endpoints.getAuthMe.select()(getState())

          // Не меняем новый профиль после выхода, повторного входа или загрузки.
          if (!initialProfile.data || currentProfile.requestId !== initialProfile.requestId) {
            return
          }

          if (!wasLiked) {
            dispatch(
              authApi.util.updateQueryData('getAuthMe', undefined, (profile) => {
                // Откатываем только этот лайк, сохраняя параллельные изменения.
                profile.likes = profile.likes.filter((id) => id !== targetUserId)
              }),
            )
          }
        }
      },
    }),

    likeUserRemove: build.mutation<void, string>({
      query: (targetUserId) => ({
        url: `/auth/me/likes/${encodeURIComponent(targetUserId)}`,
        method: 'DELETE',
      }),
      async onQueryStarted(targetUserId, { dispatch, getState, queryFulfilled }) {
        const initialProfile = authApi.endpoints.getAuthMe.select()(getState())
        const previousIndex = initialProfile.data?.likes.indexOf(targetUserId) ?? -1

        dispatch(
          authApi.util.updateQueryData('getAuthMe', undefined, (profile) => {
            profile.likes = profile.likes.filter((id) => id !== targetUserId)
          }),
        )

        try {
          await queryFulfilled
        } catch {
          const currentProfile = authApi.endpoints.getAuthMe.select()(getState())

          if (!initialProfile.data || currentProfile.requestId !== initialProfile.requestId) {
            return
          }

          if (previousIndex >= 0) {
            dispatch(
              authApi.util.updateQueryData('getAuthMe', undefined, (profile) => {
                if (!profile.likes.includes(targetUserId)) {
                  profile.likes.splice(previousIndex, 0, targetUserId)
                }
              }),
            )
          }
        }
      },
    }),
  }),
})

export const { useLikeUserAddMutation, useLikeUserRemoveMutation } = likeUserApi
