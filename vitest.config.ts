import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

const alias = { '@': resolve(__dirname, './src') }

export default defineConfig({
  resolve: { alias },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/setupTests.ts', 'src/**/*.d.ts', 'src/**/*.stories.*'],
      thresholds: {
        statements: 70,
      },
    },
    projects: [
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./src/setupTests.ts'],
          exclude: ['**/node_modules/**', '**/dist/**', '**/*.stories.*'],
        },
      },
      {
        // Прогон стори-файлов как тестов — через настоящий Chromium (Playwright)
        plugins: [react(), storybookTest({ configDir: resolve(__dirname, '.storybook') })],
        resolve: { alias },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
