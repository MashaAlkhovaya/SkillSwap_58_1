import { ReactNode } from 'react'
import {
  registrationDefaultValues,
  RegistrationFormValues,
  registrationSchema,
} from './registrationSchema'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

interface RegistrationFormProviderProps {
  children: ReactNode
  onSubmit: (values: RegistrationFormValues) => void
}

export const RegistrationFormProvider = ({ children, onSubmit }: RegistrationFormProviderProps) => {
  const form = useForm<RegistrationFormValues>({
    defaultValues: registrationDefaultValues,
    resolver: yupResolver(registrationSchema),
    shouldUnregister: false,
    mode: 'onTouched',
  })
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  )
}
