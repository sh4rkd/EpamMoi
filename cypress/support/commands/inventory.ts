import {
  inventoryImageExclusionWords,
  InventoryProduct,
  inventorySelectors,
  InventorySortOption,
  SortDirection,
} from "../../pages/InventoryPage";

const normalizeProductWords = (productName: string) =>
  productName
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[().]/g, ""))
    .filter(
      (word) => word.length >= 3 && !inventoryImageExclusionWords.includes(word)
    );

Cypress.Commands.add("inventoryWaitForLoad", () => {
  cy.location("pathname", { timeout: 20000 }).should("include", "inventory");
  cy.get(inventorySelectors.pageTitle).should("have.text", "Products");
});

Cypress.Commands.add("inventoryAddProduct", (productName: string) => {
  cy.contains(inventorySelectors.inventoryItems, productName)
    .find("button")
    .click();
});

Cypress.Commands.add("inventoryRemoveProduct", (productName: string) => {
  cy.contains(inventorySelectors.inventoryItems, productName)
    .find("button")
    .should("contain.text", "Remove")
    .click();
});

Cypress.Commands.add("inventoryOpenProductDetails", (productName: string) => {
  cy.contains(inventorySelectors.inventoryItemName, productName).click();
});

Cypress.Commands.add("inventoryOpenCart", () => {
  cy.get(inventorySelectors.cartLink).click();
});

Cypress.Commands.add("inventorySort", (option: InventorySortOption) => {
  let alertMessage: string | null = null;

  cy.once("window:alert", (message) => {
    alertMessage = message;
  });

  cy.get(inventorySelectors.sortDropdown, { timeout: 20000 })
    .should("be.visible")
    .select(option)
    .then(() => {
      if (alertMessage) {
        throw new Error(
          `Sorting "${option}" triggered a browser alert: ${alertMessage}`
        );
      }
    });

  cy.get(inventorySelectors.inventoryItemName).should(
    "have.length.greaterThan",
    0
  );
});

Cypress.Commands.add(
  "inventoryAssertProductsSortedByName",
  (direction: SortDirection) => {
    cy.get(inventorySelectors.inventoryItemName)
      .then(($items) => {
        const names = [...$items].map((item) => item.textContent?.trim() ?? "");
        return names;
      })
      .then((names) => {
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        if (direction === "desc") {
          sorted.reverse();
        }
        expect(names).to.deep.equal(sorted);
      });
  }
);

Cypress.Commands.add(
  "inventoryAssertProductsSortedByPrice",
  (direction: SortDirection) => {
    cy.get(inventorySelectors.inventoryItemPrice)
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
        expect(prices).to.deep.equal(sorted);
      });
  }
);

Cypress.Commands.add(
  "inventoryAssertFirstProductName",
  (expectedName: string) => {
    cy.get(inventorySelectors.inventoryItemName)
      .first()
      .should("have.text", expectedName);
  }
);

Cypress.Commands.add("inventoryAssertInventoryCount", (expected: number) => {
  cy.get(inventorySelectors.inventoryItems).should("have.length", expected);
});

Cypress.Commands.add("inventoryAssertCartBadgeCount", (expected: number) => {
  cy.get(inventorySelectors.cartBadge).should("have.text", String(expected));
});

Cypress.Commands.add("inventoryAssertCartBadgeAtLeast", (minAmount: number) => {
  cy.get(inventorySelectors.cartBadge)
    .invoke("text")
    .then((value) => {
      const parsed = Number(value);
      expect(parsed).to.be.gte(minAmount);
    });
});

Cypress.Commands.add("inventoryAssertCartBadgeCleared", () => {
  cy.get(inventorySelectors.cartBadge).should("not.exist");
});

Cypress.Commands.add("inventoryResetAppState", () => {
  cy.get(inventorySelectors.menuButton).click();
  cy.get(inventorySelectors.resetLink).click();
  cy.get(inventorySelectors.closeMenuButton).click();
});

Cypress.Commands.add("inventoryVerifyItemIsInCart", (productName: string) => {
  cy.contains(inventorySelectors.inventoryItems, productName)
    .find("button")
    .should("contain.text", "Remove");
});

Cypress.Commands.add(
  "inventoryVerifyItemIsNotInCart",
  (productName: string) => {
    cy.contains(inventorySelectors.inventoryItems, productName)
      .find("button")
      .should("contain.text", "Add to cart");
  }
);

Cypress.Commands.add("inventoryVerifyDefaultSort", () => {
  cy.get(inventorySelectors.sortDropdown).should("have.value", "az");
});

Cypress.Commands.add("inventoryAssertProductImagesMatchNames", () => {
  cy.get(inventorySelectors.inventoryItems).each(($item) => {
    cy.wrap($item)
      .find(inventorySelectors.inventoryItemName)
      .invoke("text")
      .then((rawName) => {
        const productName = rawName.trim();

        expect(productName).to.be.a("string").and.not.be.empty;

        const words = normalizeProductWords(productName);

        cy.wrap($item)
          .find(inventorySelectors.inventoryItemImage)
          .should("be.visible")
          .and("have.attr", "alt", productName)
          .invoke("attr", "src")
          .then((src) => {
            expect(src).to.be.a("string").and.not.be.empty;

            if (!src) {
              throw new Error(
                `image for ${productName} does not have a valid src`
              );
            }

            expect(src).to.not.include("sl-404");

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
});

Cypress.Commands.add("inventoryGetAllProducts", () => {
  return cy.get(inventorySelectors.inventoryItems).then(($items) => {
    const products: InventoryProduct[] = [];
    $items.each((_, element) => {
      const $item = Cypress.$(element);
      const name = $item
        .find(inventorySelectors.inventoryItemName)
        .text()
        .trim();
      const price = $item
        .find(inventorySelectors.inventoryItemPrice)
        .text()
        .trim();
      products.push({ name, price });
    });
    return products;
  });
});
