import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Logo } from '@/shared/ui'
import styles from './Footer.module.css'

const linkGroups = [
  [
    { label: 'О проекте', to: ROUTES.ABOUT },
    { label: 'Все навыки', to: ROUTES.ALL_SKILLS },
  ],
  [
    { label: 'Контакты', to: ROUTES.CONTACTS },
    { label: 'Блог', to: ROUTES.BLOG },
  ],
  [
    { label: 'Политика конфиденциальности', to: ROUTES.PRIVACY },
    { label: 'Пользовательское соглашение', to: ROUTES.TERMS },
  ],
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Logo className={styles.logo} />

        <nav className={styles.navigation} aria-label="Навигация в подвале">
          {linkGroups.map((group) => (
            <ul className={styles.column} key={group[0].to}>
              {group.map(({ label, to }) => (
                <li key={to}>
                  <Link className={styles.link} to={to}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </nav>

        <p className={styles.copyright}>SkillSwap — 2025</p>
      </div>
    </footer>
  )
}
