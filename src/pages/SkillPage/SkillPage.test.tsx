import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from '@/pages/LoginPage'
import { setAuthUser, logout } from '@/features/auth/model/authSlice'
import { store } from '@/store'
import { NotificationStack } from '@/widgets/NotificationStack'
import { UserMenu } from '@/widgets/UserMenu'
import { SkillPage } from './index'

const currentUser = { id: 'current', name: 'Соня', email: 's@example.com', token: 'mock' }
const otherUser = { id: 'other', name: 'Миша', email: 'm@example.com', token: 'mock' }

const skills = [
  { id: 'drawing', authorId: 'alice', title: 'Рисование' },
  { id: 'music', authorId: 'ivan', title: 'Музыка' },
]

const owners = [
  { id: 'alice', name: 'Алиса', city: 'Москва' },
  { id: 'ivan', name: 'Иван', city: 'Казань' },
]

function renderExchange() {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/skill/drawing']}>
        <UserMenu />
        <Link to="/skill/music">Другой навык</Link>
        <Link to="/">В каталог</Link>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/skill/:id" element={<SkillPage />} />
          <Route path="/" element={<h1>Каталог</h1>} />
        </Routes>
        <NotificationStack />
      </MemoryRouter>
    </Provider>,
  )
}

describe('Уведомления об обмене', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal(
      'fetch',
      vi.fn(async (request: Request) => {
        const { pathname } = new URL(request.url)
        const [, , resource, id] = pathname.split('/')
        const items = resource === 'skills' ? skills : owners
        const data = items.find((item) => item.id === id)
        return data ? Response.json(data) : new Response(null, { status: 404 })
      }),
    )
    store.dispatch(setAuthUser(currentUser))
  })

  afterEach(async () => {
    cleanup()
    await store.dispatch(logout())
    vi.unstubAllGlobals()
  })

  it('создаёт плашку и запись из карточки навыка, открывает владельца и очищает только просмотренные', async () => {
    const user = userEvent.setup()
    renderExchange()

    const offer = await screen.findByRole('button', { name: 'Предложить обмен' })
    await screen.findByText('Алиса')
    await user.click(offer)

    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
    const toast = screen.getByLabelText('Уведомления', { selector: 'div' })
    expect(within(toast).getByText('Вы предложили обмен пользователю Алиса')).toBeVisible()
    expect(within(toast).getByRole('link', { name: 'Перейти' })).toHaveAttribute(
      'href',
      '/skill/drawing',
    )
    await user.click(within(toast).getByRole('button', { name: 'Закрыть' }))

    await user.click(screen.getByRole('link', { name: 'Другой навык' }))
    await screen.findByText('Иван')
    await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
    await user.click(screen.getByRole('button', { name: 'Закрыть' }))
    await user.click(screen.getByRole('link', { name: 'В каталог' }))
    const bell = screen.getByRole('button', { name: 'Уведомления' })
    expect(bell.querySelector('circle')).not.toBeNull()
    await user.click(bell)

    const links = screen.getAllByRole('link', { name: 'Перейти' })
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/skill/music',
      '/skill/drawing',
    ])
    await user.click(links[1])
    expect(await screen.findByText('Алиса')).toBeVisible()
    expect(screen.queryByText('Новые уведомления')).not.toBeInTheDocument()

    await user.click(bell)
    await user.click(screen.getByRole('button', { name: 'Очистить' }))
    expect(screen.queryByText('Вы предложили обмен пользователю Алиса')).not.toBeInTheDocument()
    expect(screen.getByText('Вы предложили обмен пользователю Иван')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Прочитать все' }))
    expect(screen.queryByRole('link', { name: 'Перейти' })).not.toBeInTheDocument()
    expect(bell.querySelector('circle')).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Очистить' }))
    expect(screen.getByText('Уведомлений пока нет')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
  })

  it('восстанавливает историю для нужного аккаунта и не восстанавливает плашку', async () => {
    const user = userEvent.setup()
    const { unmount } = renderExchange()

    await screen.findByText('Алиса')
    await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
    act(() => {
      store.dispatch(setAuthUser(otherUser))
    })

    const bell = screen.getByRole('button', { name: 'Уведомления' })
    await user.click(bell)
    expect(screen.getByText('Уведомлений пока нет')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeEnabled()

    unmount()
    await store.dispatch(logout())
    store.dispatch(setAuthUser(currentUser))
    renderExchange()

    await screen.findByText('Алиса')
    await user.click(screen.getByRole('button', { name: 'Уведомления' }))
    expect(screen.getByText('Вы предложили обмен пользователю Алиса')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Закрыть' })).not.toBeInTheDocument()
  })

  it('возвращает гостя к навыку после входа без автоматического предложения обмена', async () => {
    await store.dispatch(logout())
    const user = userEvent.setup()
    renderExchange()

    await user.click(await screen.findByRole('button', { name: 'Предложить обмен' }))
    expect(screen.getByRole('region', { name: 'Вход' })).toBeVisible()

    act(() => {
      store.dispatch(setAuthUser(currentUser))
    })

    expect(await screen.findByRole('heading', { name: 'Рисование' })).toBeVisible()
    await screen.findByText('Алиса')
    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Закрыть' })).not.toBeInTheDocument()
  })
})
