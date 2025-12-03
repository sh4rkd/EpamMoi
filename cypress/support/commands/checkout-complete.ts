import { checkoutCompleteSelectors } from "../../pages/CheckoutCompletePage";

Cypress.Commands.add("checkoutAssertSuccessMessage", () => {
  cy.get(checkoutCompleteSelectors.title).should("contain.text", "Thank you");
  cy.get(checkoutCompleteSelectors.message).should(
    "contain.text",
    "Your order has been dispatched"
  );
});

Cypress.Commands.add("checkoutBackToProducts", () => {
  cy.get(checkoutCompleteSelectors.backHomeButton).click();
});

