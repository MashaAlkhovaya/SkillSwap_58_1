import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import type { ReactNode } from 'react'
import { SKILL_CATEGORIES } from '@/shared/lib/constants'
import {
  registrationDefaultValues,
  registrationSchema,
  registrationStepFields,
  type RegistrationFormValues,
} from './registrationSchema'

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

export const useRegistrationForm = () => {
  const form = useFormContext<RegistrationFormValues>()
  const { control, setValue } = form
  const wantedCategory = useWatch({ control, name: 'wantedCategory' })
  const teachCategory = useWatch({ control, name: 'teachCategory' })
  const wantedSubcategoryOptions =
    SKILL_CATEGORIES.find((category) => category.id === wantedCategory)?.subcategories.map(
      (subcategory) => ({ value: subcategory.id, label: subcategory.title }),
    ) ?? []
  const teachSubcategoryOptions =
    SKILL_CATEGORIES.find((category) => category.id === teachCategory)?.subcategories.map(
      (subcategory) => ({ value: subcategory.id, label: subcategory.title }),
    ) ?? []
  const validateStep = (step: 1 | 2) => form.trigger(registrationStepFields[step])
  const continueStep = async (step: 1 | 2, onNext?: () => void) => {
    if (await validateStep(step)) onNext?.()
  }
  const setCategory = (field: 'wantedCategory' | 'teachCategory', value: string | undefined) => {
    const categoryId = SKILL_CATEGORIES.find((category) => category.id === value)?.id ?? ''
    const subcategoryField = field === 'wantedCategory' ? 'wantedSubCategory' : 'teachSubCategory'
    setValue(field, categoryId, { shouldDirty: true, shouldValidate: true })
    setValue(subcategoryField, '', { shouldDirty: true, shouldValidate: true })
  }
  const setGender = (value: string) =>
    setValue('gender', value, { shouldDirty: true, shouldValidate: true })
  const setCity = (value: string) =>
    setValue('city', value, { shouldDirty: true, shouldValidate: true })
  const setSubcategory = (field: 'wantedSubCategory' | 'teachSubCategory', value: string) =>
    setValue(field, value, { shouldDirty: true, shouldValidate: true })
  const setAvatar = (file: File | null) =>
    setValue('avatar', file, { shouldDirty: true, shouldValidate: true })
  const setTeachImage = (file: File) =>
    setValue('teachImage', file, { shouldDirty: true, shouldValidate: true })
  const setBirthDate = (value: Date | string | null) => {
    const formattedDate =
      value instanceof Date
        ? `${String(value.getDate()).padStart(2, '0')}.${String(value.getMonth() + 1).padStart(2, '0')}.${value.getFullYear()}`
        : (value ?? '')
    setValue('birthDate', formattedDate, { shouldDirty: true, shouldValidate: true })
  }

  return {
    ...form,
    wantedSubcategoryOptions,
    teachSubcategoryOptions,
    setCategory,
    setGender,
    setCity,
    setSubcategory,
    setAvatar,
    setTeachImage,
    setBirthDate,
    validateStep,
    continueStep,
  }
}
