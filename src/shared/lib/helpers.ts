import { YEARS_WORDS } from './constants'

/** Форматирует дату в читаемый вид */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/** Обрезает строку до maxLength символов */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/** Генерирует уникальный id */
export function generateId(): string {
  return crypto.randomUUID()
}

/** Склоняет слово в зависимости от числа */
export function getDeclension(count: number, words: readonly string[]): string {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return words[2]
  }

  if (lastDigit === 1) {
    return words[0]
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return words[1]
  }

  return words[2]
}

/** Вычисляет возраст по дате рождения */
export function getAgeWithDeclension(birthDate: string): string {
  const birth = new Date(birthDate)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  const word = getDeclension(age, YEARS_WORDS)
  return `${age} ${word}`
}
