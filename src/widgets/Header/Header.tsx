import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Logo } from '@/shared/ui'
import { TextInput } from '@/shared/ui'
import { Button } from '@/shared/ui'
import { SearchIcon } from '@/shared/ui'
import styles from './Header.module.css'

export function Header() {
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
        <Button variant="secondary">Войти</Button>
        <Button variant="primary">Зарегистрироваться</Button>
      </div>
    </header>
  )
}
