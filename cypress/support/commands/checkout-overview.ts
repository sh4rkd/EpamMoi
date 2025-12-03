import { checkoutOverviewSelectors } from "../../pages/CheckoutOverviewPage";

Cypress.Commands.add(
  "checkoutOverviewAssertItems",
  (expectedItems: string[]) => {
    expectedItems.forEach((item) => {
      cy.contains(checkoutOverviewSelectors.inventoryItems, item).should(
        "be.visible"
      );
    });
  }
);

Cypress.Commands.add(
  "checkoutOverviewAssertSubtotalGreaterThan",
  (minValue: number) => {
    cy.get(checkoutOverviewSelectors.subtotal)
      .invoke("text")
      .then((raw) => {
        const amount = Number(raw.replace(/[^\d.]/g, ""));
        expect(amount).to.be.greaterThan(minValue);
      });
  }
);

Cypress.Commands.add("checkoutOverviewFinish", () => {
  cy.get(checkoutOverviewSelectors.finishButton).click();
});

Cypress.Commands.add("checkoutOverviewVerifyStepTwo", () => {
  cy.url().should("include", "/checkout-step-two.html");
});

Cypress.Commands.add(
  "checkoutOverviewVerifyItemInSummary",
  (itemName: string) => {
    cy.contains(checkoutOverviewSelectors.inventoryItems, itemName).should(
      "be.visible"
    );
  }
);

Cypress.Commands.add("checkoutOverviewGetSummaryItemCount", () => {
  return cy
    .get(checkoutOverviewSelectors.inventoryItems)
    .then(($items) => $items.length);
});

Cypress.Commands.add("checkoutOverviewVerifyPaymentInfo", () => {
  cy.contains("Payment Information").should("be.visible");
});

Cypress.Commands.add("checkoutOverviewVerifyShippingInfo", () => {
  cy.contains("Shipping Information").should("be.visible");
});

Cypress.Commands.add("checkoutOverviewGetItemTotal", () => {
  return cy.get(checkoutOverviewSelectors.subtotal);
});

Cypress.Commands.add("checkoutOverviewGetTax", () => {
  return cy.get(checkoutOverviewSelectors.tax);
});

Cypress.Commands.add("checkoutOverviewGetTotal", () => {
  return cy.get(checkoutOverviewSelectors.total);
});
