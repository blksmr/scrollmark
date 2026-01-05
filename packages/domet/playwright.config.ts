import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3333',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx vite --config src/__tests__/fixtures/vite.config.ts --port 3333',
    url: 'http://localhost:3333',
    reuseExistingServer: !process.env.CI,
  },
});
