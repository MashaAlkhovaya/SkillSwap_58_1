import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

/** Читает id навыков, по которым предложен обмен, из localStorage */
export function getProposedSkillIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS)

    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)

    if (Array.isArray(parsed) && parsed.every((id): id is string => typeof id === 'string')) {
      return parsed
    }

    return []
  } catch {
    return []
  }
}

/** Сохраняет id навыков, по которым предложен обмен */
export function saveProposedSkillIds(ids: string[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify(ids))
  } catch {
    console.error('Не удалось сохранить заявки на обмен')
  }
}
