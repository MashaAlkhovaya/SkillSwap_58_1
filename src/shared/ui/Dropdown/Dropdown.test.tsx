import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from './index'

describe('Dropdown', () => {
  it('открывается и закрывается повторным кликом', async () => {
    const user = userEvent.setup()

    render(
      <Dropdown trigger="Профиль" triggerLabel="Меню профиля">
        {() => <p>Содержимое меню</p>}
      </Dropdown>,
    )

    const trigger = screen.getByRole('button', { name: 'Меню профиля' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Содержимое меню')).not.toBeInTheDocument()

    await user.click(trigger)

    expect(screen.getByText('Содержимое меню')).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.click(trigger)

    await waitFor(() => {
      expect(screen.queryByText('Содержимое меню')).not.toBeInTheDocument()
    })
  })

  it('закрывается по Escape', async () => {
    const user = userEvent.setup()

    render(
      <Dropdown trigger="Профиль" triggerLabel="Меню профиля">
        {() => <p>Содержимое меню</p>}
      </Dropdown>,
    )

    await user.click(screen.getByRole('button', { name: 'Меню профиля' }))
    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByText('Содержимое меню')).not.toBeInTheDocument()
    })
  })

  it('закрывается при клике снаружи', async () => {
    const user = userEvent.setup()

    render(
      <>
        <Dropdown trigger="Профиль" triggerLabel="Меню профиля">
          {() => <p>Содержимое меню</p>}
        </Dropdown>
        <button type="button">Снаружи</button>
      </>,
    )

    await user.click(screen.getByRole('button', { name: 'Меню профиля' }))
    await user.click(screen.getByRole('button', { name: 'Снаружи' }))

    await waitFor(() => {
      expect(screen.queryByText('Содержимое меню')).not.toBeInTheDocument()
    })
  })

  it('позволяет закрыть панель из содержимого', async () => {
    const user = userEvent.setup()

    render(
      <Dropdown trigger="Профиль" triggerLabel="Меню профиля">
        {(close) => (
          <button type="button" onClick={close}>
            Готово
          </button>
        )}
      </Dropdown>,
    )

    await user.click(screen.getByRole('button', { name: 'Меню профиля' }))
    await user.click(screen.getByRole('button', { name: 'Готово' }))

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Готово' })).not.toBeInTheDocument()
    })
  })
})
