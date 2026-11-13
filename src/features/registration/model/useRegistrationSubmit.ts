import { useCallback, useRef, useState } from 'react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useAppDispatch } from '@/store/hooks'
import { saveServerAuthUser } from '@/features/auth/model/authUtils'
import { setAuthUser } from '@/features/auth/model/authSlice'
import { buildRegistrationFormData, useRegisterMutation } from '../api/registrationApi'
import type { RegistrationFormValues } from './registrationSchema'

const FALLBACK_ERROR =
  'Не удалось завершить регистрацию. Проверьте подключение к интернету и попробуйте ещё раз.'

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}

function isErrorResponse(error: FetchBaseQueryError): error is {
  status: number
  data: { message: string }
} {
  return (
    (error.status === 400 || error.status === 409) &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'message' in error.data &&
    typeof error.data.message === 'string'
  )
}

export function getRegistrationError(error: unknown): string {
  if (isFetchBaseQueryError(error) && isErrorResponse(error)) {
    return error.data.message
  }

  return FALLBACK_ERROR
}

export function useRegistrationSubmit() {
  const dispatch = useAppDispatch()
  const [register, { isLoading }] = useRegisterMutation()
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef(false)

  const clearError = useCallback(() => setError(null), [])

  const registerUser = useCallback(
    async (values: RegistrationFormValues): Promise<boolean> => {
      if (pendingRef.current) return false

      setError(null)
      pendingRef.current = true

      try {
        const user = await register(buildRegistrationFormData(values)).unwrap()

        dispatch(setAuthUser(user))
        saveServerAuthUser(user)

        return true
      } catch (requestError) {
        setError(getRegistrationError(requestError))
        return false
      } finally {
        pendingRef.current = false
      }
    },
    [dispatch, register],
  )

  return { registerUser, isSubmitting: isLoading, error, clearError }
}
