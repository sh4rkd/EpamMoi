import inventoryPage from "../pages/InventoryPage";
import productDetailsPage from "../pages/ProductDetailsPage";
import { users } from "../support/data/users";

describe("Visual User Tests", () => {
  const username = users.usernames.visual;
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

  describe("Product Details", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("displays consistent product metadata for the visual user", () => {
      inventoryPage.getAllProducts().then((products) => {
        const product = products[0];
        inventoryPage.openProductDetails(product.name);

        cy.get(".inventory_details_name").should("have.text", product.name);
        cy.get(".inventory_details_price").should("have.text", product.price);
        cy.get(".inventory_details_desc")
          .should("be.visible")
          .and("not.be.empty");

        productDetailsPage.backToProducts();
        inventoryPage.waitForLoad();
      });
    });

    it("displays correct product details for multiple products", () => {
      inventoryPage.getAllProducts().then((products) => {
        // Verificar detalles de los primeros 3 productos
        const productsToCheck = products.slice(0, 3);

        productsToCheck.forEach((product) => {
          inventoryPage.openProductDetails(product.name);

          cy.get(".inventory_details_name").should("have.text", product.name);
          cy.get(".inventory_details_price").should("have.text", product.price);
          cy.get(".inventory_details_desc")
            .should("be.visible")
            .and("not.be.empty");

          productDetailsPage.backToProducts();
          inventoryPage.waitForLoad();
        });
      });
    });

    it("can navigate back to products from details page", () => {
      inventoryPage.getAllProducts().then((products) => {
        const product = products[0];
        inventoryPage.openProductDetails(product.name);

        productDetailsPage.backToProducts();
        inventoryPage.waitForLoad();
        cy.url().should("include", "/inventory.html");
      });
    });
  });

  describe("Visual Consistency", () => {
    beforeEach(() => {
      loginAndOpenInventory();
    });

    it("displays all products with consistent formatting", () => {
      inventoryPage.getAllProducts().then((products) => {
        expect(products.length).to.be.greaterThan(0);
        products.forEach((product) => {
          cy.contains(".inventory_item_name", product.name).should(
            "be.visible"
          );
          cy.contains(".inventory_item", product.name)
            .find(".inventory_item_price")
            .should("be.visible")
            .and("contain.text", "$");
        });
      });
    });

    it("displays product images correctly", () => {
      inventoryPage.assertProductImagesMatchNames();
    });
  });
});
