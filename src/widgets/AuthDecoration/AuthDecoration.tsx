import { Text, Title } from '@/shared/ui'
import lightBulbSrc from './light-bulb-svg.svg'
import styles from './AuthDecoration.module.css'

export function AuthDecoration() {
  return (
    <section className={styles.card} aria-label="О SkillSwap">
      <div className={styles.content}>
        <img className={styles.bulb} src={lightBulbSrc} width={300} height={300} alt="" />
        <div className={styles.copy}>
          <Title level={1} size={2} className={styles.title}>
            Добро пожаловать в SkillSwap!
          </Title>
          <Text as="p" className={styles.subtitle}>
            Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми
          </Text>
        </div>
      </div>
    </section>
  )
}
