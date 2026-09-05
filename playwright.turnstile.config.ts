import { defineConfig } from '@playwright/test'
import base from './playwright.config'

export default defineConfig({
  ...base,
  testDir: './tests/turnstile',
  webServer: {
    command: 'node scripts/preview-tests.mjs',
    url: 'http://127.0.0.1:41983',
    reuseExistingServer: false,
    env: {
      ...process.env,
      VITE_FORMSPREE_PERSONAL_ENDPOINT: 'https://formspree.io/f/test-personal',
      VITE_FORMSPREE_BUSINESS_ENDPOINT: 'https://formspree.io/f/test-business',
      VITE_TURNSTILE_SITE_KEY: '0xMockedWidgetForTestsOnly',
      VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN: '',
    },
  },
})
