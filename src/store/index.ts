import { configureStore } from '@reduxjs/toolkit'
import skillsReducer from '@/entities/skill/model/skillsSlice'
import usersReducer from '@/entities/user/model/usersSlice'
// import authReducer from '@/features/auth/model/authSlice'

export const store = configureStore({
  reducer: {
    skills: skillsReducer,
    users: usersReducer,
    // auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
