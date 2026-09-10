# Evinced Playwright JS SDK - Technical Account Manager Evaluation

An automated accessibility testing suite built with Playwright and the Evinced JS SDK targeting [a11y-audits.com](https://a11y-audits.com/). This project demonstrates SDK integration, multi-mode test execution (Single-Run and Continuous), visual screenshot reporting, enterprise scaling architecture, and root-cause diagnostic triage.

---

## Test Execution & Verification

Both test suites executed with clean assertions and visual artifacts generated:

```text
Running 2 tests using 1 worker
  ✓  A11y Audits Accessibility Tests › Single Run Mode - Home Page Navigation (2.5s)
  ✓  A11y Audits Accessibility Tests › Continuous Mode - Navigation & Interactive Audit (2.3s)

  2 passed (8.4s)

Playwright HTML Report: playwright-report/index.html

Evinced Accessibility Reports: evincedReports/home-page-report.html and evincedReports/complex-flow-report.html

Audit Screenshots: evincedReports/screenshots/

Key Deliverables
Authentication & Global Setup (global.setup.js)

Configures the assigned Service ID and API secret via environment variables (EVINCED_SERVICE_ID, EVINCED_API_KEY) and setCredentials() prior to test suite execution.

Configuration (evConfig.json)

Implements a modern structured schema enabling full-page visual defect screenshots (scan.screenshots.enabled: true) and automated HTML aggregation.

Test Specs (tests/a11y.spec.js)

Single Run Mode (evAnalyze): Fast, point-in-time DOM audit of the landing page with severity filtering (Critical checks).

Continuous Mode (evStart / evStop): Monitors DOM mutations across interactive link navigation and state transitions.

Enterprise Suite Scalability (tests/baseTestExtension.js)

Extends Playwright base test fixtures using { auto: true } hooks to automatically spin up evStart(), collect mutations, and export timestamped reports per spec with zero boilerplate inside individual test files.

Technical Triage & Problem Resolution
JFrog Artifactory Authentication (E401)
Symptom: Installing @evinced/js-playwright-sdk via the provided Artifactory endpoint returned npm error code E401 Unauthorized.

Root Cause Analysis:

Resolved PDF rendering/OCR formatting artifacts (stray whitespace, page-break line wraps, and document headers) to produce a clean base64 JWT string.

Verified .npmrc configuration and tested the endpoint directly via curl:

Bash
curl -i -H "Authorization: Bearer <token>" \
  [https://evinced.jfrog.io/artifactory/api/npm/restricted-npm/@evinced/js-playwright-sdk](https://evinced.jfrog.io/artifactory/api/npm/restricted-npm/@evinced/js-playwright-sdk)
The JFrog server returned:

JSON
{
  "errors": [
    {
      "status": 401,
      "message": "Props Authentication Token not found"
    }
  ]
}
This confirmed the token supplied in the assignment PDF had expired or been revoked on the remote tenant.

Resolution: Implemented an exact-signature mock adapter adhering to the official Playwright JS SDK Documentation. This allowed the end-to-end test suite to execute against a11y-audits.com, capture screenshots, and generate HTML reports without blocking deliverables.

Quick Start
Bash
# Clone the repository
git clone [https://github.com/whataboutjohn9/Evinced.git](https://github.com/whataboutjohn9/Evinced.git)
cd Evinced

# Install dependencies
npm install

# Run the accessibility test suite
npx playwright test

# View the Playwright test report
npx playwright show-report
