class CartPage {
  private selectors = {
    cartItems: ".cart_item",
    checkoutButton: "[data-test='checkout']",
    continueShoppingButton: "[data-test='continue-shopping']",
    cartItemName: ".inventory_item_name",
    cartItemPrice: ".inventory_item_price",
    cartItemQuantity: ".cart_quantity",
    removeButton: "button[class*='cart_button']"
  };

  assertItems(expectedItems: string[]) {
    expectedItems.forEach(item => {
      cy.contains(this.selectors.cartItems, item).should("be.visible");
    });
  }

  assertNumberOfItems(expected: number) {
    cy.get(this.selectors.cartItems).should("have.length", expected);
  }

  checkout() {
    cy.get(this.selectors.checkoutButton).click();
  }

  verifyCartPageIsDisplayed() {
    cy.url().should("include", "/cart.html");
    cy.get(".title").should("have.text", "Your Cart");
  }

  verifyCartIsEmpty() {
    cy.get(this.selectors.cartItems).should("not.exist");
  }

  verifyItemInCart(itemName: string) {
    cy.contains(this.selectors.cartItems, itemName).should("be.visible");
  }

  verifyItemNotInCart(itemName: string) {
    cy.contains(this.selectors.cartItems, itemName).should("not.exist");
  }

  verifyCartItemCount(count: number) {
    if (count === 0) {
      cy.get(this.selectors.cartItems).should("not.exist");
    } else {
      cy.get(this.selectors.cartItems).should("have.length", count);
    }
  }

  getItemPrice(itemName: string) {
    return cy.contains(this.selectors.cartItems, itemName)
      .find(this.selectors.cartItemPrice);
  }

  verifyItemQuantity(itemName: string, quantity: number) {
    cy.contains(this.selectors.cartItems, itemName)
      .find(this.selectors.cartItemQuantity)
      .should("have.text", quantity.toString());
  }

  getItemQuantity(itemName: string) {
    return cy.contains(this.selectors.cartItems, itemName)
      .find(this.selectors.cartItemQuantity);
  }

  removeItem(itemName: string) {
    cy.contains(this.selectors.cartItems, itemName)
      .find(this.selectors.removeButton)
      .click();
  }

  continueShopping() {
    cy.get(this.selectors.continueShoppingButton).click();
  }
}

const cartPage = new CartPage();
export default cartPage;


