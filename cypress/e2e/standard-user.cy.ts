import { faker } from "@faker-js/faker";
import cartPage from "../pages/CartPage";
import checkoutCompletePage from "../pages/CheckoutCompletePage";
import checkoutInformationPage, {
  CustomerInformation,
} from "../pages/CheckoutInformationPage";
import checkoutOverviewPage from "../pages/CheckoutOverviewPage";
import inventoryPage from "../pages/InventoryPage";
import { users } from "../support/data/users";

describe("Standard User Tests", () => {
  const username = users.usernames.standard;
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

    it("sorts products A to Z by default", () => {
      inventoryPage.verifyDefaultSort();
      inventoryPage.assertProductsSortedByName("asc");
    });

    it("sorts products from Z to A", () => {
      inventoryPage.sortBy("za");
      inventoryPage.assertProductsSortedByName("desc");
    });

    it("sorts products from A to Z", () => {
      inventoryPage.sortBy("az");
      inventoryPage.assertProductsSortedByName("asc");
    });

    it("sorts products by price low to high", () => {
      inventoryPage.sortBy("lohi");
      inventoryPage.assertProductsSortedByPrice("asc");
    });

    it("sorts products by price high to low", () => {
      inventoryPage.sortBy("hilo");
      inventoryPage.assertProductsSortedByPrice("desc");
    });

    it("maintains sort order after adding item to cart", () => {
      inventoryPage.sortBy("hilo");
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.assertProductsSortedByPrice("desc");
        cy.get("[data-test='product-sort-container']").should(
          "have.value",
          "hilo"
        );
      });
    });

    it("can change sort order multiple times", () => {
      inventoryPage.sortBy("az");
      inventoryPage.assertProductsSortedByName("asc");

      inventoryPage.sortBy("za");
      inventoryPage.assertProductsSortedByName("desc");

      inventoryPage.sortBy("lohi");
      inventoryPage.assertProductsSortedByPrice("asc");

      inventoryPage.sortBy("hilo");
      inventoryPage.assertProductsSortedByPrice("desc");

      inventoryPage.sortBy("az");
      inventoryPage.assertProductsSortedByName("asc");
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

    it("displays correct images for each product", () => {
      inventoryPage.assertProductImagesMatchNames();
    });
  });

  describe("Cart Actions", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("adds single item to cart", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.verifyItemIsInCart(productName);
        inventoryPage.assertCartBadgeCount(1);
      });
    });

    it("adds multiple items to cart", () => {
      inventoryPage.getAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) => {
          inventoryPage.addProductToCart(item);
          inventoryPage.verifyItemIsInCart(item);
        });
        inventoryPage.assertCartBadgeCount(3);
      });
    });

    it("removes item from cart on inventory page", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.assertCartBadgeCount(1);

        inventoryPage.removeProductFromCart(productName);
        inventoryPage.verifyItemIsNotInCart(productName);
        inventoryPage.assertCartBadgeCleared();
      });
    });

    it("updates cart badge when adding and removing items", () => {
      inventoryPage.getAllProducts().then((products) => {
        const product1 = products[0].name;
        const product2 = products[1].name;
        const product3 = products[2].name;

        inventoryPage.addProductToCart(product1);
        inventoryPage.assertCartBadgeCount(1);

        inventoryPage.addProductToCart(product2);
        inventoryPage.assertCartBadgeCount(2);

        inventoryPage.addProductToCart(product3);
        inventoryPage.assertCartBadgeCount(3);

        inventoryPage.removeProductFromCart(product2);
        inventoryPage.assertCartBadgeCount(2);

        inventoryPage.removeProductFromCart(product1);
        inventoryPage.assertCartBadgeCount(1);

        inventoryPage.removeProductFromCart(product3);
        inventoryPage.assertCartBadgeCleared();
      });
    });

    it("adds all items to cart", () => {
      inventoryPage.getAllProducts().then((products) => {
        products.forEach((product) => {
          inventoryPage.addProductToCart(product.name);
        });
        inventoryPage.assertCartBadgeCount(products.length);
      });
    });

    it("navigates to cart page when clicking cart icon", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.verifyCartPageIsDisplayed();
      });
    });

    it("persists cart items after navigation", () => {
      inventoryPage.getAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          inventoryPage.addProductToCart(item);
        });

        inventoryPage.openCart();
        cartPage.continueShopping();
        inventoryPage.waitForLoad();

        inventoryPage.assertCartBadgeCount(2);
        selectedProducts.forEach((item) => {
          inventoryPage.verifyItemIsInCart(item);
        });
      });
    });

    it("verifies item button text changes after adding to cart", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        cy.contains(".inventory_item", productName)
          .find("button")
          .should("contain.text", "Add to cart");

        inventoryPage.addProductToCart(productName);
        cy.contains(".inventory_item", productName)
          .find("button")
          .should("contain.text", "Remove");

        inventoryPage.removeProductFromCart(productName);
        cy.contains(".inventory_item", productName)
          .find("button")
          .should("contain.text", "Add to cart");
      });
    });

    it("verifies cart is empty by default", () => {
      inventoryPage.assertCartBadgeCleared();
    });
  });

  describe("Cart Validation", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("displays empty cart message when no items added", () => {
      inventoryPage.openCart();
      cartPage.verifyCartPageIsDisplayed();
      cartPage.verifyCartIsEmpty();
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
        const selectedProducts = products.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) => {
          inventoryPage.addProductToCart(item);
        });
        inventoryPage.openCart();

        cartPage.verifyCartPageIsDisplayed();
        cartPage.verifyCartItemCount(3);
        selectedProducts.forEach((item) => {
          cartPage.verifyItemInCart(item);
        });
      });
    });

    it("displays correct item prices in cart", () => {
      inventoryPage.getAllProducts().then((products) => {
        const product = products[0];
        inventoryPage.addProductToCart(product.name);
        inventoryPage.openCart();

        cartPage.verifyCartPageIsDisplayed();
        cartPage.getItemPrice(product.name).should("contain.text", "$");
        cartPage
          .getItemPrice(product.name)
          .should("contain.text", product.price.replace("$", ""));
      });
    });

    it("displays quantity as 1 for each item", () => {
      inventoryPage.getAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          inventoryPage.addProductToCart(item);
        });
        inventoryPage.openCart();

        selectedProducts.forEach((item) => {
          cartPage.verifyItemQuantity(item, 1);
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
        cartPage.verifyItemInCart(selectedProducts[1]);
      });
    });

    it("removes all items from cart", () => {
      inventoryPage.getAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          inventoryPage.addProductToCart(item);
        });
        inventoryPage.openCart();

        selectedProducts.forEach((item) => {
          cartPage.removeItem(item);
        });

        cartPage.verifyCartIsEmpty();
      });
    });

    it("navigates back to inventory with Continue Shopping", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();

        cartPage.continueShopping();
        inventoryPage.waitForLoad();
        cy.url().should("include", "/inventory.html");
      });
    });

    it("maintains cart badge count sync with cart items", () => {
      inventoryPage.getAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          inventoryPage.addProductToCart(item);
        });
        inventoryPage.assertCartBadgeCount(2);

        inventoryPage.openCart();
        cartPage.verifyCartItemCount(2);

        cartPage.removeItem(selectedProducts[0]);
        cartPage.continueShopping();
        inventoryPage.waitForLoad();
        inventoryPage.assertCartBadgeCount(1);
      });
    });

    it("displays checkout button when cart has items", () => {
      inventoryPage.getAllProducts().then((products) => {
        const productName = products[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();

        cy.get("[data-test='checkout']").should("be.visible").and("be.enabled");
      });
    });

    it("displays all cart item details correctly", () => {
      inventoryPage.getAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) => {
          inventoryPage.addProductToCart(item);
        });
        inventoryPage.openCart();

        cartPage.verifyCartPageIsDisplayed();
        selectedProducts.forEach((item) => {
          cartPage.verifyItemInCart(item);
          cartPage.getItemPrice(item).should("be.visible");
          cartPage
            .getItemQuantity(item)
            .should("be.visible")
            .and("have.text", "1");
        });
      });
    });
  });

  describe("Complete purchase flow", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("allows completing an end-to-end purchase", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const selectedProducts = allProducts.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) =>
          inventoryPage.addProductToCart(item)
        );
        inventoryPage.assertCartBadgeCount(selectedProducts.length);
        inventoryPage.openCart();

        cartPage.assertItems(selectedProducts);
        cartPage.assertNumberOfItems(selectedProducts.length);
        cartPage.checkout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        checkoutInformationPage.fillCustomerInformation(customer);
        checkoutInformationPage.continue();

        checkoutOverviewPage.assertItems(selectedProducts);
        checkoutOverviewPage.assertSubtotalIsGreaterThan(0);
        checkoutOverviewPage.finish();

        checkoutCompletePage.assertSuccessMessage();
        checkoutCompletePage.backToProducts();
        inventoryPage.assertCartBadgeCleared();
      });
    });

    it("displays correct item details in checkout overview", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const selectedProducts = allProducts.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) =>
          inventoryPage.addProductToCart(item)
        );
        inventoryPage.openCart();
        cartPage.checkout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        checkoutInformationPage.fillCustomerInformation(customer);
        checkoutInformationPage.continue();

        checkoutOverviewPage.verifyCheckoutStepTwoIsDisplayed();
        checkoutOverviewPage.getSummaryItemCount().should("eq", 2);
        selectedProducts.forEach((item) => {
          checkoutOverviewPage.verifyItemInSummary(item);
        });
      });
    });

    it("displays payment and shipping information", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        checkoutInformationPage.fillCustomerInformation(customer);
        checkoutInformationPage.continue();

        checkoutOverviewPage.verifyCheckoutStepTwoIsDisplayed();
        checkoutOverviewPage.verifyPaymentInformationIsDisplayed();
        checkoutOverviewPage.verifyShippingInformationIsDisplayed();
      });
    });

    it("displays price summary with tax in checkout overview", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        checkoutInformationPage.fillCustomerInformation(customer);
        checkoutInformationPage.continue();

        checkoutOverviewPage.verifyCheckoutStepTwoIsDisplayed();
        checkoutOverviewPage
          .getItemTotal()
          .should("be.visible")
          .and("contain.text", "Item total:");
        checkoutOverviewPage
          .getTax()
          .should("be.visible")
          .and("contain.text", "Tax:");
        checkoutOverviewPage
          .getTotal()
          .should("be.visible")
          .and("contain.text", "Total:");
      });
    });

    it("returns to inventory from checkout complete page", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        checkoutInformationPage.fillCustomerInformation(customer);
        checkoutInformationPage.continue();
        checkoutOverviewPage.finish();

        checkoutCompletePage.assertSuccessMessage();
        checkoutCompletePage.backToProducts();
        inventoryPage.waitForLoad();
        cy.url().should("include", "/inventory.html");
      });
    });

    it("checkouts with multiple items successfully", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const selectedProducts = allProducts.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) =>
          inventoryPage.addProductToCart(item)
        );
        inventoryPage.openCart();
        cartPage.checkout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        checkoutInformationPage.fillCustomerInformation(customer);
        checkoutInformationPage.continue();
        checkoutOverviewPage.finish();

        checkoutCompletePage.assertSuccessMessage();
      });
    });

    it("accepts various postal code formats", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: "AB123CD",
        };
        checkoutInformationPage.fillCustomerInformation(customer);
        checkoutInformationPage.continue();

        checkoutOverviewPage.verifyCheckoutStepTwoIsDisplayed();
      });
    });

    it("handles long names in checkout form", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        const customer: CustomerInformation = {
          firstName: "Christopher Alexander",
          lastName: "Montgomery-Richardson",
          postalCode: "12345",
        };
        checkoutInformationPage.fillCustomerInformation(customer);
        checkoutInformationPage.continue();

        checkoutOverviewPage.verifyCheckoutStepTwoIsDisplayed();
      });
    });

    it("completes checkout with single character names", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        const customer: CustomerInformation = {
          firstName: "A",
          lastName: "B",
          postalCode: "1",
        };
        checkoutInformationPage.fillCustomerInformation(customer);
        checkoutInformationPage.continue();

        checkoutOverviewPage.verifyCheckoutStepTwoIsDisplayed();
        checkoutOverviewPage.finish();
        checkoutCompletePage.assertSuccessMessage();
      });
    });

    it("maintains cart contents through checkout flow", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const selectedProducts = allProducts.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) =>
          inventoryPage.addProductToCart(item)
        );
        inventoryPage.openCart();
        selectedProducts.forEach((item) => {
          cartPage.verifyItemInCart(item);
        });

        cartPage.checkout();
        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        checkoutInformationPage.fillCustomerInformation(customer);
        checkoutInformationPage.continue();

        selectedProducts.forEach((item) => {
          checkoutOverviewPage.verifyItemInSummary(item);
        });
      });
    });
  });

  describe("Checkout Negative Scenarios", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("shows error when first name is missing", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "",
          lastName: "Doe",
          postalCode: "12345",
        });
        checkoutInformationPage.continue();

        checkoutInformationPage.assertError("First Name is required");
        cy.url().should("include", "/checkout-step-one.html");
      });
    });

    it("shows error when last name is missing", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "John",
          lastName: "",
          postalCode: "12345",
        });
        checkoutInformationPage.continue();

        checkoutInformationPage.assertError("Last Name is required");
        cy.url().should("include", "/checkout-step-one.html");
      });
    });

    it("shows error when postal code is missing", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "John",
          lastName: "Doe",
          postalCode: "",
        });
        checkoutInformationPage.continue();

        checkoutInformationPage.assertError("Postal Code is required");
        cy.url().should("include", "/checkout-step-one.html");
      });
    });

    it("shows error when all fields are empty", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "",
          lastName: "",
          postalCode: "",
        });
        checkoutInformationPage.continue();

        checkoutInformationPage.assertError("First Name is required");
      });
    });

    it("shows error when only first name is provided", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "John",
          lastName: "",
          postalCode: "",
        });
        checkoutInformationPage.continue();

        checkoutInformationPage.assertError("Last Name is required");
      });
    });

    it("shows error when only last name is provided", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "",
          lastName: "Doe",
          postalCode: "",
        });
        checkoutInformationPage.continue();

        checkoutInformationPage.assertError("First Name is required");
      });
    });

    it("shows error when only postal code is provided", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "",
          lastName: "",
          postalCode: "12345",
        });
        checkoutInformationPage.continue();

        checkoutInformationPage.assertError("First Name is required");
      });
    });

    it("allows retry after validation error", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "John",
          lastName: "Doe",
          postalCode: "",
        });
        checkoutInformationPage.continue();
        checkoutInformationPage.assertError("Postal Code is required");

        checkoutInformationPage.fillCustomerInformation({
          firstName: "John",
          lastName: "Doe",
          postalCode: "12345",
        });
        checkoutInformationPage.continue();

        checkoutOverviewPage.verifyCheckoutStepTwoIsDisplayed();
      });
    });

    it("handles special characters in name fields", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "John-O'Brien",
          lastName: "Smith-Jones",
          postalCode: "12345",
        });
        checkoutInformationPage.continue();

        checkoutOverviewPage.verifyCheckoutStepTwoIsDisplayed();
      });
    });

    it("handles numeric characters in name fields", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "John123",
          lastName: "Doe456",
          postalCode: "12345",
        });
        checkoutInformationPage.continue();

        checkoutOverviewPage.verifyCheckoutStepTwoIsDisplayed();
      });
    });

    it("returns to cart when clicking Cancel button", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.cancel();

        cartPage.verifyCartPageIsDisplayed();
        cy.url().should("include", "/cart.html");
      });
    });

    it("preserves entered data when validation fails", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        checkoutInformationPage.fillCustomerInformation({
          firstName: "John",
          lastName: "Doe",
          postalCode: "",
        });
        checkoutInformationPage.continue();

        checkoutInformationPage.assertError("Postal Code is required");

        cy.get("[data-test='firstName']").should("have.value", "John");
        cy.get("[data-test='lastName']").should("have.value", "Doe");
      });
    });

    it("validates field order for error messages", () => {
      inventoryPage.getAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        inventoryPage.addProductToCart(productName);
        inventoryPage.openCart();
        cartPage.checkout();

        // Test 1: All empty, should show First Name error
        checkoutInformationPage.fillCustomerInformation({
          firstName: "",
          lastName: "",
          postalCode: "",
        });
        checkoutInformationPage.continue();
        checkoutInformationPage.assertError("First Name is required");

        // Test 2: Only first name filled, should show Last Name error
        cy.reload();
        checkoutInformationPage.fillCustomerInformation({
          firstName: "John",
          lastName: "",
          postalCode: "",
        });
        checkoutInformationPage.continue();
        checkoutInformationPage.assertError("Last Name is required");

        // Test 3: First and last name filled, should show Postal Code error
        cy.reload();
        checkoutInformationPage.fillCustomerInformation({
          firstName: "John",
          lastName: "Doe",
          postalCode: "",
        });
        checkoutInformationPage.continue();
        checkoutInformationPage.assertError("Postal Code is required");
      });
    });
  });
});
