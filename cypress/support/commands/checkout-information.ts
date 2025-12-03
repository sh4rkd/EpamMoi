import {
  checkoutInformationSelectors,
  CustomerInformation,
} from "../../pages/CheckoutInformationPage";

const fillField = (selector: string, value: string) => {
  const field = cy.get(selector).clear();
  if (value.length > 0) {
    field.type(value);
  }
};

Cypress.Commands.add(
  "checkoutFillInformation",
  (customer: CustomerInformation) => {
    fillField(checkoutInformationSelectors.firstName, customer.firstName);
    fillField(checkoutInformationSelectors.lastName, customer.lastName);
    fillField(checkoutInformationSelectors.postalCode, customer.postalCode);
  }
);

Cypress.Commands.add("checkoutContinue", () => {
  cy.get(checkoutInformationSelectors.continueButton).click();
});

Cypress.Commands.add("checkoutCancel", () => {
  cy.get(checkoutInformationSelectors.cancelButton).click();
});

Cypress.Commands.add("checkoutAssertError", (message: string) => {
  cy.get(checkoutInformationSelectors.errorBanner).should(
    "contain.text",
    message
  );
});

Cypress.Commands.add("checkoutAssertErrorNotShown", () => {
  cy.get(checkoutInformationSelectors.errorBanner, { timeout: 3000 }).should(
    "not.exist"
  );
});

Cypress.Commands.add("checkoutAssertStillOnInformation", () => {
  cy.url().should("include", "checkout-step-one");
});

