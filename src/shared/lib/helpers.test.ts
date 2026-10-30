import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getDeclension, getAgeWithDeclension } from './helpers'
import { YEARS_WORDS } from './constants'

describe('getDeclension', () => {
  it('должен возвращать первую форму для чисел, оканчивающихся на 1 (кроме 11)', () => {
    expect(getDeclension(1, YEARS_WORDS)).toBe('год')
    expect(getDeclension(21, YEARS_WORDS)).toBe('год')
    expect(getDeclension(101, YEARS_WORDS)).toBe('год')
  })

  it('должен возвращать вторую форму для чисел, оканчивающихся на 2, 3, 4 (кроме 12, 13, 14)', () => {
    expect(getDeclension(2, YEARS_WORDS)).toBe('года')
    expect(getDeclension(3, YEARS_WORDS)).toBe('года')
    expect(getDeclension(4, YEARS_WORDS)).toBe('года')
    expect(getDeclension(22, YEARS_WORDS)).toBe('года')
    expect(getDeclension(34, YEARS_WORDS)).toBe('года')
  })

  it('должен возвращать третью форму для чисел от 5 до 20 и оканчивающихся на 0, 5-9', () => {
    expect(getDeclension(5, YEARS_WORDS)).toBe('лет')
    expect(getDeclension(10, YEARS_WORDS)).toBe('лет')
    expect(getDeclension(20, YEARS_WORDS)).toBe('лет')
    expect(getDeclension(25, YEARS_WORDS)).toBe('лет')
    expect(getDeclension(100, YEARS_WORDS)).toBe('лет')
  })

  it('должен обрабатывать исключения 11-14', () => {
    expect(getDeclension(11, YEARS_WORDS)).toBe('лет')
    expect(getDeclension(12, YEARS_WORDS)).toBe('лет')
    expect(getDeclension(13, YEARS_WORDS)).toBe('лет')
    expect(getDeclension(14, YEARS_WORDS)).toBe('лет')
    expect(getDeclension(111, YEARS_WORDS)).toBe('лет')
  })
})

describe('getAgeWithDeclension', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-05-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('должен считать возраст, если день рождения уже прошел в этом году', () => {
    expect(getAgeWithDeclension('2000-01-10')).toBe('24 года')
  })

  it('должен считать возраст, если день рождения еще не наступил в этом году', () => {
    expect(getAgeWithDeclension('2000-12-20')).toBe('23 года')
  })

  it('должен считать возраст, если день рождения сегодня', () => {
    expect(getAgeWithDeclension('2000-05-15')).toBe('24 года')
  })

  it('должен правильно склонять для 21 года', () => {
    expect(getAgeWithDeclension('2003-01-01')).toBe('21 год')
  })

  it('должен правильно склонять для 25 лет', () => {
    expect(getAgeWithDeclension('1999-01-01')).toBe('25 лет')
  })

  it('должен правильно склонять для 13 лет (исключение)', () => {
    expect(getAgeWithDeclension('2011-01-01')).toBe('13 лет')
  })
})
