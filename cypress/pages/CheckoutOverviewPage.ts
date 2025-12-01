class CheckoutOverviewPage {
  private selectors = {
    inventoryItems: ".cart_item",
    finishButton: "[data-test='finish']",
    cancelButton: "[data-test='cancel']",
    subtotal: ".summary_subtotal_label",
    tax: ".summary_tax_label",
    total: ".summary_total_label",
    paymentInfo: ".summary_info_label",
    shippingInfo: ".summary_info_label"
  };

  assertItems(expectedItems: string[]) {
    expectedItems.forEach(item => {
      cy.contains(this.selectors.inventoryItems, item).should("be.visible");
    });
  }

  assertSubtotalIsGreaterThan(minValue: number) {
    cy.get(this.selectors.subtotal)
      .invoke("text")
      .then(raw => {
        const amount = Number(raw.replace(/[^\d.]/g, ""));
        expect(amount).to.be.greaterThan(minValue);
      });
  }

  finish() {
    cy.get(this.selectors.finishButton).click();
  }

  verifyCheckoutStepTwoIsDisplayed() {
    cy.url().should("include", "/checkout-step-two.html");
  }

  verifyItemInSummary(itemName: string) {
    cy.contains(this.selectors.inventoryItems, itemName).should("be.visible");
  }

  getSummaryItemCount() {
    return cy.get(this.selectors.inventoryItems).then($items => $items.length);
  }

  verifyPaymentInformationIsDisplayed() {
    cy.contains("Payment Information").should("be.visible");
  }

  verifyShippingInformationIsDisplayed() {
    cy.contains("Shipping Information").should("be.visible");
  }

  getItemTotal() {
    return cy.get(this.selectors.subtotal);
  }

  getTax() {
    return cy.get(this.selectors.tax);
  }

  getTotal() {
    return cy.get(this.selectors.total);
  }
}

const checkoutOverviewPage = new CheckoutOverviewPage();
export default checkoutOverviewPage;


