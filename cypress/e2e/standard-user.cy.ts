import { faker } from "@faker-js/faker";
import { CustomerInformation } from "../pages/CheckoutInformationPage";
import { users } from "../support/data/users";

describe("Standard User Tests", () => {
  const username = users.usernames.standard;
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

    it("sorts products A to Z by default", () => {
      cy.inventoryVerifyDefaultSort();
      cy.inventoryAssertProductsSortedByName("asc");
    });

    it("sorts products from Z to A", () => {
      cy.inventorySort("za");
      cy.inventoryAssertProductsSortedByName("desc");
    });

    it("sorts products from A to Z", () => {
      cy.inventorySort("az");
      cy.inventoryAssertProductsSortedByName("asc");
    });

    it("sorts products by price low to high", () => {
      cy.inventorySort("lohi");
      cy.inventoryAssertProductsSortedByPrice("asc");
    });

    it("sorts products by price high to low", () => {
      cy.inventorySort("hilo");
      cy.inventoryAssertProductsSortedByPrice("desc");
    });

    it("maintains sort order after adding item to cart", () => {
      cy.inventorySort("hilo");
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryAssertProductsSortedByPrice("desc");
        cy.get("[data-test='product-sort-container']").should(
          "have.value",
          "hilo"
        );
      });
    });

    it("can change sort order multiple times", () => {
      cy.inventorySort("az");
      cy.inventoryAssertProductsSortedByName("asc");

      cy.inventorySort("za");
      cy.inventoryAssertProductsSortedByName("desc");

      cy.inventorySort("lohi");
      cy.inventoryAssertProductsSortedByPrice("asc");

      cy.inventorySort("hilo");
      cy.inventoryAssertProductsSortedByPrice("desc");

      cy.inventorySort("az");
      cy.inventoryAssertProductsSortedByName("asc");
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

    it("displays correct images for each product", () => {
      cy.inventoryAssertProductImagesMatchNames();
    });
  });

  describe("Cart Actions", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("adds single item to cart", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryVerifyItemIsInCart(productName);
        cy.inventoryAssertCartBadgeCount(1);
      });
    });

    it("adds multiple items to cart", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) => {
          cy.inventoryAddProduct(item);
          cy.inventoryVerifyItemIsInCart(item);
        });
        cy.inventoryAssertCartBadgeCount(3);
      });
    });

    it("removes item from cart on inventory page", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryAssertCartBadgeCount(1);

        cy.inventoryRemoveProduct(productName);
        cy.inventoryVerifyItemIsNotInCart(productName);
        cy.inventoryAssertCartBadgeCleared();
      });
    });

    it("updates cart badge when adding and removing items", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const product1 = products[0].name;
        const product2 = products[1].name;
        const product3 = products[2].name;

        cy.inventoryAddProduct(product1);
        cy.inventoryAssertCartBadgeCount(1);

        cy.inventoryAddProduct(product2);
        cy.inventoryAssertCartBadgeCount(2);

        cy.inventoryAddProduct(product3);
        cy.inventoryAssertCartBadgeCount(3);

        cy.inventoryRemoveProduct(product2);
        cy.inventoryAssertCartBadgeCount(2);

        cy.inventoryRemoveProduct(product1);
        cy.inventoryAssertCartBadgeCount(1);

        cy.inventoryRemoveProduct(product3);
        cy.inventoryAssertCartBadgeCleared();
      });
    });

    it("adds all items to cart", () => {
      cy.inventoryGetAllProducts().then((products) => {
        products.forEach((product) => {
          cy.inventoryAddProduct(product.name);
        });
        cy.inventoryAssertCartBadgeCount(products.length);
      });
    });

    it("navigates to cart page when clicking cart icon", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartVerifyCartPageIsDisplayed();
      });
    });

    it("persists cart items after navigation", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          cy.inventoryAddProduct(item);
        });

        cy.inventoryOpenCart();
        cy.cartContinueShopping();
        cy.inventoryWaitForLoad();

        cy.inventoryAssertCartBadgeCount(2);
        selectedProducts.forEach((item) => {
          cy.inventoryVerifyItemIsInCart(item);
        });
      });
    });

    it("verifies item button text changes after adding to cart", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.contains(".inventory_item", productName)
          .find("button")
          .should("contain.text", "Add to cart");

        cy.inventoryAddProduct(productName);
        cy.contains(".inventory_item", productName)
          .find("button")
          .should("contain.text", "Remove");

        cy.inventoryRemoveProduct(productName);
        cy.contains(".inventory_item", productName)
          .find("button")
          .should("contain.text", "Add to cart");
      });
    });

    it("verifies cart is empty by default", () => {
      cy.inventoryAssertCartBadgeCleared();
    });
  });

  describe("Cart Validation", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("displays empty cart message when no items added", () => {
      cy.inventoryOpenCart();
      cy.cartVerifyCartPageIsDisplayed();
      cy.cartVerifyCartIsEmpty();
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
        const selectedProducts = products.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) => {
          cy.inventoryAddProduct(item);
        });
        cy.inventoryOpenCart();

        cy.cartVerifyCartPageIsDisplayed();
        cy.cartVerifyCartItemCount(3);
        selectedProducts.forEach((item) => {
          cy.cartVerifyItemInCart(item);
        });
      });
    });

    it("displays correct item prices in cart", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const product = products[0];
        cy.inventoryAddProduct(product.name);
        cy.inventoryOpenCart();

        cy.cartVerifyCartPageIsDisplayed();
        cy.cartGetItemPrice(product.name).should("contain.text", "$");
        cy.cartGetItemPrice(product.name).should(
          "contain.text",
          product.price.replace("$", "")
        );
      });
    });

    it("displays quantity as 1 for each item", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          cy.inventoryAddProduct(item);
        });
        cy.inventoryOpenCart();

        selectedProducts.forEach((item) => {
          cy.cartVerifyItemQuantity(item, 1);
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
        cy.cartVerifyItemInCart(selectedProducts[1]);
      });
    });

    it("removes all items from cart", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          cy.inventoryAddProduct(item);
        });
        cy.inventoryOpenCart();

        selectedProducts.forEach((item) => {
          cy.cartRemoveItem(item);
        });

        cy.cartVerifyCartIsEmpty();
      });
    });

    it("navigates back to inventory with Continue Shopping", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();

        cy.cartContinueShopping();
        cy.inventoryWaitForLoad();
        cy.url().should("include", "/inventory.html");
      });
    });

    it("maintains cart badge count sync with cart items", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => {
          cy.inventoryAddProduct(item);
        });
        cy.inventoryAssertCartBadgeCount(2);

        cy.inventoryOpenCart();
        cy.cartVerifyCartItemCount(2);

        cy.cartRemoveItem(selectedProducts[0]);
        cy.cartContinueShopping();
        cy.inventoryWaitForLoad();
        cy.inventoryAssertCartBadgeCount(1);
      });
    });

    it("displays checkout button when cart has items", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const productName = products[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();

        cy.get("[data-test='checkout']").should("be.visible").and("be.enabled");
      });
    });

    it("displays all cart item details correctly", () => {
      cy.inventoryGetAllProducts().then((products) => {
        const selectedProducts = products.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) => {
          cy.inventoryAddProduct(item);
        });
        cy.inventoryOpenCart();

        cy.cartVerifyCartPageIsDisplayed();
        selectedProducts.forEach((item) => {
          cy.cartVerifyItemInCart(item);
          cy.cartGetItemPrice(item).should("be.visible");
          cy.cartGetItemQuantity(item)
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
      cy.inventoryGetAllProducts().then((allProducts) => {
        const selectedProducts = allProducts.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => cy.inventoryAddProduct(item));
        cy.inventoryAssertCartBadgeCount(selectedProducts.length);
        cy.inventoryOpenCart();

        cy.cartAssertItems(selectedProducts);
        cy.cartAssertNumberOfItems(selectedProducts.length);
        cy.cartCheckout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        cy.checkoutFillInformation(customer);
        cy.checkoutContinue();

        cy.checkoutOverviewAssertItems(selectedProducts);
        cy.checkoutOverviewAssertSubtotalGreaterThan(0);
        cy.checkoutOverviewFinish();

        cy.checkoutAssertSuccessMessage();
        cy.checkoutBackToProducts();
        cy.inventoryAssertCartBadgeCleared();
      });
    });

    it("displays correct item details in checkout overview", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const selectedProducts = allProducts.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => cy.inventoryAddProduct(item));
        cy.inventoryOpenCart();
        cy.cartCheckout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        cy.checkoutFillInformation(customer);
        cy.checkoutContinue();

        cy.checkoutOverviewVerifyStepTwo();
        cy.checkoutOverviewGetSummaryItemCount().should("eq", 2);
        selectedProducts.forEach((item) => {
          cy.checkoutOverviewVerifyItemInSummary(item);
        });
      });
    });

    it("displays payment and shipping information", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        cy.checkoutFillInformation(customer);
        cy.checkoutContinue();

        cy.checkoutOverviewVerifyStepTwo();
        cy.checkoutOverviewVerifyPaymentInfo();
        cy.checkoutOverviewVerifyShippingInfo();
      });
    });

    it("displays price summary with tax in checkout overview", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        cy.checkoutFillInformation(customer);
        cy.checkoutContinue();

        cy.checkoutOverviewVerifyStepTwo();
        cy.checkoutOverviewGetItemTotal()
          .should("be.visible")
          .and("contain.text", "Item total:");
        cy.checkoutOverviewGetTax()
          .should("be.visible")
          .and("contain.text", "Tax:");
        cy.checkoutOverviewGetTotal()
          .should("be.visible")
          .and("contain.text", "Total:");
      });
    });

    it("returns to inventory from checkout complete page", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        cy.checkoutFillInformation(customer);
        cy.checkoutContinue();
        cy.checkoutOverviewFinish();

        cy.checkoutAssertSuccessMessage();
        cy.checkoutBackToProducts();
        cy.inventoryWaitForLoad();
        cy.url().should("include", "/inventory.html");
      });
    });

    it("checkouts with multiple items successfully", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const selectedProducts = allProducts.slice(0, 3).map((p) => p.name);
        selectedProducts.forEach((item) => cy.inventoryAddProduct(item));
        cy.inventoryOpenCart();
        cy.cartCheckout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        cy.checkoutFillInformation(customer);
        cy.checkoutContinue();
        cy.checkoutOverviewFinish();

        cy.checkoutAssertSuccessMessage();
      });
    });

    it("accepts various postal code formats", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: "AB123CD",
        };
        cy.checkoutFillInformation(customer);
        cy.checkoutContinue();

        cy.checkoutOverviewVerifyStepTwo();
      });
    });

    it("handles long names in checkout form", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        const customer: CustomerInformation = {
          firstName: "Christopher Alexander",
          lastName: "Montgomery-Richardson",
          postalCode: "12345",
        };
        cy.checkoutFillInformation(customer);
        cy.checkoutContinue();

        cy.checkoutOverviewVerifyStepTwo();
      });
    });

    it("completes checkout with single character names", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        const customer: CustomerInformation = {
          firstName: "A",
          lastName: "B",
          postalCode: "1",
        };
        cy.checkoutFillInformation(customer);
        cy.checkoutContinue();

        cy.checkoutOverviewVerifyStepTwo();
        cy.checkoutOverviewFinish();
        cy.checkoutAssertSuccessMessage();
      });
    });

    it("maintains cart contents through checkout flow", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const selectedProducts = allProducts.slice(0, 2).map((p) => p.name);
        selectedProducts.forEach((item) => cy.inventoryAddProduct(item));
        cy.inventoryOpenCart();
        selectedProducts.forEach((item) => {
          cy.cartVerifyItemInCart(item);
        });

        cy.cartCheckout();
        const customer: CustomerInformation = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        };
        cy.checkoutFillInformation(customer);
        cy.checkoutContinue();

        selectedProducts.forEach((item) => {
          cy.checkoutOverviewVerifyItemInSummary(item);
        });
      });
    });
  });

  describe("Checkout Negative Scenarios", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("shows error when first name is missing", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "",
          lastName: "Doe",
          postalCode: "12345",
        });
        cy.checkoutContinue();

        cy.checkoutAssertError("First Name is required");
        cy.url().should("include", "/checkout-step-one.html");
      });
    });

    it("shows error when last name is missing", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "John",
          lastName: "",
          postalCode: "12345",
        });
        cy.checkoutContinue();

        cy.checkoutAssertError("Last Name is required");
        cy.url().should("include", "/checkout-step-one.html");
      });
    });

    it("shows error when postal code is missing", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "John",
          lastName: "Doe",
          postalCode: "",
        });
        cy.checkoutContinue();

        cy.checkoutAssertError("Postal Code is required");
        cy.url().should("include", "/checkout-step-one.html");
      });
    });

    it("shows error when all fields are empty", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "",
          lastName: "",
          postalCode: "",
        });
        cy.checkoutContinue();

        cy.checkoutAssertError("First Name is required");
      });
    });

    it("shows error when only first name is provided", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "John",
          lastName: "",
          postalCode: "",
        });
        cy.checkoutContinue();

        cy.checkoutAssertError("Last Name is required");
      });
    });

    it("shows error when only last name is provided", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "",
          lastName: "Doe",
          postalCode: "",
        });
        cy.checkoutContinue();

        cy.checkoutAssertError("First Name is required");
      });
    });

    it("shows error when only postal code is provided", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "",
          lastName: "",
          postalCode: "12345",
        });
        cy.checkoutContinue();

        cy.checkoutAssertError("First Name is required");
      });
    });

    it("allows retry after validation error", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "John",
          lastName: "Doe",
          postalCode: "",
        });
        cy.checkoutContinue();
        cy.checkoutAssertError("Postal Code is required");

        cy.checkoutFillInformation({
          firstName: "John",
          lastName: "Doe",
          postalCode: "12345",
        });
        cy.checkoutContinue();

        cy.checkoutOverviewVerifyStepTwo();
      });
    });

    it("handles special characters in name fields", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "John-O'Brien",
          lastName: "Smith-Jones",
          postalCode: "12345",
        });
        cy.checkoutContinue();

        cy.checkoutOverviewVerifyStepTwo();
      });
    });

    it("handles numeric characters in name fields", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "John123",
          lastName: "Doe456",
          postalCode: "12345",
        });
        cy.checkoutContinue();

        cy.checkoutOverviewVerifyStepTwo();
      });
    });

    it("returns to cart when clicking Cancel button", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutCancel();

        cy.cartVerifyCartPageIsDisplayed();
        cy.url().should("include", "/cart.html");
      });
    });

    it("preserves entered data when validation fails", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        cy.checkoutFillInformation({
          firstName: "John",
          lastName: "Doe",
          postalCode: "",
        });
        cy.checkoutContinue();

        cy.checkoutAssertError("Postal Code is required");

        cy.get("[data-test='firstName']").should("have.value", "John");
        cy.get("[data-test='lastName']").should("have.value", "Doe");
      });
    });

    it("validates field order for error messages", () => {
      cy.inventoryGetAllProducts().then((allProducts) => {
        const productName = allProducts[0].name;
        cy.inventoryAddProduct(productName);
        cy.inventoryOpenCart();
        cy.cartCheckout();

        // Test 1: All empty, should show First Name error
        cy.checkoutFillInformation({
          firstName: "",
          lastName: "",
          postalCode: "",
        });
        cy.checkoutContinue();
        cy.checkoutAssertError("First Name is required");

        // Test 2: Only first name filled, should show Last Name error
        cy.reload();
        cy.checkoutFillInformation({
          firstName: "John",
          lastName: "",
          postalCode: "",
        });
        cy.checkoutContinue();
        cy.checkoutAssertError("Last Name is required");

        // Test 3: First and last name filled, should show Postal Code error
        cy.reload();
        cy.checkoutFillInformation({
          firstName: "John",
          lastName: "Doe",
          postalCode: "",
        });
        cy.checkoutContinue();
        cy.checkoutAssertError("Postal Code is required");
      });
    });
  });
});
