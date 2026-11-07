import type { Meta, StoryObj } from '@storybook/react-vite'
import { RegistrationDecoration } from './index'

const meta = {
  title: 'widgets/RegistrationDecoration',
  component: RegistrationDecoration,
  args: {
    step: 1,
  },
  argTypes: {
    step: {
      control: 'inline-radio',
      options: [1, 2, 3],
    },
  },
} satisfies Meta<typeof RegistrationDecoration>

export default meta
type Story = StoryObj<typeof meta>

export const StepOne: Story = {
  args: {
    step: 1,
  },
}

export const StepTwo: Story = {
  args: {
    step: 2,
  },
}

export const StepThree: Story = {
  args: {
    step: 3,
  },
}
