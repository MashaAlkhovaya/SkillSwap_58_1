import type { Preview } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from '@/app/providers/StoreProvider'
import '@/app/styles/global.css'

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'

      return (
        <div data-theme={theme}>
          <StoreProvider>
            <BrowserRouter>
              <Story />
            </BrowserRouter>
          </StoreProvider>
        </div>
      )
    },
  ],
  globalTypes: {
    theme: {
      description: 'Theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
