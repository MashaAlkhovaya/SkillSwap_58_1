import { RegistrationDecoration } from '@/widgets'
import styles from './RegisterPage.module.css'
import { Stepper } from '@/shared/ui'
import { RegistrationWidget } from '@/widgets/RegistrationWidget'
import { REGISTRATION_STEPS, RegistrationStep } from '@/shared/lib/constants'
import { useState } from 'react'

interface RegisterPageProps {
  currentStep: RegistrationStep
  totalSteps: number
}

const nextStep = (step: RegistrationStep): RegistrationStep => {
  const index = REGISTRATION_STEPS.indexOf(step)
  return REGISTRATION_STEPS[Math.min(index + 1, REGISTRATION_STEPS.length - 1)]
}

const previousStep = (step: RegistrationStep): RegistrationStep => {
  const index = REGISTRATION_STEPS.indexOf(step)
  return REGISTRATION_STEPS[Math.max(0, index - 1)]
}

const normalizeStep = (value: number): RegistrationStep =>
  REGISTRATION_STEPS.find((step) => step === value) ?? REGISTRATION_STEPS[0]

export default function RegisterPage({ currentStep, totalSteps }: RegisterPageProps) {
  const [step, setStep] = useState<RegistrationStep>(() => normalizeStep(currentStep))
  return (
    <div className={styles.page}>
      <Stepper currentStep={step} totalSteps={totalSteps} className={styles.stepper} />
      <RegistrationWidget
        step={step}
        onNext={() => setStep(nextStep)}
        onBack={() => setStep(previousStep)}
        className={styles.left}
      />
      <RegistrationDecoration step={step} className={styles.right} />
    </div>
  )
}
