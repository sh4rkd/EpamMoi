import { loginSelectors } from "../../pages/LoginPage";

Cypress.Commands.add("loginVisit", () => {
  cy.visit("/");
});

Cypress.Commands.add("loginTypeUsername", (value: string) => {
  cy.get(loginSelectors.username).clear().type(value);
});

Cypress.Commands.add("loginTypePassword", (value: string) => {
  cy.get(loginSelectors.password).clear().type(value);
});

Cypress.Commands.add("loginSubmit", () => {
  cy.get(loginSelectors.submit).click();
});

Cypress.Commands.add("loginAssertErrorMessage", (expected: string) => {
  cy.get(loginSelectors.error).should("contain.text", expected);
});

Cypress.Commands.add("loginCloseErrorMessage", () => {
  cy.get(loginSelectors.errorButton).should("be.visible").click();
});

Cypress.Commands.add("login", (username: string, password = "secret_sauce") => {
  cy.loginVisit();
  cy.loginTypeUsername(username);
  cy.loginTypePassword(password);
  cy.loginSubmit();
});

