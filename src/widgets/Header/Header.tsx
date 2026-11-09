import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Logo } from '@/shared/ui/Logo'
import { TextInput } from '@/shared/ui/TextInput'
import { Button } from '@/shared/ui/Button'
import { SearchIcon } from '@/shared/ui/icons'
import styles from './Header.module.css'
import { logout, selectAuthUser } from '@/features/auth/model/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Dropdown } from '@/shared/ui/Dropdown'

export function Header() {
  const user = useAppSelector(selectAuthUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  async function handleLogout() {
    await dispatch(logout())
    navigate(ROUTES.HOME)
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo />
        <Link to={ROUTES.ABOUT}>О проекте</Link>
        {/* TODO: «Все навыки» станет раскрывающимся меню (Dropdown #49) с шевроном */}
        <Link to={ROUTES.ALL_SKILLS}>Все навыки</Link>
      </div>
      <div className={styles.center}>
        {/* TODO: заменить на виджет поиска по навыкам */}
        <TextInput
          placeholder="Искать навык"
          leftContent={<SearchIcon size={20} color="var(--color-text-secondary)" />}
        />
      </div>

      <div className={styles.right}>
        {/* TODO: иконка луны (переключатель темы) из #66 */}
        {/* TODO: для авторизованного пользователя вместо кнопок: колокольчик, сердце, имя и Avatar */}
        {user ? (
          <Dropdown trigger={user.name} triggerLabel="Меню пользователя">
            {(close) => (
              <button
                type="button"
                onClick={() => {
                  close()
                  void handleLogout()
                }}
              >
                Выйти из аккаунта
              </button>
            )}
          </Dropdown>
        ) : (
          <>
            <Button variant="secondary" onClick={() => navigate(ROUTES.LOGIN)}>
              Войти
            </Button>
            <Button variant="primary">Зарегистрироваться</Button>
          </>
        )}
      </div>
    </header>
  )
}
