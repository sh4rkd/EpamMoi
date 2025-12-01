type CustomerInformation = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

class CheckoutInformationPage {
  private selectors = {
    firstName: "[data-test='firstName']",
    lastName: "[data-test='lastName']",
    postalCode: "[data-test='postalCode']",
    continueButton: "[data-test='continue']",
    errorBanner: "[data-test='error']"
  };

  fillCustomerInformation(customer: CustomerInformation) {
    this.fillField(this.selectors.firstName, customer.firstName);
    this.fillField(this.selectors.lastName, customer.lastName);
    this.fillField(this.selectors.postalCode, customer.postalCode);
  }

  private fillField(selector: string, value: string) {
    const field = cy.get(selector).clear();
    if (value.length > 0) {
      field.type(value);
    }
  }

  continue() {
    cy.get(this.selectors.continueButton).click();
  }

  cancel() {
    cy.get("[data-test='cancel']").click();
  }

  assertError(message: string) {
    cy.get(this.selectors.errorBanner).should("contain.text", message);
  }

  // Para error_user: valida que el mensaje de error NO aparece (comportamiento esperado)
  assertErrorNotShown() {
    cy.get(this.selectors.errorBanner, { timeout: 3000 }).should("not.exist");
  }

  // Valida que permanecemos en la página de checkout (no avanzamos)
  assertStillOnCheckoutPage() {
    cy.url().should("include", "checkout-step-one");
  }
}

const checkoutInformationPage = new CheckoutInformationPage();
export default checkoutInformationPage;
export type { CustomerInformation };

