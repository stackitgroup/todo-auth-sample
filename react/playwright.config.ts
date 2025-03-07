import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 3 * 60 * 1000, // 3 minutes
  expect: { timeout: 3 * 60 * 1000 },
  retries: 1,
  workers: 1,
  maxFailures: 1,
  fullyParallel: false,
  use: {
    trace: 'off',
    storageState: './storageState.json'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
