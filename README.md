# TeamFlow – QA Automation

## Project Overview
TeamFlow QA Automation is an end-to-end testing project built using Playwright to validate the functionality of the TeamFlow web application.

The automation suite tests the application across multiple browsers to identify functional issues and ensure application quality.

## Application Under Test
- **Application:** TeamFlow
- **Environment:** Deployed Website
- **URL:** https://team-flow-mauve.vercel.app

## Technologies Used
- Playwright
- JavaScript
- Node.js
- Git and GitHub

## Project Structure

```text
TeamFlow-Automation/
├── tests/
│   └── teamflow.spec.js
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.js
└── README.md
```

## Browser Coverage
- Chromium
- Firefox
- WebKit

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd TeamFlow-Automation
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Environment Variables

Create a `.env` file in the project root and configure your test credentials:

```env
TEST_EMAIL=your_test_email
TEST_PASSWORD=your_test_password
```

Never commit the `.env` file to GitHub.

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run tests in Chromium:

```bash
npx playwright test --project=chromium
```

Run tests in Firefox:

```bash
npx playwright test --project=firefox
```

Run tests in WebKit:

```bash
npx playwright test --project=webkit
```

Run a specific test:

```bash
npx playwright test --grep "DTF_001"
```

## Test Reports

Generate and view the Playwright HTML report:

```bash
npx playwright show-report
```

## Testing Approach

The project follows a structured QA testing approach:

1. Test case preparation
2. Test execution
3. Defect identification
4. Defect reporting
5. Retesting
6. Regression testing

## Author

QA Automation Project – TeamFlow