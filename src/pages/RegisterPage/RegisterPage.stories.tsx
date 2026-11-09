import type { Meta, StoryObj } from '@storybook/react-vite'
import RegisterPage from './index'

const meta = {
  title: 'pages/RegisterPage',
  component: RegisterPage,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    totalSteps: 3,
  },
} satisfies Meta<typeof RegisterPage>

export default meta
type Story = StoryObj<typeof meta>

export const StepOne: Story = {
  args: {
    currentStep: 1,
  },
}

export const StepTwo: Story = {
  args: {
    currentStep: 2,
  },
}

export const StepThree: Story = {
  args: {
    currentStep: 3,
  },
}
