import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateInput } from './DateInput'

const meta: Meta<typeof DateInput> = {
  title: 'shared/ui/DateInput',
  component: DateInput,
  parameters: {
    layout: 'padded',
  },
  // decorators: [
  //   (Story) => (
  //     <div data-theme="dark" style={{ padding: '40px', background: '#0f172a' }}>
  //       <Story />
  //     </div>
  //   ),
  // ],
}

export default meta

type Story = StoryObj<typeof DateInput>

// 1. Пустой инпут (начальное состояние)
export const Empty: Story = {
  args: {
    name: 'birthDate',
    label: 'Дата рождения',
    value: null,
    onChange: console.log,
  },
  argTypes: {
    onChange: { action: 'onChange' },
  },
}

// 2. С датой (из календаря) — эмулируем, что пользователь уже выбрал дату
export const WithDateFromPicker: Story = {
  args: {
    name: 'birthDate',
    label: 'Дата рождения',
    // Дата 15.03.1990
    value: new Date(1990, 2, 15),
    onChange: console.log,
  },
  argTypes: {
    onChange: { action: 'onChange' },
  },
}

// 3. С ручным вводом строки — валидацию не делаем, просто передаём строку
export const WithManualInput: Story = {
  args: {
    name: 'birthDate',
    label: 'Дата рождения',
    // Строка в формате дд.мм.гггг (валидация будет на submit формы)
    value: '25.12.2000',
    onChange: console.log,
  },
  argTypes: {
    onChange: { action: 'onChange' },
  },
}

// 4. Disabled — компонент заблокирован, календарь не открывается
export const Disabled: Story = {
  args: {
    name: 'birthDate',
    label: 'Дата рождения',
    value: null,
    disabled: true,
    onChange: console.log,
  },
  argTypes: {
    onChange: { action: 'onChange' },
  },
}
