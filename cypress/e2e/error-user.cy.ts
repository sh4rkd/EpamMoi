import cartPage from "../pages/CartPage";
import checkoutInformationPage from "../pages/CheckoutInformationPage";
import inventoryPage from "../pages/InventoryPage";
import { users } from "../support/data/users";

describe("Error User Tests", () => {
  const username = users.usernames.error;
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

    it("sorts products from Z to A", () => {
      inventoryPage.sortBy("za");
      inventoryPage.assertProductsSortedByName("desc");
    });

    it("sorts products from A to Z", () => {
      inventoryPage.sortBy("az");
      inventoryPage.assertProductsSortedByName("asc");
    });

    it("displays correct images for each product", () => {
      inventoryPage.assertProductImagesMatchNames();
    });
  });

  describe("Error Validation - Expected Behavior", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("does NOT show validation error when postal code is omitted (error_user behavior)", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.assertCartBadgeCount(1);
        inventoryPage.openCart();

        cartPage.assertNumberOfItems(1);
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "Error",
          lastName: "User",
          postalCode: "",
        });
        checkoutInformationPage.continue();
        // error_user NO muestra el mensaje de error (ese es su comportamiento esperado)
        checkoutInformationPage.assertErrorNotShown();
        checkoutInformationPage.assertStillOnCheckoutPage();
      });
    });

    it("does NOT show validation error when first name is omitted (error_user behavior)", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "",
          lastName: "User",
          postalCode: "12345",
        });
        checkoutInformationPage.continue();
        // error_user NO muestra el mensaje de error (ese es su comportamiento esperado)
        checkoutInformationPage.assertErrorNotShown();
        checkoutInformationPage.assertStillOnCheckoutPage();
      });
    });

    it("does NOT show validation error when last name is omitted (error_user behavior)", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "Error",
          lastName: "",
          postalCode: "12345",
        });
        checkoutInformationPage.continue();
        // error_user NO muestra el mensaje de error (ese es su comportamiento esperado)
        checkoutInformationPage.assertErrorNotShown();
        checkoutInformationPage.assertStillOnCheckoutPage();
      });
    });

    it("does NOT show validation error when all fields are empty (error_user behavior)", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "",
          lastName: "",
          postalCode: "",
        });
        checkoutInformationPage.continue();
        // error_user NO muestra el mensaje de error (ese es su comportamiento esperado)
        checkoutInformationPage.assertErrorNotShown();
        checkoutInformationPage.assertStillOnCheckoutPage();
      });
    });

    it("can still proceed with valid information despite error handling issues", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "Error",
          lastName: "User",
          postalCode: "12345",
        });
        checkoutInformationPage.continue();
        // Con información válida, debería poder continuar
        cy.url().should("include", "checkout-step-two");
      });
    });
  });
});
