import type { Meta, StoryObj } from '@storybook/react-vite'
import { RegistrationWidget } from './RegistrationWidget'

const meta = {
  title: 'widgets/RegistrationWidget',
  component: RegistrationWidget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    step: { control: 'radio', options: [1, 2, 3] },
  },
  args: {
    onNext: () => console.log('onNext'),
    onBack: () => console.log('onBack'),
  },
} satisfies Meta<typeof RegistrationWidget>

export default meta
type Story = StoryObj<typeof meta>

/* Шаг 1: Google, Apple, разделитель «или», Email, Пароль
   с кнопкой глаза и подсказкой, «Далее», «Уже есть аккаунт? Войти» */
export const Step1: Story = {
  args: {
    step: 1,
  },
}

/* Шаг 2: аватар с плюсом, Имя, Дата рождения + Пол в один ряд,
  Город, Категория навыка, Подкатегория навыка,
   внизу «Назад» и «Продолжить» */
export const Step2: Story = {
  args: {
    step: 2,
  },
}

/* Шаг 3: Название навыка, Категория + Подкатегория в один ряд,
  Описание, FileInput с лейблом про изображения навыка,
   внизу «Назад» и «Продолжить» */
export const Step3: Story = {
  args: {
    step: 3,
  },
}

/* ---------- Тёмная тема ---------- */

export const Step1Dark: Story = {
  args: {
    step: 1,
  },
  decorators: [
    (Story) => (
      <div data-theme="dark">
        <Story />
      </div>
    ),
  ],
}

export const Step2Dark: Story = {
  args: {
    step: 2,
  },
  decorators: [
    (Story) => (
      <div data-theme="dark">
        <Story />
      </div>
    ),
  ],
}

export const Step3Dark: Story = {
  args: {
    step: 3,
  },
  decorators: [
    (Story) => (
      <div data-theme="dark">
        <Story />
      </div>
    ),
  ],
}
