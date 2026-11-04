import {
  CITIES,
  SKILL_CATEGORIES,
  type CategoryId,
  type SubCategoryId,
} from '@/shared/lib/constants'
import type { LoginRequest, RegisterRequest } from './types'

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new HttpError(400, 'Ожидается объект с данными формы')
  }
  return value as Record<string, unknown>
}

function text(value: unknown, field: string, min = 1, max = Infinity): string {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    throw new HttpError(400, `Некорректное поле ${field}`)
  }
  return value.trim()
}

function choice<T extends string>(value: unknown, values: readonly T[], field: string): T {
  if (typeof value !== 'string' || !values.includes(value as T)) {
    throw new HttpError(400, `Недопустимое значение ${field}`)
  }
  return value as T
}

function choices<T extends string>(value: unknown, values: readonly T[], field: string): T[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new HttpError(400, `Заполните ${field}`)
  }
  const result = value.map((item: unknown) => choice(item, values, field))
  if (new Set(result).size !== result.length) {
    throw new HttpError(400, `Повторяющиеся значения ${field}`)
  }
  return result
}

export function parseLogin(value: unknown): LoginRequest {
  const data = record(value)
  const email = text(data.email, 'email').toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'Некорректный email')
  }
  if (typeof data.password !== 'string' || data.password.length === 0) {
    throw new HttpError(400, 'Укажите пароль')
  }
  return { email, password: data.password }
}

export function parseRegistration(value: unknown): RegisterRequest {
  const data = record(value)
  const credentials = parseLogin(data)
  if (credentials.password.length < 8) throw new HttpError(400, 'Пароль короче 8 символов')

  const birthDate = text(data.birthDate, 'birthDate')
  // Канонический ISO UTC, как у Date.toISOString(); сравнение отсекает 30 февраля.
  const birth = new Date(birthDate)
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(birthDate) ||
    !Number.isFinite(birth.getTime()) ||
    birth.toISOString() !== birthDate ||
    birth.getTime() > Date.now()
  ) {
    throw new HttpError(400, 'birthDate должна быть датой ISO UTC и не находиться в будущем')
  }

  const categoryIds: CategoryId[] = SKILL_CATEGORIES.map((category) => category.id)
  const subCategoryIds: SubCategoryId[] = SKILL_CATEGORIES.flatMap((category) =>
    category.subcategories.map((subCategory) => subCategory.id),
  )
  const interests = record(data.wantsToLearn)
  const categories = choices(interests.categories, categoryIds, 'wantsToLearn.categories')
  const subCategories = choices(
    interests.subCategories,
    subCategoryIds,
    'wantsToLearn.subCategories',
  )
  for (const id of subCategories) {
    const parent = SKILL_CATEGORIES.find((category) =>
      category.subcategories.some((subCategory) => subCategory.id === id),
    )
    if (!parent || !categories.includes(parent.id)) {
      throw new HttpError(400, 'Для каждой подкатегории обучения выберите её категорию')
    }
  }

  const skill = record(data.canTeach)
  const category = choice(skill.category, categoryIds, 'canTeach.category')
  const subCategory = choice(skill.subCategory, subCategoryIds, 'canTeach.subCategory')
  const parent = SKILL_CATEGORIES.find((item) => item.id === category)
  if (!parent?.subcategories.some((item) => item.id === subCategory)) {
    throw new HttpError(400, 'Подкатегория навыка не принадлежит выбранной категории')
  }

  return {
    ...credentials,
    name: text(data.name, 'name', 2),
    birthDate,
    gender: choice(data.gender, ['female', 'male'] as const, 'gender'),
    city: choice(data.city, CITIES, 'city'),
    wantsToLearn: { categories, subCategories },
    canTeach: {
      title: text(skill.title, 'canTeach.title', 3, 50),
      description: text(skill.description, 'canTeach.description', 1, 500),
      category,
      subCategory,
    },
  }
}
