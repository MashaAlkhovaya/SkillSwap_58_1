import { Text, Title } from '@/shared/ui'
import lightBulb from './light-bulb.svg'
import userInfo from './user-info.svg'
import schoolBoard from './school-board.svg'
import styles from './RegistrationDecoration.module.css'

export type RegistrationStep = 1 | 2 | 3

interface RegistrationDecorationProps {
  step: RegistrationStep
}

const stepContent = {
  1: {
    image: lightBulb,
    title: 'Добро пожаловать в SkillSwap!',
    description: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  2: {
    image: userInfo,
    title: 'Расскажите немного о себе',
    description: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  3: {
    image: schoolBoard,
    title: 'Укажите, чем вы готовы поделиться',
    description: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
} as const

export function RegistrationDecoration({ step }: RegistrationDecorationProps) {
  const { image, title, description } = stepContent[step]

  return (
    <section className={styles.card} aria-label="Информация о регистрации">
      <div className={styles.content}>
        <img className={styles.image} src={image} alt="" />

        <div className={styles.copy}>
          <Title level={2} size={2} className={styles.title}>
            {title}
          </Title>

          <Text as="p" className={styles.description}>
            {description}
          </Text>
        </div>
      </div>
    </section>
  )
}
