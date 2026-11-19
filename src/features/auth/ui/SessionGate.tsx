import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useGetAuthMeQuery } from '../api/authApi'
import { getAuthUser, saveServerAuthUser } from '../model/authUtils'
import { logout, setAuthUser, setSessionCheckStatus } from '../model/authSlice'
import { useAppDispatch } from '@/store/hooks'
import { useStore } from 'react-redux'
import type { store } from '@/store'

interface SessionGateProps {
  children: ReactNode
}

export function SessionGate({ children }: SessionGateProps) {
  const dispatch = useAppDispatch()

  const appStore = useStore.withTypes<typeof store>()()
  const [initialUser] = useState(() => appStore.getState().auth.user)

  /** Запоминаем сохранённую сессию при запуске приложения. */
  const [savedUser] = useState(() => getAuthUser())
  const [isFinished, setIsFinished] = useState(() => !savedUser?.token)

  const { data, error } = useGetAuthMeQuery(undefined, {
    skip: isFinished,
  })

  useEffect(() => {
    if (isFinished || !savedUser?.token) {
      return
    }

    const currentUser = appStore.getState().auth.user
    const currentSavedUser = getAuthUser()

    const sessionChanged =
      currentUser !== initialUser ||
      currentSavedUser?.id !== savedUser.id ||
      currentSavedUser?.token !== savedUser.token

    if (sessionChanged) {
      setIsFinished(true)
      return
    }

    if (data) {
      const confirmedUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        token: savedUser.token,
        ...('avatarUrl' in data ? { avatarUrl: data.avatarUrl } : {}),
      }

      saveServerAuthUser(confirmedUser)
      dispatch(setAuthUser(confirmedUser))
      dispatch(setSessionCheckStatus('success'))
      setIsFinished(true)
      return
    }

    if (error && 'status' in error && error.status === 401) {
      void dispatch(logout()).then(() => {
        setIsFinished(true)
      })
      return
    }

    if (error) {
      dispatch(setSessionCheckStatus('error'))
    }
  }, [appStore, data, dispatch, error, initialUser, isFinished, savedUser])

  return <>{children}</>
}
