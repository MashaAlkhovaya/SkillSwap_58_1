import { RegistrationStep } from '@/shared/lib/constants'
import styles from './Stepper.module.css'
import clsx from 'clsx'

interface StepperProps {
  totalSteps: number
  currentStep: RegistrationStep
}

export function Stepper({ totalSteps, currentStep }: StepperProps) {
  const stepsArray = Array.from({ length: totalSteps }, (_, index) => index)

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Шаг {currentStep} из {totalSteps}
      </h2>

      <div className={styles.bars}>
        {stepsArray.map((index) => {
          const isActive = currentStep >= index + 1

          return (
            <div
              data-testid="stepper-line"
              key={index}
              className={clsx(styles.line, isActive ? styles.active : styles.inactive)}
            />
          )
        })}
      </div>
    </div>
  )
}
