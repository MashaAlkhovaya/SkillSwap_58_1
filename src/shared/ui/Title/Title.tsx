import clsx from 'clsx'
import styles from './Title.module.css'

export type TitleLevel = 1 | 2 | 3 | 4

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Семантический уровень: какой тег h1–h4 рендерить */
  level: TitleLevel
  /** Визуальный размер; по умолчанию совпадает с level */
  size?: TitleLevel
}

export const Title = ({ level, size, className, children, ...props }: TitleProps) => {
  const Tag = `h${level}` as const

  return (
    <Tag className={clsx(styles.title, styles[`size${size ?? level}`], className)} {...props}>
      {children}
    </Tag>
  )
}
