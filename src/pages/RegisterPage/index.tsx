import { AuthDecoration, AuthWidget } from '@/widgets'
import styles from './RegisterPage.module.css'
import { Stepper } from '@/shared/ui'

interface RegisterPageProps {
  currentStep: number
  totalSteps: number
}

export default function RegisterPage({ currentStep, totalSteps }: RegisterPageProps) {
  const step = Math.min(Math.max(currentStep, 1), totalSteps)

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.stepper}>
          <Stepper currentStep={step} totalSteps={totalSteps} />
        </div>
        <AuthWidget />
        <AuthDecoration currentStep={step} />
      </div>
    </main>
  )
}
