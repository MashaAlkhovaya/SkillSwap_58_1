import { Button, ClockIcon } from '@/shared/ui'

interface ExchangeButtonProps {
  isProposed: boolean
  onClick: () => void
}

export function ExchangeButton({ isProposed, onClick }: ExchangeButtonProps) {
  if (isProposed) {
    return (
      <Button variant="secondary" icon={<ClockIcon />} disabled>
        Обмен предложен
      </Button>
    )
  }

  return (
    <Button variant="primary" onClick={onClick}>
      Предложить обмен
    </Button>
  )
}
