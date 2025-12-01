import cartPage from "../pages/CartPage";
import inventoryPage from "../pages/InventoryPage";
import { users } from "../support/data/users";

describe("Problem User Tests", () => {
  const username = users.usernames.problem;
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
    it("allows login and displays inventory", () => {
      cy.login(username, password);
      inventoryPage.waitForLoad();
      inventoryPage.getAllProducts().then((products) => {
        expect(products.length).to.be.greaterThan(0);
        inventoryPage.assertInventoryCount(products.length);
      });
    });
  });

  describe("Cart Issues", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("lets the problem user recover by resetting the cart", () => {
      inventoryPage.getAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) =>
          inventoryPage.addProductToCart(item)
        );
        inventoryPage.assertCartBadgeAtLeast(1);

        inventoryPage.resetAppState();
        inventoryPage.assertCartBadgeCleared();
      });
    });

    it("can add items to cart despite problems", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.assertCartBadgeAtLeast(1);
      });
    });

    it("can navigate to cart page", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.assertNumberOfItems(1);
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

    it("sorts products from A to Z", () => {
      inventoryPage.sortBy("az");
      inventoryPage.assertProductsSortedByName("asc");
    });

    it("sorts products from Z to A", () => {
      inventoryPage.sortBy("za");
      inventoryPage.assertProductsSortedByName("desc");
    });

    it("sorts products by price low to high", () => {
      inventoryPage.sortBy("lohi");
      inventoryPage.assertProductsSortedByPrice("asc");
    });

    it("sorts products by price high to low", () => {
      inventoryPage.sortBy("hilo");
      inventoryPage.assertProductsSortedByPrice("desc");
    });

    it("displays products even with potential image issues", () => {
      inventoryPage.getAllProducts().then((products) => {
        expect(products.length).to.be.greaterThan(0);
        // El problem_user puede tener imágenes incorrectas, pero los productos se muestran
        products.forEach((product) => {
          cy.contains(".inventory_item_name", product.name).should(
            "be.visible"
          );
        });
      });
    });
  });

  describe("Cart Actions", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("adds multiple items to cart", () => {
      inventoryPage.getAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) => {
          inventoryPage.addProductToCart(item);
        });
        inventoryPage.assertCartBadgeAtLeast(3);
      });
    });

    it("removes item from cart on inventory page", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.assertCartBadgeAtLeast(1);

        inventoryPage.removeProductFromCart(productName);
        inventoryPage.verifyItemIsNotInCart(productName);
      });
    });

    it("updates cart badge when adding and removing items", () => {
      inventoryPage.getAllProducts().then((products) => {
        const product1 = products[0].name;
        const product2 = products[1].name;

        inventoryPage.addProductToCart(product1);
        inventoryPage.assertCartBadgeAtLeast(1);

        inventoryPage.addProductToCart(product2);
        inventoryPage.assertCartBadgeAtLeast(2);

        inventoryPage.removeProductFromCart(product1);
        inventoryPage.assertCartBadgeAtLeast(1);
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
        inventoryPage.openCart();

        cartPage.verifyCartPageIsDisplayed();
        cartPage.verifyCartItemCount(1);
        cartPage.verifyItemInCart(productName);
      });
    });

    it("displays multiple items with correct details", () => {
      inventoryPage.getAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          inventoryPage.addProductToCart(item);
        });
        inventoryPage.openCart();

        cartPage.verifyCartPageIsDisplayed();
        cartPage.verifyCartItemCount(2);
        selectedProducts.forEach((item) => {
          cartPage.verifyItemInCart(item);
        });
      });
    });

    it("removes item from cart", () => {
      inventoryPage.getAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          inventoryPage.addProductToCart(item);
        });
        inventoryPage.openCart();
        cartPage.verifyCartItemCount(2);

        cartPage.removeItem(selectedProducts[0]);
        cartPage.verifyCartItemCount(1);
        cartPage.verifyItemNotInCart(selectedProducts[0]);
      });
    });
  });
});


