import "./commands";

Cypress.on("uncaught:exception", () => {
  return false;
});

beforeEach(function () {
  const testTitle = this.currentTest?.fullTitle() ?? "Untitled scenario";
  cy.task("log", `Starting scenario: ${testTitle}`);
});
