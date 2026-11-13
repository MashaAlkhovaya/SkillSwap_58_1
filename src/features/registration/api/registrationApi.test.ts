import { describe, it, expect } from 'vitest'
import { buildRegistrationFormData } from './registrationApi'

const mockFile = new File(['avatar'], 'avatar.png', { type: 'image/png' })

describe('buildRegistrationFormData', () => {
  it('кладёт все текстовые поля, файлы — только если переданы', () => {
    const formData = buildRegistrationFormData({
      email: 'a@b.com',
      password: '12345678',
      name: 'Иван',
      birthDate: '1990-01-01',
      gender: 'male',
      city: 'Москва',
      wantedCategory: 'music',
      wantedSubCategory: 'guitar',
      teachSkillName: 'Гитара',
      teachCategory: 'music',
      teachSubCategory: 'guitar',
      teachDescription: 'Научу играть',
      avatar: mockFile,
      teachImage: null,
    } as never)

    expect(formData.get('email')).toBe('a@b.com')
    expect(formData.get('password')).toBe('12345678')
    expect(formData.get('name')).toBe('Иван')
    expect(formData.get('teachSkillName')).toBe('Гитара')
    expect(formData.get('avatar')).toEqual(mockFile)
    expect(formData.get('teachImage')).toBeNull()
  })
})
