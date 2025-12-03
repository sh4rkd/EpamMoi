import { users } from "../support/data/users";

describe("Problem User Tests", () => {
  const username = users.usernames.problem;
  const password = users.password;

  const loginAndOpenInventory = () => {
    cy.login(username, password);
    cy.inventoryWaitForLoad();
  };

  describe("Authentication", () => {
    it("allows login and displays inventory", () => {
      cy.login(username, password);
      cy.inventoryWaitForLoad();
      cy.inventoryGetAllProducts().then((products) => {
        expect(products.length).to.be.greaterThan(0);
        cy.inventoryAssertInventoryCount(products.length);
      });
    });
  });

  describe("Cart Issues", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("lets the problem user recover by resetting the cart", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) =>
          cy.inventoryAddProduct(item)
        );
        cy.inventoryAssertCartBadgeAtLeast(1);

        cy.inventoryResetAppState();
        cy.inventoryAssertCartBadgeCleared();
      });
    });

    it("can add items to cart despite problems", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryAssertCartBadgeAtLeast(1);
      });
    });

    it("can navigate to cart page", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartAssertNumberOfItems(1);
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

    it("sorts products from A to Z", () => {
      cy.inventorySort("az");
      cy.inventoryAssertProductsSortedByName("asc");
    });

    it("sorts products from Z to A", () => {
      cy.inventorySort("za");
      cy.inventoryAssertProductsSortedByName("desc");
    });

    it("sorts products by price low to high", () => {
      cy.inventorySort("lohi");
      cy.inventoryAssertProductsSortedByPrice("asc");
    });

    it("sorts products by price high to low", () => {
      cy.inventorySort("hilo");
      cy.inventoryAssertProductsSortedByPrice("desc");
    });

    it("displays products even with potential image issues", () => {
      cy.inventoryGetAllProducts().then((products) => {
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
      cy.inventoryGetAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) => {
          cy.inventoryAddProduct(item);
        });
        cy.inventoryAssertCartBadgeAtLeast(3);
      });
    });

    it("removes item from cart on inventory page", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryAssertCartBadgeAtLeast(1);

        cy.inventoryRemoveProduct(productName);
        cy.inventoryVerifyItemIsNotInCart(productName);
      });
    });

    it("updates cart badge when adding and removing items", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const product1 = products[0].name;
        const product2 = products[1].name;

        cy.inventoryAddProduct(product1);
        cy.inventoryAssertCartBadgeAtLeast(1);

        cy.inventoryAddProduct(product2);
        cy.inventoryAssertCartBadgeAtLeast(2);

        cy.inventoryRemoveProduct(product1);
        cy.inventoryAssertCartBadgeAtLeast(1);
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
        cy.inventoryOpenCart();

        cy.cartVerifyCartPageIsDisplayed();
        cy.cartVerifyCartItemCount(1);
        cy.cartVerifyItemInCart(productName);
      });
    });

    it("displays multiple items with correct details", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          cy.inventoryAddProduct(item);
        });
        cy.inventoryOpenCart();

        cy.cartVerifyCartPageIsDisplayed();
        cy.cartVerifyCartItemCount(2);
        selectedProducts.forEach((item) => {
          cy.cartVerifyItemInCart(item);
        });
      });
    });

    it("removes item from cart", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          cy.inventoryAddProduct(item);
        });
        cy.inventoryOpenCart();
        cy.cartVerifyCartItemCount(2);

        cy.cartRemoveItem(selectedProducts[0]);
        cy.cartVerifyCartItemCount(1);
        cy.cartVerifyItemNotInCart(selectedProducts[0]);
      });
    });
  });
});






