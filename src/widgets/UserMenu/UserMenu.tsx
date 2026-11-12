import { Link, useNavigate } from 'react-router-dom'
import { logout, selectAuthUser } from '@/features/auth/model/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useTheme } from '@/features/theme-switcher'
import { Avatar, Dropdown, Button, MoonIcon, HeartIcon, LogoutIcon } from '@/shared/ui'
import { ROUTES } from '@/shared/lib/constants'
import styles from './UserMenu.module.css'
import { NotificationDropdown } from './NotificationDropdown'

export function UserMenu() {
  const user = useAppSelector(selectAuthUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    await dispatch(logout())
    navigate(ROUTES.HOME)
  }

  return (
    <div className={styles.container}>
      <div className={styles.iconsGroup}>
        <button
          onClick={toggleTheme}
          className={styles.iconBtn}
          aria-label={theme === 'light' ? 'Включить темную тему' : 'Включить светлую тему'}
          type="button"
        >
          <MoonIcon className={`${styles.icon} ${theme === 'dark' ? styles.iconActive : ''}`} />
        </button>

        {user && (
          <>
            <NotificationDropdown key={user.id} />
            <Link to={ROUTES.FAVORITES} className={styles.iconBtn} aria-label="Избранное">
              <HeartIcon className={styles.icon} />
            </Link>
          </>
        )}
      </div>

      {user ? (
        <Dropdown
          triggerLabel="Меню пользователя"
          trigger={
            <div className={styles.triggerContent}>
              <span className={styles.userName}>{user.name}</span>
              <Avatar src={user.avatarUrl || '/favicon.svg'} alt={user.name} size="sm" />
            </div>
          }
        >
          {(close) => (
            <div className={styles.dropdownContent}>
              <Link to={ROUTES.PROFILE} className={styles.dropdownItem} onClick={close}>
                Личный кабинет
              </Link>
              <button
                onClick={() => {
                  close()
                  void handleLogout()
                }}
                className={styles.dropdownItem}
                type="button"
              >
                Выйти из аккаунта
                <LogoutIcon className={styles.logoutIcon} />
              </button>
            </div>
          )}
        </Dropdown>
      ) : (
        <div className={styles.authButtons}>
          <Button variant="secondary" size="md" onClick={() => navigate(ROUTES.LOGIN)}>
            Войти
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate(ROUTES.REGISTER)}>
            Зарегистрироваться
          </Button>
        </div>
      )}
    </div>
  )
}
