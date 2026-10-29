import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { ROUTES } from '@/shared/lib/constants'
import logoSrc from './logo_skillswap.png'
import styles from './Logo.module.css'

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link to={ROUTES.HOME} className={clsx(styles.root, className)}>
      <img className={styles.image} src={logoSrc} alt="" width={40} height={40} />
      <span className={styles.name}>SkillSwap</span>
    </Link>
  )
}
