import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 800,
  defaultCommandTimeout: 8000,
  pageLoadTimeout: 60000,
  retries: {
    runMode: 1,
    openMode: 0
  },
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on) {
      on("task", {
        log(message: string) {
          console.log(message);
          return null;
        }
      });
    }
  },
  env: {
    usersFixture: "users"
  }
});


