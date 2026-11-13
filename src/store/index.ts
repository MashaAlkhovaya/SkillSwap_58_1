import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api'
import skillsReducer from '@/entities/skill/model/skillsSlice'
import usersReducer from '@/entities/user/model/usersSlice'
import authReducer from '@/features/auth/model/authSlice'
import notificationsReducer from '@/features/notifications/model/notificationsSlice'
import exchangeReducer from '@/features/exchange/model/exchangeSlice'
import { saveProposedSkillIds } from '@/features/exchange/model/exchangeStorage'

export const store = configureStore({
  reducer: {
    skills: skillsReducer,
    users: usersReducer,
    auth: authReducer,
    notifications: notificationsReducer,
    exchange: exchangeReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

let previousIds = store.getState().exchange.proposedSkillIds

store.subscribe(() => {
  const ids = store.getState().exchange.proposedSkillIds

  if (ids !== previousIds) {
    previousIds = ids
    saveProposedSkillIds(ids)
  }
})
