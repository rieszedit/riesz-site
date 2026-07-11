import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:41983',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 41983',
    url: 'http://127.0.0.1:41983',
    reuseExistingServer: false,
    env: {
      ...process.env,
      VITE_FORMSPREE_PERSONAL_ENDPOINT: 'https://formspree.io/f/test-personal',
      VITE_FORMSPREE_BUSINESS_ENDPOINT: 'https://formspree.io/f/test-business',
    },
  },
})
