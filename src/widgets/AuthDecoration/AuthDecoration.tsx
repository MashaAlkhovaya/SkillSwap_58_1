import { Text, Title } from '@/shared/ui'
import lightBulbSrc from './light-bulb-svg.svg'
import styles from './AuthDecoration.module.css'

const contentByStep: Record<number, { illustration: string; title: string; subtitle: string }> = {
  1: {
    illustration: lightBulbSrc,
    title: 'Добро пожаловать в SkillSwap!',
    subtitle: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  2: {
    illustration: lightBulbSrc,
    title: 'Расскажите немного о себе',
    subtitle: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  3: {
    illustration: lightBulbSrc,
    title: 'Укажите, чем вы готовы поделиться',
    subtitle: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
}

interface AuthDecorationProps {
  currentStep?: number
}

export function AuthDecoration({ currentStep = 1 }: AuthDecorationProps) {
  const content = contentByStep[currentStep] ?? contentByStep[3]

  return (
    <section className={styles.card} aria-label="О SkillSwap">
      <div className={styles.content}>
        <img className={styles.bulb} src={content.illustration} width={300} height={300} alt="" />
        <div className={styles.copy}>
          <Title level={1} size={2} className={styles.title}>
            {content.title}
          </Title>
          <Text as="p" className={styles.subtitle}>
            {content.subtitle}
          </Text>
        </div>
      </div>
    </section>
  )
}
