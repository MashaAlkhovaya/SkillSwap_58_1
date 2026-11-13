import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api'
import skillsReducer from '@/entities/skill/model/skillsSlice'
import usersReducer from '@/entities/user/model/usersSlice'
import authReducer from '@/features/auth/model/authSlice'
import notificationsReducer from '@/features/notifications/model/notificationsSlice'
import apiErrorReducer from '@/shared/api/model/apiErrorSlice'

export const store = configureStore({
  reducer: {
    skills: skillsReducer,
    users: usersReducer,
    auth: authReducer,
    notifications: notificationsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    apiError: apiErrorReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
