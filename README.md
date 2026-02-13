# Hotel Booking Test Automation

This project contains automated end-to-end tests for a hotel booking website using WebdriverIO.

## Prerequisites

### Node.js Version
- **Required:** Node.js **v18.0.0 or higher**
- **Recommended:** Node.js **v20.x LTS**

To check your Node.js version:
```bash
node --version
```

### Required Software
- **Browser:** Microsoft Edge (tests run in headless mode)
- **Operating System:** Windows (tested), macOS, or Linux

## Installation

1. **Clone or navigate to the project directory:**

2. **Install all dependencies:**
```bash
npm install
```

This will install all required packages including:
- WebdriverIO test framework
- Mocha test runner
- HTML and JSON reporters
- Edge browser driver

## Running Tests

### Run All Tests
Execute all test suites in parallel:
```bash
npm test
```

### Run Tests Sequentially
Execute all tests one at a time (slower but more stable):
```bash
npm run test:sequential
```

### Run Individual Test Suites
Execute specific test suites:

```bash
# User Story 1: Registration
npm run test:us1

# User Story 2: Authentication
npm run test:us2

# User Story 3: Browse Plans
npm run test:us3

# User Story 4: Reservation
npm run test:us4

# User Story 5: Profile Management
npm run test:us5

# User Story 6: Session Management
npm run test:us6
```

## Test Reports

After running tests, reports are automatically generated in multiple formats:

### 1. Console Output
Test results are displayed in the terminal in real-time with colored output showing passed/failed tests.

### 2. HTML Report
A detailed HTML report with visual representation of test results using wdio-html-nice-reporter.

**Location:** `reports/html-report/report.html`

**To open the HTML report:**
```bash
npm run report:open
```

Or manually open the file in your browser:
- Windows: `start reports/html-report/report.html`
- macOS: `open reports/html-report/report.html`
- Linux: `xdg-open reports/html-report/report.html`


### 3. JSON Report
Raw test data in JSON format for programmatic processing.

**Location:** `reports/json/wdio-results-*.json`

**To generate the summary report:**
```bash
npm run report
```

**Location:** `reports/test-summary.txt`

The summary report includes:
- **Total number of tests executed**
- **Number of passed tests** (with percentage)
- **Number of failed tests** (with percentage)
- **Execution time**
- **Detailed list of all tests** with their status
- **Complete failure messages** with stack traces for failed tests


## Project Structure

```
zadanie/
├── test/
│   ├── fixtures/          # Test data
│   │   └── testData.js
│   ├── helpers/           # Helper utilities
│   │   ├── cleanup.js
│   │   └── logger.js
│   ├── pageobjects/       # Page Object Models
│   │   ├── BasePage.js
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── SignupPage.js
│   │   └── ...
│   └── specs/             # Test specifications
│       ├── us1-registration.spec.js
│       ├── us2-authentication.spec.js
│       ├── us3-browse-plans.spec.js
│       ├── us4-reservation.spec.js
│       ├── us5-profile-management.spec.js
│       └── us6-session-management.spec.js
├── reports/               # Generated test reports
│   ├── html-report/       # HTML reports
│   │   └── report.html
│   ├── json/              # JSON reports
│   └── test-summary.txt   # Text summary
├── wdio.conf.js          # WebdriverIO configuration (parallel)
├── wdio.sequential.conf.js # Sequential configuration
├── generate-report.js    # Report generation script
├── package.json          # Project dependencies
└── README.md            # This file
```