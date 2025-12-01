class InventoryPage {
  private selectors = {
    pageTitle: ".title",
    inventoryItems: ".inventory_item",
    inventoryItemName: ".inventory_item_name",
    inventoryItemPrice: ".inventory_item_price",
    inventoryItemImage: ".inventory_item_img img",
    cartBadge: ".shopping_cart_badge",
    cartLink: ".shopping_cart_link",
    sortDropdown: "[data-test='product-sort-container']",
    menuButton: "#react-burger-menu-btn",
    closeMenuButton: "#react-burger-cross-btn",
    resetLink: "#reset_sidebar_link",
  };

  waitForLoad() {
    cy.location("pathname", { timeout: 20000 }).should("include", "inventory");
    cy.get(this.selectors.pageTitle).should("have.text", "Products");
  }

  addProductToCart(productName: string) {
    cy.contains(this.selectors.inventoryItems, productName)
      .find("button")
      .click();
  }

  openProductDetails(productName: string) {
    cy.contains(this.selectors.inventoryItemName, productName).click();
  }

  openCart() {
    cy.get(this.selectors.cartLink).click();
  }

  assertCartBadgeCount(expected: number) {
    cy.get(this.selectors.cartBadge).should("have.text", String(expected));
  }

  assertCartBadgeAtLeast(minAmount: number) {
    cy.get(this.selectors.cartBadge)
      .invoke("text")
      .then((value) => {
        const parsed = Number(value);
        expect(
          parsed,
          "cart badge should show at least requested items"
        ).to.be.gte(minAmount);
      });
  }

  assertCartBadgeCleared() {
    cy.get(this.selectors.cartBadge).should("not.exist");
  }

  assertInventoryCount(expected: number) {
    cy.get(this.selectors.inventoryItems).should("have.length", expected);
  }

  resetAppState() {
    cy.get(this.selectors.menuButton).click();
    cy.get(this.selectors.resetLink).click();
    cy.get(this.selectors.closeMenuButton).click();
  }

  sortBy(option: "az" | "za" | "lohi" | "hilo") {
    let alertMessage: string | null = null;

    cy.on("window:alert", (msg) => {
      alertMessage = msg;
    });

    cy.get(this.selectors.sortDropdown, { timeout: 20000 })
      .should("be.visible")
      .select(option)
      .then(() => {
        if (alertMessage) {
          throw new Error(
            `La acción de ordenamiento "${option}" generó una alerta del navegador: ${alertMessage}`
          );
        }
      });

    cy.get(this.selectors.inventoryItemName).should(
      "have.length.greaterThan",
      0
    );
  }

  assertFirstProductName(expectedName: string) {
    cy.get(this.selectors.inventoryItemName)
      .first()
      .should("have.text", expectedName);
  }

  assertProductsSortedByName(direction: "asc" | "desc") {
    cy.get(this.selectors.inventoryItemName)
      .then(($items) => {
        const names = [...$items].map((item) => item.textContent?.trim() ?? "");
        return names;
      })
      .then((names) => {
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        if (direction === "desc") {
          sorted.reverse();
        }
        expect(
          names,
          `list should be sorted ${direction === "asc" ? "A→Z" : "Z→A"}`
        ).to.deep.equal(sorted);
      });
  }

  assertProductsSortedByPrice(direction: "asc" | "desc") {
    cy.get(this.selectors.inventoryItemPrice)
      .then(($prices) => {
        const prices = [...$prices].map((item) => {
          const text = item.textContent?.trim() ?? "";
          return parseFloat(text.replace("$", ""));
        });
        return prices;
      })
      .then((prices) => {
        const sorted = [...prices].sort((a, b) => a - b);
        if (direction === "desc") {
          sorted.reverse();
        }
        expect(
          prices,
          `prices should be sorted ${direction === "asc" ? "low→high" : "high→low"}`
        ).to.deep.equal(sorted);
      });
  }

  removeProductFromCart(productName: string) {
    cy.contains(this.selectors.inventoryItems, productName)
      .find("button")
      .should("contain.text", "Remove")
      .click();
  }

  verifyItemIsInCart(productName: string) {
    cy.contains(this.selectors.inventoryItems, productName)
      .find("button")
      .should("contain.text", "Remove");
  }

  verifyItemIsNotInCart(productName: string) {
    cy.contains(this.selectors.inventoryItems, productName)
      .find("button")
      .should("contain.text", "Add to cart");
  }

  verifyDefaultSort() {
    cy.get(this.selectors.sortDropdown).should("have.value", "az");
  }

  assertProductImagesMatchNames() {
    cy.get(this.selectors.inventoryItems).each(($item) => {
      cy.wrap($item)
        .find(this.selectors.inventoryItemName)
        .invoke("text")
        .then((rawName) => {
          const productName = rawName.trim();

          expect(
            productName,
            "each inventory product must display a name"
          ).to.be.a("string").and.not.be.empty;

          const allWords = productName
            .toLowerCase()
            .split(/\s+/)
            .map((word) => word.replace(/[().]/g, ""))
            .filter((word) => word.length >= 3);

          const excludedWords = ["labs", "the", "all", "things"];
          const words = allWords.filter(
            (word) => !excludedWords.includes(word)
          );

          cy.wrap($item)
            .find(this.selectors.inventoryItemImage)
            .should("be.visible")
            .and("have.attr", "alt", productName)
            .invoke("attr", "src")
            .then((src) => {
              expect(
                src,
                `image for ${productName} must have a valid src`
              ).to.be.a("string").and.not.be.empty;

              if (!src) {
                throw new Error(
                  `image for ${productName} does not have a valid src`
                );
              }

              expect(
                src,
                `image for ${productName} must not be a 404`
              ).to.not.include("sl-404");

              const srcLower = src.toLowerCase();
              const hasMatchingWord = words.some((word) =>
                srcLower.includes(word)
              );

              expect(
                hasMatchingWord,
                `image src for "${productName}" must contain at least one word from the title. Src: ${src}, Words searched: ${words.join(
                  ", "
                )}`
              ).to.be.true;
            });
        });
    });
  }

  getAllProducts(): Cypress.Chainable<Array<{ name: string; price: string }>> {
    return cy.get(this.selectors.inventoryItems).then(($items) => {
      const products: Array<{ name: string; price: string }> = [];
      $items.each((_, element) => {
        const $item = Cypress.$(element);
        const name = $item.find(this.selectors.inventoryItemName).text().trim();
        const price = $item
          .find(this.selectors.inventoryItemPrice)
          .text()
          .trim();
        products.push({ name, price });
      });
      return products;
    });
  }
}

const inventoryPage = new InventoryPage();
export default inventoryPage;
