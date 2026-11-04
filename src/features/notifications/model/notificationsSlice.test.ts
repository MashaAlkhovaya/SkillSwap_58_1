import reducer, { addNotification, removeNotification } from './notificationsSlice'

describe('notificationsSlice', () => {
  it('addNotification добавляет уведомление с isRead = false', () => {
    const state = reducer(
      undefined,
      addNotification({ type: 'success', title: 'Успешно', message: 'Готово', duration: 5000 }),
    )

    expect(state.items).toHaveLength(1)
    expect(state.items[0].isRead).toBe(false)
  })

  it('removeNotification удаляет только уведомление с нужным id', () => {
    const afterFirst = reducer(
      undefined,
      addNotification({ type: 'error', title: 'Один', message: 'Первое', duration: 5000 }),
    )
    const afterSecond = reducer(
      afterFirst,
      addNotification({
        type: 'error',
        title: 'Два',
        message: 'Второе',
        duration: 5000,
      }),
    )
    const idToRemove = afterSecond.items[0].id

    const state = reducer(afterSecond, removeNotification(idToRemove))

    expect(state.items).toHaveLength(1)
    expect(state.items.some((item) => item.id === idToRemove)).toBe(false)
  })
})
