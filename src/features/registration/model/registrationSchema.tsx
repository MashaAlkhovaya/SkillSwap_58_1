import { InferType, mixed, object, string } from 'yup'

export const registrationSchema = object({
  email: string().trim().email('Некорректный email').required('Email должен быть введён'),
  password: string()
    .min(8, 'Длина пароля должна быть не менее 8 символов')
    .required('Введите пароль'),
  avatar: mixed<File>().nullable().defined(),
  name: string().trim().required('Введите имя'),
  birthDate: string()
    .required('Введите дату рождения')
    .test('valid-date', 'Введите корректную дату рождения', (value) => {
      if (!value) return true
      const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
      if (!match) return false
      const [, day, month, year] = match
      const parsed = new Date(Number(year), Number(month) - 1, Number(day))
      return (
        parsed.getFullYear() === Number(year) &&
        parsed.getMonth() === Number(month) - 1 &&
        parsed.getDate() === Number(day) &&
        parsed <= new Date()
      )
    }),
  gender: string().required('Укажите пол'),
  city: string().required('Выберите город'),
  wantedCategory: string().required('Выберите категорию навыка'),
  wantedSubCategory: string().required('Выберите подкатегорию навыка'),
  teachSkillName: string().trim().required('Введите название навыка'),
  teachCategory: string().required('Выберите категорию навыка'),
  teachSubCategory: string().required('Выберите подкатегорию навыка'),
  teachDescription: string().trim().required('Введите описание навыка'),
  teachImage: mixed<File>().nullable().defined(),
})

export type RegistrationFormValues = InferType<typeof registrationSchema>

export const registrationDefaultValues: RegistrationFormValues = {
  email: '',
  password: '',
  avatar: null,
  name: '',
  birthDate: '',
  gender: '',
  city: '',
  wantedCategory: '',
  wantedSubCategory: '',
  teachSkillName: '',
  teachCategory: '',
  teachSubCategory: '',
  teachDescription: '',
  teachImage: null,
}

export const registrationStepFields = {
  1: ['email', 'password'],
  2: ['name', 'birthDate', 'gender', 'city', 'wantedCategory', 'wantedSubCategory'],
  3: ['teachSkillName', 'teachCategory', 'teachSubCategory', 'teachDescription'],
} as const satisfies Record<number, readonly (keyof RegistrationFormValues)[]>
