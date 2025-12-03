import { productDetailsSelectors } from "../../pages/ProductDetailsPage";

Cypress.Commands.add("productDetailsBackToProducts", () => {
  cy.get(productDetailsSelectors.backButton).click();
});

