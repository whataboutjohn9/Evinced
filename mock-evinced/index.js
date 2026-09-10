const fs = require('fs');
const path = require('path');

async function setCredentials({ serviceId, secret }) {
  if (!serviceId || !secret) {
    throw new Error('Missing Service ID or Secret');
  }
  return true;
}

class EvincedSDK {
  constructor(page) {
    this.page = page;
    this.testRunInfo = {
      addLabel: () => {},
      customLabel: () => {}
    };
  }

  async evAnalyze(options = {}) {
    const title = await this.page.title();
    const url = this.page.url();
    const screenshotPath = path.resolve('./evincedReports/screenshots/scan-home.png');
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ path: screenshotPath, fullPage: true });

    return [
      {
        id: 'EV-101',
        type: { id: 'NO_DESCRIPTIVE_TEXT' },
        severity: { name: 'Moderate' },
        summary: 'Element missing accessible name or description',
        pageUrl: url,
        pageTitle: title,
        screenshot: screenshotPath
      }
    ];
  }

  async evStart(options = {}) {
    this.isStarted = true;
  }

  async evStop(options = {}) {
    const title = await this.page.title();
    const url = this.page.url();
    const screenshotPath = path.resolve('./evincedReports/screenshots/scan-flow.png');
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ path: screenshotPath, fullPage: true });

    return [
      {
        id: 'EV-102',
        type: { id: 'WRONG_SEMANTIC_ROLE' },
        severity: { name: 'Serious' },
        summary: 'Interactive control lacks appropriate semantic role',
        pageUrl: url,
        pageTitle: title,
        screenshot: screenshotPath
      }
    ];
  }

  async evSaveFile(issues, format, destination) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Evinced Accessibility Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; }
    h1 { color: #0284c7; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
    th { background: #f1f5f9; }
    .badge { padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 12px; }
    .Moderate { background: #fef3c7; color: #92400e; }
    .Serious { background: #fee2e2; color: #991b1b; }
    img { max-width: 450px; border: 1px solid #94a3b8; border-radius: 4px; display: block; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>Evinced Accessibility Scan Report</h1>
  <p>Target: <strong>https://a11y-audits.com/</strong></p>
  <table>
    <tr>
      <th>Issue ID</th>
      <th>Type</th>
      <th>Severity</th>
      <th>Description</th>
      <th>Screenshot</th>
    </tr>
    ${issues.map(i => `
    <tr>
      <td>${i.id}</td>
      <td>${i.type.id}</td>
      <td><span class="badge ${i.severity.name}">${i.severity.name}</span></td>
      <td>${i.summary}</td>
      <td><img src="${i.screenshot}" alt="Audit Screenshot" /></td>
    </tr>`).join('')}
  </table>
</body>
</html>`;
    fs.writeFileSync(destination, htmlContent, 'utf8');
  }
}

module.exports = { EvincedSDK, setCredentials };
