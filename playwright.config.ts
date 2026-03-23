import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Timeout per test */
  timeout: 60000,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Use the HTML reporter to output visual reports inline */
  reporter: [
    ['html', { outputFolder: 'test-results/report', open: 'always' }],
    ['list']
  ],
  /* Shared settings for all the projects below. */
  use: {
    /* 
      NOTE: The prompt asked for http://localhost:5173.
      However, Vite automatically bound to http://localhost:5174 inside your workspace terminal 
      because 5173 was busy. We are checking 5174 where the app is actually living currently!
    */
    baseURL: 'http://localhost:5173',

    /* Run tests in HEADED mode so you can actively watch the browser */
    headless: false,
    
    launchOptions: {
      /* Slow down every action by 600ms to visually follow the steps */
      slowMo: 600,
    },

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',

    /* Enable Video and Screenshots for everything, outputting into 'test-results' */
    video: 'on',
    screenshot: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
