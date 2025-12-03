import { cartSelectors } from "../../pages/CartPage";

Cypress.Commands.add("cartAssertItems", (expectedItems: string[]) => {
  expectedItems.forEach((item) => {
    cy.contains(cartSelectors.cartItems, item).should("be.visible");
  });
});

Cypress.Commands.add("cartAssertNumberOfItems", (expected: number) => {
  cy.get(cartSelectors.cartItems).should("have.length", expected);
});

Cypress.Commands.add("cartCheckout", () => {
  cy.get(cartSelectors.checkoutButton).click();
});

Cypress.Commands.add("cartVerifyCartPageIsDisplayed", () => {
  cy.url().should("include", "/cart.html");
  cy.get(".title").should("have.text", "Your Cart");
});

Cypress.Commands.add("cartVerifyCartIsEmpty", () => {
  cy.get(cartSelectors.cartItems).should("not.exist");
});

Cypress.Commands.add("cartVerifyItemInCart", (itemName: string) => {
  cy.contains(cartSelectors.cartItems, itemName).should("be.visible");
});

Cypress.Commands.add("cartVerifyItemNotInCart", (itemName: string) => {
  cy.contains(cartSelectors.cartItems, itemName).should("not.exist");
});

Cypress.Commands.add("cartVerifyCartItemCount", (count: number) => {
  if (count === 0) {
    cy.get(cartSelectors.cartItems).should("not.exist");
  } else {
    cy.get(cartSelectors.cartItems).should("have.length", count);
  }
});

Cypress.Commands.add("cartGetItemPrice", (itemName: string) => {
  return cy
    .contains(cartSelectors.cartItems, itemName)
    .find(cartSelectors.cartItemPrice);
});

Cypress.Commands.add(
  "cartVerifyItemQuantity",
  (itemName: string, quantity: number) => {
    cy.contains(cartSelectors.cartItems, itemName)
      .find(cartSelectors.cartItemQuantity)
      .should("have.text", quantity.toString());
  }
);

Cypress.Commands.add("cartGetItemQuantity", (itemName: string) => {
  return cy
    .contains(cartSelectors.cartItems, itemName)
    .find(cartSelectors.cartItemQuantity);
});

Cypress.Commands.add("cartRemoveItem", (itemName: string) => {
  cy.contains(cartSelectors.cartItems, itemName)
    .find(cartSelectors.removeButton)
    .click();
});

Cypress.Commands.add("cartContinueShopping", () => {
  cy.get(cartSelectors.continueShoppingButton).click();
});
