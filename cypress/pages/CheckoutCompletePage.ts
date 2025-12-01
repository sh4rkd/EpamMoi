class CheckoutCompletePage {
  private selectors = {
    title: ".complete-header",
    message: ".complete-text",
    backHomeButton: "[data-test='back-to-products']"
  };

  assertSuccessMessage() {
    cy.get(this.selectors.title).should("contain.text", "Thank you");
    cy.get(this.selectors.message).should(
      "contain.text",
      "Your order has been dispatched"
    );
  }

  backToProducts() {
    cy.get(this.selectors.backHomeButton).click();
  }
}

const checkoutCompletePage = new CheckoutCompletePage();
export default checkoutCompletePage;


