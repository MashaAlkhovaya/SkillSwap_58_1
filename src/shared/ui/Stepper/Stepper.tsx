import styles from './Stepper.module.css'
import clsx from 'clsx'

interface StepperProps {
  totalSteps: number
  currentStep: number
  className?: string
}

export function Stepper({ totalSteps, currentStep, className }: StepperProps) {
  const stepsArray = Array.from({ length: totalSteps }, (_, index) => index)

  return (
    <div className={clsx(styles.container, className)}>
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
