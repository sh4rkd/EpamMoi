import { users } from "../support/data/users";

describe("Error User Tests", () => {
  const username = users.usernames.error;
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

    it("sorts products from Z to A", () => {
      cy.inventorySort("za");
      cy.inventoryAssertProductsSortedByName("desc");
    });

    it("sorts products from A to Z", () => {
      cy.inventorySort("az");
      cy.inventoryAssertProductsSortedByName("asc");
    });

    it("displays correct images for each product", () => {
      cy.inventoryAssertProductImagesMatchNames();
    });
  });

  describe("Error Validation - Expected Behavior", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("does NOT show validation error when postal code is omitted (error_user behavior)", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryAssertCartBadgeCount(1);
        cy.inventoryOpenCart();

        cy.cartAssertNumberOfItems(1);
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "Error",
          lastName: "User",
          postalCode: "",
        });
        cy.checkoutContinue();
        // error_user NO muestra el mensaje de error (ese es su comportamiento esperado)
        cy.checkoutAssertErrorNotShown();
        cy.checkoutAssertStillOnInformation();
      });
    });

    it("does NOT show validation error when first name is omitted (error_user behavior)", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "",
          lastName: "User",
          postalCode: "12345",
        });
        cy.checkoutContinue();
        // error_user NO muestra el mensaje de error (ese es su comportamiento esperado)
        cy.checkoutAssertErrorNotShown();
        cy.checkoutAssertStillOnInformation();
      });
    });

    it("does NOT show validation error when last name is omitted (error_user behavior)", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "Error",
          lastName: "",
          postalCode: "12345",
        });
        cy.checkoutContinue();
        // error_user NO muestra el mensaje de error (ese es su comportamiento esperado)
        cy.checkoutAssertErrorNotShown();
        cy.checkoutAssertStillOnInformation();
      });
    });

    it("does NOT show validation error when all fields are empty (error_user behavior)", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "",
          lastName: "",
          postalCode: "",
        });
        cy.checkoutContinue();
        // error_user NO muestra el mensaje de error (ese es su comportamiento esperado)
        cy.checkoutAssertErrorNotShown();
        cy.checkoutAssertStillOnInformation();
      });
    });

    it("can still proceed with valid information despite error handling issues", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "Error",
          lastName: "User",
          postalCode: "12345",
        });
        cy.checkoutContinue();
        // Con información válida, debería poder continuar
        cy.url().should("include", "checkout-step-two");
      });
    });
  });
});
