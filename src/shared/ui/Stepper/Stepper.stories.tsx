import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stepper } from './Stepper'

const meta = {
  component: Stepper,
  args: {
    totalSteps: 3,
    currentStep: 1,
  },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

export const StepOne: Story = {}

export const StepTwo: Story = {
  args: { currentStep: 2 },
}

export const StepThree: Story = {
  args: { currentStep: 3 },
}

export const ManySteps: Story = {
  args: { totalSteps: 7, currentStep: 4 },
}
