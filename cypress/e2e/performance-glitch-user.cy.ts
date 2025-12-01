import cartPage from "../pages/CartPage";
import inventoryPage from "../pages/InventoryPage";
import { users } from "../support/data/users";

describe("Performance Glitch User Tests", () => {
  const username = users.usernames.performance;
  const password = users.password;

  const loginAndOpenInventory = () => {
    cy.login(username, password);
    inventoryPage.waitForLoad();
  };

  beforeEach(function () {
    const testTitle = this.currentTest?.title ?? "Untitled scenario";
    cy.task("log", `Starting scenario: ${testTitle}`);
  });

  describe("Authentication", () => {
    it("allows login with performance delays", () => {
      cy.login(username, password);
      // El performance_glitch_user tiene delays, pero debería cargar eventualmente
      inventoryPage.waitForLoad();
      inventoryPage.getAllProducts().then((products) => {
        expect(products.length).to.be.greaterThan(0);
        inventoryPage.assertInventoryCount(products.length);
      });
    });
  });

  describe("Inventory", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("displays all available products", () => {
      inventoryPage.getAllProducts().then((products) => {
        expect(products.length).to.be.greaterThan(0);
        inventoryPage.assertInventoryCount(products.length);
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
      inventoryPage.verifyDefaultSort();
      inventoryPage.assertProductsSortedByName("asc");
    });

    it("sorts products from A to Z with delays", () => {
      inventoryPage.sortBy("az");
      inventoryPage.assertProductsSortedByName("asc");
    });

    it("sorts products from Z to A with delays", () => {
      inventoryPage.sortBy("za");
      inventoryPage.assertProductsSortedByName("desc");
    });

    it("sorts products by price low to high with delays", () => {
      inventoryPage.sortBy("lohi");
      inventoryPage.assertProductsSortedByPrice("asc");
    });

    it("sorts products by price high to low with delays", () => {
      inventoryPage.sortBy("hilo");
      inventoryPage.assertProductsSortedByPrice("desc");
    });

    it("keeps sorting stable despite performance glitches", () => {
      inventoryPage.getAllProducts().then((products) => {
        const sortedProducts = [...products]
          .map((p) => p.name)
          .sort((a, b) => b.localeCompare(a));
        const expectedFirstProduct = sortedProducts[0];

        inventoryPage.sortBy("za");
        inventoryPage.assertFirstProductName(expectedFirstProduct);
      });
    });

    it("maintains sort order after adding item to cart", () => {
      inventoryPage.sortBy("hilo");
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.assertProductsSortedByPrice("desc");
      });
    });

    it("displays all 6 inventory items regardless of sort order", () => {
      const expectedItemCount = 6;
      inventoryPage.assertInventoryCount(expectedItemCount);

      inventoryPage.sortBy("za");
      inventoryPage.assertInventoryCount(expectedItemCount);

      inventoryPage.sortBy("lohi");
      inventoryPage.assertInventoryCount(expectedItemCount);

      inventoryPage.sortBy("hilo");
      inventoryPage.assertInventoryCount(expectedItemCount);
    });
  });

  describe("Cart Actions", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("adds single item to cart despite slow responses", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        cy.wait(1000);
        inventoryPage.verifyItemIsInCart(productName);
        inventoryPage.assertCartBadgeAtLeast(1);
      });
    });

    it("adds multiple items to cart despite slow responses", () => {
      inventoryPage.getAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) => {
          inventoryPage.addProductToCart(item);
          cy.wait(500);
        });
        inventoryPage.assertCartBadgeAtLeast(3);
      });
    });

    it("navigates to cart page when clicking cart icon", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        cy.wait(1000);
        inventoryPage.openCart();
        cartPage.verifyCartPageIsDisplayed();
      });
    });
  });

  describe("Cart Validation", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("displays correct item in cart after adding from inventory", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        cy.wait(1000);
        inventoryPage.openCart();

        cartPage.verifyCartPageIsDisplayed();
        cartPage.verifyCartItemCount(1);
        cartPage.verifyItemInCart(productName);
      });
    });

    it("displays correct item prices in cart", () => {
      inventoryPage.getAllProducts().then((products) => {
        const product = products[0];
        inventoryPage.addProductToCart(product.name);
        cy.wait(1000);
        inventoryPage.openCart();

        cartPage.verifyCartPageIsDisplayed();
        cartPage.getItemPrice(product.name).should("contain.text", "$");
      });
    });
  });
});


