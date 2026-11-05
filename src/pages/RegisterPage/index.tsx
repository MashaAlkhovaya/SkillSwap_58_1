import { AuthDecoration, AuthWidget } from '@/widgets'
import styles from './RegisterPage.module.css'
import { Stepper } from '@/shared/ui'

interface RegisterPageProps {
  currentStep: number
  totalSteps: number
}

export default function RegisterPage({ currentStep, totalSteps }: RegisterPageProps) {
  const stepsCount = Number.isFinite(totalSteps) ? Math.max(Math.trunc(totalSteps), 1) : 1
  const requestedStep = Number.isFinite(currentStep) ? Math.trunc(currentStep) : 1
  const step = Math.min(Math.max(requestedStep, 1), stepsCount)

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.stepper}>
          <Stepper currentStep={step} totalSteps={stepsCount} />
        </div>
        <AuthWidget />
        <AuthDecoration currentStep={step} />
      </div>
    </main>
  )
}
