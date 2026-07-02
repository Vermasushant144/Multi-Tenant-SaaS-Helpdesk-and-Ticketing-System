const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright E2E testing configuration file.
 */
module.exports = defineConfig({
  // Directory where tests are located
  testDir: './tests',
  
  // Timeout for a single test (30 seconds)
  timeout: 30000,
  
  // Fail compilation on CI if a test is marked only
  forbidOnly: !!process.env.CI,
  
  // Re-run failed tests on CI
  retries: process.env.CI ? 2 : 1,
  
  // Run all tests in parallel
  fullyParallel: true,
  
  // HTML report generator
  reporter: [['html', { open: 'never' }]],
  
  use: {
    // Port 9090 is where our Spring Boot application runs
    baseURL: 'http://localhost:9090',
    
    // Capture traces when retrying failed tests
    trace: 'on-first-retry',
    
    // Run tests in headless mode by default
    headless: true,
  },

  // Configure browser environments
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
