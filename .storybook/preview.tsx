import type { Preview } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from '../src/app/providers/StoreProvider'
import '../src/app/styles/global.css'
import React from 'react'

const preview: Preview = {
  // Тот же набор провайдеров, что и в src/app/App.tsx (StoreProvider + роутер)
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
