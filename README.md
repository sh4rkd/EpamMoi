# Cypress E2E Automation - SauceDemo

[![CI](https://github.com/sh4rkd/EpamMoi/workflows/CI/badge.svg)](https://github.com/sh4rkd/EpamMoi/actions)
[![Cypress](https://img.shields.io/badge/cypress-15.7.0-brightgreen.svg)](https://www.cypress.io/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-113%20total-blue.svg)]()
[![Node](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org/)

End-to-end automation framework for testing the [SauceDemo](https://www.saucedemo.com) application using Cypress, TypeScript, and the Page Object Model pattern.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [CI/CD](#cicd)
- [Architecture](#architecture)
- [Contributing](#contributing)

## ✨ Features

- ✅ **Cypress 15.7.0** - Modern and fast E2E testing framework
- ✅ **TypeScript 5.9.3** - Type safety with strict mode
- ✅ **Selector Registry + Commands** - Pages keep locators, commands handle flows
- ✅ **113+ Tests** - Comprehensive coverage of critical user flows
- ✅ **Custom Commands** - Reusable test utilities with full TypeScript support
- ✅ **Test Fixtures** - Data-driven testing with centralized test data
- ✅ **CI/CD Ready** - GitHub Actions workflow with automatic test execution
- ✅ **Rich Reporting** - Screenshots, videos, and HTML reports
- ✅ **Multiple Users** - Tests for all SauceDemo user types

## 📊 Test Coverage

### General Statistics

- **Total Test Suites**: 6
- **Total Test Cases**: 113+
- **Users Tested**: 6 different types
- **Distribution**: 60% positive scenarios, 40% negative/edge cases

### Breakdown by User

#### Standard User (54 tests)

- ✅ Authentication
- ✅ Inventory (sorting, display)
- ✅ Cart Actions (add, remove, badge)
- ✅ Cart Validation
- ✅ Complete Purchase Flow
- ✅ Checkout Negative Scenarios

#### Error User (10 tests)

- ✅ Authentication
- ✅ Inventory
- ✅ Error Validation (expected behavior without error messages)

#### Performance Glitch User (20 tests)

- ✅ Authentication with delays
- ✅ Inventory with sorting
- ✅ Cart Actions with slow responses
- ✅ Cart Validation

#### Problem User (18 tests)

- ✅ Authentication
- ✅ Inventory (with image issues)
- ✅ Cart Actions
- ✅ Cart Validation
- ✅ Recovery through reset

#### Visual User (6 tests)

- ✅ Authentication
- ✅ Product Details
- ✅ Visual Consistency

#### Locked Out User (7 tests)

- ✅ Authentication Blocking
- ✅ Error Message Handling
- ✅ Navigation Prevention

## 🏗️ Project Structure

```
cypress/
├── e2e/                          # Test specifications
│   ├── standard-user.cy.ts       # Standard user tests (54 tests)
│   ├── error-user.cy.ts          # Error user tests (10 tests)
│   ├── performance-glitch-user.cy.ts  # Performance tests (20 tests)
│   ├── problem-user.cy.ts        # Problem user tests (18 tests)
│   ├── visual-user.cy.ts         # Visual user tests (6 tests)
│   └── locked-out-user.cy.ts     # Locked out user tests (7 tests)
├── fixtures/                     # Test data
│   └── users.json                # User credentials
├── pages/                        # Selector registries (no Cypress logic)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutInformationPage.ts
│   ├── CheckoutOverviewPage.ts
│   ├── CheckoutCompletePage.ts
│   └── ProductDetailsPage.ts
└── support/                      # Custom commands and configuration
    ├── commands.ts               # Type declarations + module registry
    ├── commands/                 # Domain-specific custom commands
    │   ├── login.ts
    │   ├── inventory.ts
    │   ├── cart.ts
    │   ├── checkout-information.ts
    │   ├── checkout-overview.ts
    │   ├── checkout-complete.ts
    │   └── product-details.ts
    ├── data/
    │   └── users.ts              # User types and data
    └── e2e.ts                    # Global hooks (logging, exception handling)
```

## 📦 Prerequisites

- **Node.js**: 20.x or higher ([Download](https://nodejs.org/))
- **npm**: 10.x or higher (included with Node.js)
- **Git**: For version control
- **Chrome**: Latest version (primary test browser)

## 🚀 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sh4rkd/EpamMoi.git
   cd EpamMoi
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Verify installation**:

   ```bash
   npx cypress verify
   ```

## 🧪 Running Tests

### Interactive Mode (Cypress Test Runner)

Open the Cypress Test Runner with a graphical interface:

```bash
npm run cypress:open
```

This opens the Cypress UI where you can:

- Select and run individual tests
- See live test execution
- Debug with time-travel snapshots
- Inspect DOM elements

### Headless Mode (CI/Local)

Run all tests in headless mode:

```bash
npm run cypress:run
```

Or using the test script:

```bash
npm test
```

### Run Specific Tests

```bash
# Run only standard user tests
npx cypress run --spec "cypress/e2e/standard-user.cy.ts"

# Run only special user tests
npx cypress run --spec "cypress/e2e/*-user.cy.ts"
```

### Run in Specific Browser

```bash
# Firefox
npx cypress run --browser firefox

# Edge
npx cypress run --browser edge
```

## 🔍 Type Checking

Run TypeScript type checking:

```bash
npm run type-check
```

## 🔄 CI/CD

This project includes a GitHub Actions workflow that:

- ✅ Runs on every push and pull request
- ✅ Uses Node.js 20.x
- ✅ Executes all tests in headless mode
- ✅ Uploads screenshots and videos as artifacts on failure
- ✅ Verifies TypeScript types
- ✅ Provides test results in the Actions tab

View the workflow: `.github/workflows/ci.yml`

## 🏛️ Architecture

### Selector-Only Page Objects

Each file inside `cypress/pages` exports **only selectors and types**. This keeps element locators in a single place without leaking Cypress logic into the page layer. Example:

```typescript
// cypress/pages/LoginPage.ts
export const loginSelectors = {
  username: "[data-test='username']",
  password: "[data-test='password']",
  submit: "[data-test='login-button']",
  error: "[data-test='error']",
};
```

### Command-Centric Flow

All reusable flows live inside `cypress/support/commands/`. The index file `support/commands.ts` declares the `Cypress.Chainable` interface and registers each domain module (login, inventory, cart, checkout, etc.). Specs never access selectors directly; they rely on `cy.*` helpers:

```typescript
// cypress/support/commands/login.ts
Cypress.Commands.add("login", (username: string, password = "secret_sauce") => {
  cy.get(loginSelectors.username).clear().type(username);
  cy.get(loginSelectors.password).clear().type(password);
  cy.get(loginSelectors.submit).click();
});
```

```typescript
// cypress/e2e/standard-user.cy.ts
it("completes the purchase flow", () => {
  cy.login(users.usernames.standard, users.password);
  cy.inventoryWaitForLoad();
  cy.inventoryAddProduct("Sauce Labs Backpack");
  cy.inventoryOpenCart();
  cy.cartCheckout();
  cy.checkoutFillInformation(customerData);
  cy.checkoutContinue();
  cy.checkoutOverviewFinish();
  cy.checkoutAssertSuccessMessage();
});
```

**Key principles**:

- Selectors live exclusively in `cypress/pages/*`.
- `support/commands/*.ts` acts as the reusable command “monolith”.
- Specs stay declarative by chaining meaningful `cy.*` helpers.
- `support/e2e.ts` centralizes global hooks (logging, exception handling).

### Network Interceptors for SauceDemo

Although the SauceDemo UI is static, the browser still makes deterministic network calls that we can control with Cypress:

- `cy.sauceInterceptServiceWorker()` returns an empty service worker for `https://www.saucedemo.com/service-worker.js`, preventing test bleed.
- `cy.sauceInterceptAssets()` intercepts `/static/js/main*.js` and `/static/css/main*.css`, exposing them as `@sauceBundle` and `@sauceStyles` so `cy.loginVisit()` can wait for each resource.
- `cy.sauceInterceptAnalytics()` blocks both `OPTIONS` and `POST` requests to `https://events.backtrace.io/api/*/submit`, removing noise from default 401 responses.
- `cy.saucePrepareNetworkStubs()` groups the three interceptors above and runs automatically during the login visit.
- `cy.sauceBlockFonts()` neutralizes Google Fonts downloads to confirm the UI still lists products when external fonts fail.
- `cy.sauceBreakFirstProductImage()` forces the first catalog image to respond with `404`, helping us stress-test inventory rendering.

Use `cy.loginVisit()` (or any helper that calls it, such as `cy.login`) to ensure the baseline interceptors are active. Scenario-specific helpers like `cy.sauceBlockFonts` or `cy.sauceBreakFirstProductImage` can be executed before `cy.login` inside each spec.

### Resilience scenarios

The spec `cypress/e2e/scenarios/network-resilience.cy.ts` demonstrates several resilience checks built purely with network stubs:

- Deterministic waits for the login bundle (`@sauceBundle`) and stylesheet (`@sauceStyles`).
- Ability to add products to the cart even when the service worker is replaced.
- Suppression of Backtrace analytics noise (both `OPTIONS` and `POST` respond `204`).
- Inventory continuity when Google Fonts returns `204`.
- Product listing stability when the first catalog image returns `404`.
- Graceful handling when fonts and the first image fail at the same time.

## 📝 Test Data

Test data is managed in fixtures:

```json
// cypress/fixtures/users.json
{
  "password": "secret_sauce",
  "usernames": {
    "standard": "standard_user",
    "lockedOut": "locked_out_user",
    "problem": "problem_user",
    "performance": "performance_glitch_user",
    "error": "error_user",
    "visual": "visual_user"
  }
}
```

## 📸 Test Results

### Screenshots

Failed tests automatically capture screenshots saved to:

```
cypress/screenshots/
```

### Videos

Test execution videos are saved to:

```
cypress/videos/
```

### HTML Reports

Cypress generates detailed test reports after each execution, visible in the terminal output.

## 🐛 Troubleshooting

### Cypress Binary Not Found

```bash
npx cypress install --force
```

### Port 3000 Already in Use

Kill the process using port 3000:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### TypeScript Errors

Ensure dependencies are installed:

```bash
npm install
```

### Test Timeouts

Increase timeout in `cypress.config.ts`:

```typescript
defaultCommandTimeout: 15000,
pageLoadTimeout: 45000,
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Follow the Page Object Model pattern
3. Ensure all tests pass: `npm run cypress:run`
4. Run type checking: `npm run type-check`
5. Submit a pull request

## 📚 Best Practices

- ✅ **Test Independence**: Each test runs in isolation
- ✅ **Explicit Waits**: Use Cypress automatic waiting, avoid fixed waits
- ✅ **Clear Test Names**: Descriptive `it()` blocks
- ✅ **Selector Registry**: Keep locators centralized in `cypress/pages`
- ✅ **Custom Commands**: Favor reusable `cy.*` helpers over in-test logic
- ✅ **Data-Driven Testing**: Use fixtures for test data
- ✅ **Proper Cleanup**: Reset state between tests

## 📄 License

ISC

## 👤 Author

**Fred Miramontes**

## 🔗 Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [SauceDemo Application](https://www.saucedemo.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

⭐ If you find this project useful, consider giving it a star on GitHub!
