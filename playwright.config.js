const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./global.setup.js'),
  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report' }]
  ],
  use: {
    headless: true,
    ...devices['Desktop Chrome'],
  },
});
