import { baseApi } from '@/shared/api'
import { authApi } from '@/features/auth/api/authApi'
import { applyConfirmedLikesChange } from '../model/likesSync'

export const likeUserApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addLike: build.mutation<void, string>({
      query: (targetUserId) => ({
        url: `/auth/me/likes/${encodeURIComponent(targetUserId)}`,
        method: 'PUT',
      }),
      onQueryStarted: (targetUserId, { dispatch, getState, queryFulfilled }) => {
        const patch = dispatch(
          authApi.util.updateQueryData('getAuthMe', undefined, (profile) => {
            if (!profile.likes.includes(targetUserId)) {
              profile.likes.push(targetUserId)
            }
          }),
        )

        void queryFulfilled
          .then(() => {
            if (!authApi.endpoints.getAuthMe.select()(getState()).data) {
              return
            }

            applyConfirmedLikesChange(dispatch, getState, targetUserId, 'add')
          })
          .catch(() => {
            if (authApi.endpoints.getAuthMe.select()(getState()).data) {
              patch.undo()
            }
          })
      },
    }),

    removeLike: build.mutation<void, string>({
      query: (targetUserId) => ({
        url: `/auth/me/likes/${encodeURIComponent(targetUserId)}`,
        method: 'DELETE',
      }),
      onQueryStarted: (targetUserId, { dispatch, getState, queryFulfilled }) => {
        const patch = dispatch(
          authApi.util.updateQueryData('getAuthMe', undefined, (profile) => {
            profile.likes = profile.likes.filter((id) => id !== targetUserId)
          }),
        )

        void queryFulfilled
          .then(() => {
            if (!authApi.endpoints.getAuthMe.select()(getState()).data) {
              return
            }

            applyConfirmedLikesChange(dispatch, getState, targetUserId, 'remove')
          })
          .catch(() => {
            if (authApi.endpoints.getAuthMe.select()(getState()).data) {
              patch.undo()
            }
          })
      },
    }),
  }),
})

export const { useAddLikeMutation, useRemoveLikeMutation } = likeUserApi
