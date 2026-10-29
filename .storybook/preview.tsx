import type { Preview } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from '@/app/providers/StoreProvider'
import '@/app/styles/global.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <StoreProvider>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </StoreProvider>
    ),
  ],
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
