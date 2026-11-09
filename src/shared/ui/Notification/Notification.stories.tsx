import type { Meta, StoryObj } from '@storybook/react-vite'
import { Notification } from './Notification'

const action =
  (name: string) =>
  (...args: unknown[]) =>
    console.log(name, args)
const meta: Meta<typeof Notification> = {
  title: 'Shared/UI/Notification',
  component: Notification,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['success', 'error', 'info'],
      description: 'Тип уведомления (влияет на цвет)',
    },
    duration: {
      control: 'number',
      description: 'Время автозакрытия в мс (0 - отключить)',
    },
  },
  args: {
    onClose: action('onClose'),
    title: 'Новое уведомление',
  },
}

export default meta
type Story = StoryObj<typeof Notification>

// 1. Базовые состояния (Success, Error, Info)

export const Success: Story = {
  args: {
    type: 'success',
    title: 'Успех!',
    message: 'Вы успешно обменялись навыками.',
  },
}

export const Error: Story = {
  args: {
    type: 'error',
    title: 'Ошибка',
    message: 'Не удалось выполнить запрос. Попробуйте позже.',
  },
}

export const Info: Story = {
  args: {
    type: 'info',
    title: 'Обратите внимание',
    message: 'У вас есть непрочитанные сообщения.',
  },
}

// 2. Граничные случаи

export const WithoutMessage: Story = {
  args: {
    type: 'info',
    title: 'Только заголовок',
    message: '',
  },
}

export const LongText: Story = {
  args: {
    type: 'error',
    title: 'Очень длинный заголовок уведомления, который должен корректно переноситься',
    message:
      'Этот текст очень длинный. Он нужен для того, чтобы проверить, как компонент справляется с переполнением контейнера и переносом слов. Если текст не переносится, он испортит верстку.',
  },
}

// 3. Состояние с автозакрытием

export const AutoClose: Story = {
  args: {
    type: 'success',
    title: 'Быстрое уведомление',
    message: 'Эта плашка исчезнет через 3 секунды.',
    duration: 3000,
  },
}

// 4. Состояние с отключенным таймером

export const NoAutoClose: Story = {
  args: {
    type: 'info',
    title: 'Постоянное уведомление',
    message: 'Это уведомление не закроется само. Нажмите на крестик.',
    duration: 0,
  },
}
