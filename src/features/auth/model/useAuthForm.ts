import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useAppDispatch } from '@/store/hooks'
import { login } from './authSlice'

const authFormSchema = yup.object({
  email: yup.string().trim().required('Введите email'),
  password: yup.string().required('Введите пароль'),
})

export type AuthFormValues = yup.InferType<typeof authFormSchema>

export function useAuthForm() {
  const dispatch = useAppDispatch()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(authFormSchema),
  })

  const submitCredentials = handleSubmit(async (values) => {
    const result = await dispatch(login(values))

    if (login.rejected.match(result)) {
      setError(result.payload ?? 'Ошибка авторизации')
    }
  })

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    clearErrors()
    setError(null)
    void submitCredentials(event)
  }

  return {
    register,
    handleSubmit: handleFormSubmit,
    errors,
    isSubmitting,
    error,
  }
}
