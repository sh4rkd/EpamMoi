import loginPage from "../pages/LoginPage";

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (username: string, password = "secret_sauce") => {
  loginPage.login(username, password);
});

export {};


