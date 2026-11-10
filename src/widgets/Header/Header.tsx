import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES, SKILL_CATEGORIES } from '@/shared/lib/constants'
import {
  TextInput,
  CloseIcon,
  Avatar,
  SearchIcon,
  ChevronDown,
  Dropdown,
  Button,
  MoonIcon,
  BellIcon,
  HeartIcon,
  Logo,
  BriefcaseIcon,
  PaletteIcon,
  GlobalIcon,
  BookIcon,
  HomeIcon,
  LifestyleIcon,
} from '@/shared/ui'
import styles from './Header.module.css'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout, selectAuthUser } from '@/features/auth/model/authSlice'

const CATEGORY_ICONS = {
  business: BriefcaseIcon,
  art: PaletteIcon,
  languages: GlobalIcon,
  education: BookIcon,
  'home-coziness': HomeIcon,
  health: LifestyleIcon,
}

export function Header() {
  const user = useAppSelector(selectAuthUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const normalizedPathname = pathname.replace(/\/+$/, '') || '/'
  const isCompact = normalizedPathname === ROUTES.LOGIN || normalizedPathname === ROUTES.REGISTER

  async function handleLogout() {
    await dispatch(logout())
    navigate(ROUTES.HOME)
  }

  if (isCompact) {
    return (
      <header className={`${styles.header} ${styles.compact}`}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}>
          <Button variant="tertiary" trailingIcon={<CloseIcon />} className={styles.closeButton}>
            Закрыть
          </Button>
        </div>
      </header>
    )
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo />
        <Link to={ROUTES.ABOUT}>О проекте</Link>
        <Dropdown
          trigger={
            <>
              Все навыки
              <ChevronDown aria-hidden="true" />
            </>
          }
          triggerLabel="Открыть меню навыков"
        >
          {() => (
            <div className={styles.skillsMenu}>
              {SKILL_CATEGORIES.map((category) => {
                const CategoryIcon = CATEGORY_ICONS[category.id]

                return (
                  <section key={category.id}>
                    <div className={styles.categoryTitle}>
                      <span className={styles.categoryIcon} data-category={category.id}>
                        <CategoryIcon size={20} />
                      </span>
                      <h3>{category.title}</h3>
                    </div>
                    <ul>
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.id}>{subcategory.title}</li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          )}
        </Dropdown>
      </div>
      <div className={styles.center}>
        {/* TODO: заменить на виджет поиска по навыкам */}
        <TextInput
          className={styles.searchInput}
          placeholder="Искать навык"
          leftContent={<SearchIcon size={20} color="var(--color-text-secondary)" />}
        />
        <Button
          variant="tertiary"
          icon={<MoonIcon color="var(--color-text)" />}
          aria-label="Переключить тему"
        />
      </div>
      <div className={styles.right}>
        {user ? (
          <>
            <Button variant="tertiary" icon={<BellIcon />} aria-label="Уведомления" />
            <Button variant="tertiary" icon={<HeartIcon />} aria-label="Избранное" />
            <Dropdown
              trigger={
                <>
                  <span>{user.name}</span>
                  <Avatar
                    src={user.avatarUrl ?? null}
                    alt={`Аватар пользователя ${user.name}`}
                    size="sm"
                  />
                </>
              }
              triggerLabel="Меню пользователя"
            >
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
          </>
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
