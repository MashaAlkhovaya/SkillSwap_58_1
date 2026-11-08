import { RegistrationDecoration } from '@/widgets'
import styles from './RegisterPage.module.css'
import { Stepper } from '@/shared/ui'
import { RegistrationWidget } from '@/widgets/RegistrationWidget'

import { useEffect, useState } from 'react'
export const REGISTRATION_STEPS = [1, 2, 3] as const
export type RegistrationStep = (typeof REGISTRATION_STEPS)[number]
export const TOTAL_STEPS = REGISTRATION_STEPS.length

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

const normalizeTotalSteps = (value: number): number =>
  Number.isInteger(value) && value > 0 ? value : 1

const normalizeStep = (value: number, totalSteps: number): RegistrationStep => {
  if (!Number.isFinite(value)) return REGISTRATION_STEPS[0]

  const boundedStep = Math.min(
    Math.max(Math.floor(value), REGISTRATION_STEPS[0]),
    totalSteps,
    REGISTRATION_STEPS.length,
  )

  return REGISTRATION_STEPS.find((step) => step === boundedStep) ?? REGISTRATION_STEPS[0]
}

export default function RegisterPage({ currentStep, totalSteps }: RegisterPageProps) {
  const normalizedTotalSteps = normalizeTotalSteps(totalSteps)
  const [step, setStep] = useState<RegistrationStep>(() =>
    normalizeStep(currentStep, normalizedTotalSteps),
  )

  useEffect(() => {
    setStep(normalizeStep(currentStep, normalizedTotalSteps))
  }, [currentStep, normalizedTotalSteps])

  return (
    <div className={styles.page}>
      <Stepper currentStep={step} totalSteps={normalizedTotalSteps} className={styles.stepper} />
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
