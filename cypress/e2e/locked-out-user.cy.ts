import { users } from "../support/data/users";

describe("Locked Out User Tests", () => {
  const username = users.usernames.lockedOut;
  const password = users.password;

  beforeEach(() => {
    cy.loginVisit();
  });

  describe("Authentication", () => {
    it("blocks the locked out user and displays error message", () => {
      cy.login(username, password);
      cy.loginAssertErrorMessage("Sorry, this user has been locked out.");
      cy.url().should("not.include", "/inventory.html");
    });

    it("prevents navigation to inventory page", () => {
      cy.login(username, password);
      cy.loginAssertErrorMessage("Sorry, this user has been locked out.");
      // Intentar navegar directamente debería fallar
      cy.visit("/inventory.html", { failOnStatusCode: false });
      cy.url().should("not.include", "/inventory.html");
    });

    it("allows closing error message", () => {
      cy.login(username, password);
      cy.loginAssertErrorMessage("Sorry, this user has been locked out.");
      cy.loginCloseErrorMessage();
      cy.get('[data-test="error"]').should("not.exist");
    });

    it("maintains login form state after failed attempt", () => {
      cy.loginTypeUsername(username);
      cy.loginTypePassword(password);
      cy.loginSubmit();
      cy.loginAssertErrorMessage("Sorry, this user has been locked out.");
      // El formulario debería mantener el username ingresado
      cy.get('[data-test="username"]').should("have.value", username);
    });
  });
});

