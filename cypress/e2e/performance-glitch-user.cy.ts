import { users } from "../support/data/users";

describe("Performance Glitch User Tests", () => {
  const username = users.usernames.performance;
  const password = users.password;

  const loginAndOpenInventory = () => {
    cy.login(username, password);
    cy.inventoryWaitForLoad();
  };

  describe("Authentication", () => {
    it("allows login with performance delays", () => {
      cy.login(username, password);
      // El performance_glitch_user tiene delays, pero debería cargar eventualmente
      cy.inventoryWaitForLoad();
      cy.inventoryGetAllProducts().then((products) => {
        expect(products.length).to.be.greaterThan(0);
        cy.inventoryAssertInventoryCount(products.length);
      });
    });
  });

  describe("Inventory", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("displays all available products", () => {
      cy.inventoryGetAllProducts().then((products) => {
        expect(products.length).to.be.greaterThan(0);
        cy.inventoryAssertInventoryCount(products.length);
        products.forEach((product) => {
          cy.contains(".inventory_item_name", product.name).should(
            "be.visible"
          );
          expect(product.name).to.be.a("string").and.not.be.empty;
          expect(product.price).to.be.a("string").and.not.be.empty;
        });
      });
    });

    it("sorts products A to Z by default", () => {
      cy.inventoryVerifyDefaultSort();
      cy.inventoryAssertProductsSortedByName("asc");
    });

    it("sorts products from A to Z with delays", () => {
      cy.inventorySort("az");
      cy.inventoryAssertProductsSortedByName("asc");
    });

    it("sorts products from Z to A with delays", () => {
      cy.inventorySort("za");
      cy.inventoryAssertProductsSortedByName("desc");
    });

    it("sorts products by price low to high with delays", () => {
      cy.inventorySort("lohi");
      cy.inventoryAssertProductsSortedByPrice("asc");
    });

    it("sorts products by price high to low with delays", () => {
      cy.inventorySort("hilo");
      cy.inventoryAssertProductsSortedByPrice("desc");
    });

    it("keeps sorting stable despite performance glitches", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const sortedProducts = [...products]
          .map((p) => p.name)
          .sort((a, b) => b.localeCompare(a));
        const expectedFirstProduct = sortedProducts[0];

        cy.inventorySort("za");
        cy.inventoryAssertFirstProductName(expectedFirstProduct);
      });
    });

    it("maintains sort order after adding item to cart", () => {
      cy.inventorySort("hilo");
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryAssertProductsSortedByPrice("desc");
      });
    });

    it("displays all 6 inventory items regardless of sort order", () => {
      const expectedItemCount = 6;
      cy.inventoryAssertInventoryCount(expectedItemCount);

      cy.inventorySort("za");
      cy.inventoryAssertInventoryCount(expectedItemCount);

      cy.inventorySort("lohi");
      cy.inventoryAssertInventoryCount(expectedItemCount);

      cy.inventorySort("hilo");
      cy.inventoryAssertInventoryCount(expectedItemCount);
    });
  });

  describe("Cart Actions", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("adds single item to cart despite slow responses", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.wait(1000);
        cy.inventoryVerifyItemIsInCart(productName);
        cy.inventoryAssertCartBadgeAtLeast(1);
      });
    });

    it("adds multiple items to cart despite slow responses", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) => {
          cy.inventoryAddProduct(item);
          cy.wait(500);
        });
        cy.inventoryAssertCartBadgeAtLeast(3);
      });
    });

    it("navigates to cart page when clicking cart icon", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.wait(1000);
        cy.inventoryOpenCart();
        cy.cartVerifyCartPageIsDisplayed();
      });
    });
  });

  describe("Cart Validation", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("displays correct item in cart after adding from inventory", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.wait(1000);
        cy.inventoryOpenCart();

        cy.cartVerifyCartPageIsDisplayed();
        cy.cartVerifyCartItemCount(1);
        cy.cartVerifyItemInCart(productName);
      });
    });

    it("displays correct item prices in cart", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const product = products[0];
        cy.inventoryAddProduct(product.name);
        cy.wait(1000);
        cy.inventoryOpenCart();

        cy.cartVerifyCartPageIsDisplayed();
        cy.cartGetItemPrice(product.name).should("contain.text", "$");
      });
    });
  });
});


