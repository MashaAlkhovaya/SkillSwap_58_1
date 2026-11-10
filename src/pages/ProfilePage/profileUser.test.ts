import { describe, expect, it } from 'vitest'
import { apiErrorMessage, profileDateFromIso, toProfileDefaults } from './profileUser'

describe('profileUser', () => {
  it('переводит дату профиля в формат поля', () => {
    expect(profileDateFromIso('1990-01-01T00:00:00.000Z')).toBe('01.01.1990')
    expect(profileDateFromIso('не дата')).toBe('')
  })

  it('собирает начальные значения формы', () => {
    expect(
      toProfileDefaults({
        email: 'anna@example.com',
        name: 'Анна',
        birthDate: '1990-01-01T00:00:00.000Z',
        gender: 'female',
        city: 'Москва',
        bio: 'Учу рисовать',
      }),
    ).toEqual({
      email: 'anna@example.com',
      name: 'Анна',
      birthDate: '01.01.1990',
      gender: 'female',
      city: 'Москва',
      bio: 'Учу рисовать',
    })
  })

  it('читает сообщение ошибки API', () => {
    expect(apiErrorMessage({ data: { message: 'Этот email уже занят' } })).toBe(
      'Этот email уже занят',
    )
    expect(apiErrorMessage({ status: 500 })).toBe('Не удалось сохранить профиль')
  })
})
