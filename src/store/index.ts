import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api'
import skillsReducer from '@/entities/skill/model/skillsSlice'
import usersReducer from '@/entities/user/model/usersSlice'
import authReducer, { setAuthUser, type AuthState } from '@/features/auth/model/authSlice'
import { getAuthUser } from '@/features/auth/model/authUtils'
import notificationsReducer from '@/features/notifications/model/notificationsSlice'
import apiErrorReducer from '@/shared/api/model/apiErrorSlice'
import notificationHistoryReducer from '@/features/notifications/model/notificationHistorySlice'
import { notificationHistoryListener } from '@/features/notifications/model/notificationHistoryListener'

const savedUser = getAuthUser()

const initialAuthState: AuthState = {
  user: null,
  sessionCheckStatus: savedUser ? 'checking' : 'idle',
}

export const store = configureStore({
  reducer: {
    skills: skillsReducer,
    users: usersReducer,
    auth: authReducer,
    notifications: notificationsReducer,
    notificationHistory: notificationHistoryReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    apiError: apiErrorReducer,
  },

  preloadedState: {
    auth: initialAuthState,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(notificationHistoryListener.middleware)
      .concat(baseApi.middleware),
})

if (savedUser) {
  store.dispatch(setAuthUser(savedUser))
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
