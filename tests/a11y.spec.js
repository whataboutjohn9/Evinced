const { test, expect } = require('@playwright/test');
const { EvincedSDK } = require('@evinced/js-playwright-sdk');

test.describe('A11y Audits Accessibility Tests', () => {

  // Test 1: Simple Navigation (Single Run Mode - evAnalyze)
  test('Single Run Mode - Home Page Navigation', async ({ page }) => {
    const evincedService = new EvincedSDK(page);

    await page.goto('https://a11y-audits.com/');

    const issues = await evincedService.evAnalyze({
      scan: { screenshots: { enabled: true } }
    });

    await evincedService.evSaveFile(issues, 'html', './evincedReports/home-page-report.html');

    // Assert that no critical accessibility blockers are found
    const criticalIssues = issues.filter(i => i.severity && i.severity.name === 'Critical');
    expect(criticalIssues.length).toBe(0);
  });

  // Test 2: Complex Interaction Flow (Continuous Mode - evStart / evStop)
  test('Continuous Mode - Navigation & Interactive Audit', async ({ page }) => {
    const evincedService = new EvincedSDK(page);

    await evincedService.evStart({
      scan: { screenshots: { enabled: true } }
    });

    await page.goto('https://a11y-audits.com/');

    // Interact with page navigation
    const targetLink = page.getByRole('link').first();
    if (await targetLink.isVisible()) {
      await targetLink.click();
    }

    const issues = await evincedService.evStop();
    await evincedService.evSaveFile(issues, 'html', './evincedReports/complex-flow-report.html');

    expect(issues).toBeDefined();
  });
});
