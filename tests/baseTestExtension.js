const { test: base, expect } = require('@playwright/test');
const { EvincedSDK } = require('@evinced/js-playwright-sdk');

const test = base.extend({
  evincedAutoHook: [
    async ({ page }, use, testInfo) => {
      const evincedService = new EvincedSDK(page);
      
      // Auto-start continuous scanning before each test
      await evincedService.evStart();

      await use(evincedService);

      // Auto-stop and persist report after each test
      const issues = await evincedService.evStop();
      await evincedService.evSaveFile(
        issues,
        'html',
        `./evincedReports/auto-${testInfo.title.replace(/\s+/g, '_')}.html`
      );
    },
    { auto: true }
  ]
});

module.exports = { test, expect };
