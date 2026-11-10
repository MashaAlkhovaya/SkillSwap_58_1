import type { ProfileFormValues } from '@/widgets/ProfileForm'

type ProfileSource = {
  email: string
  name: string
  birthDate: string
  gender: string
  city: string
  bio: string
}

export const profileDateFromIso = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = String(date.getUTCFullYear())
  return `${day}.${month}.${year}`
}

export const toProfileDefaults = (user: ProfileSource): Omit<ProfileFormValues, 'avatar'> => ({
  email: user.email,
  name: user.name,
  birthDate: profileDateFromIso(user.birthDate),
  gender: user.gender,
  city: user.city,
  bio: user.bio,
})
