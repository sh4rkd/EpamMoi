import loginPage from "../pages/LoginPage";
import { users } from "../support/data/users";

describe("Locked Out User Tests", () => {
  const username = users.usernames.lockedOut;
  const password = users.password;

  beforeEach(function () {
    const testTitle = this.currentTest?.title ?? "Untitled scenario";
    cy.task("log", `Starting scenario: ${testTitle}`);
    loginPage.visit();
  });

  describe("Authentication", () => {
    it("blocks the locked out user and displays error message", () => {
      loginPage.login(username, password);
      loginPage.assertErrorMessage("Sorry, this user has been locked out.");
      cy.url().should("not.include", "/inventory.html");
    });

    it("prevents navigation to inventory page", () => {
      loginPage.login(username, password);
      loginPage.assertErrorMessage("Sorry, this user has been locked out.");
      // Intentar navegar directamente debería fallar
      cy.visit("/inventory.html", { failOnStatusCode: false });
      cy.url().should("not.include", "/inventory.html");
    });

    it("allows closing error message", () => {
      loginPage.login(username, password);
      loginPage.assertErrorMessage("Sorry, this user has been locked out.");
      // El error debería poder cerrarse (si el LoginPage tiene el método)
      cy.get('[data-test="error-button"]').should("be.visible").click();
      cy.get('[data-test="error"]').should("not.exist");
    });

    it("maintains login form state after failed attempt", () => {
      loginPage.typeUsername(username);
      loginPage.typePassword(password);
      loginPage.submit();
      loginPage.assertErrorMessage("Sorry, this user has been locked out.");
      // El formulario debería mantener el username ingresado
      cy.get('[data-test="username"]').should("have.value", username);
    });
  });
});
