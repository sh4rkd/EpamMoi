import { users } from "../../support/data/users";

describe("Network Resilience Scenarios", () => {
  const username = users.usernames.standard;
  const password = users.password;

  const loginThroughForm = () => {
    cy.loginTypeUsername(username);
    cy.loginTypePassword(password);
    cy.loginSubmit();
  };

  const triggerFontStylesheetRequest = () => {
    cy.document().then((doc) => {
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=DM+Sans:wght@400&display=swap&cb=${Date.now()}`;
      doc.head.appendChild(link);
    });
  };

  const triggerProductImageRequest = () => {
    cy.get(".inventory_item_img img")
      .first()
      .invoke("attr", "src")
      .then((src) => {
        cy.document().then((doc) => {
          const img = doc.createElement("img");
          img.src = `${src}?cb=${Date.now()}`;
          img.style.display = "none";
          doc.body.appendChild(img);
        });
      });
  };

  it("waits for bundle and stylesheet loads via Cypress aliases", () => {
    cy.loginVisit();

    cy.wait("@sauceBundle").its("response.statusCode").should("eq", 200);
    cy.wait("@sauceStyles").its("response.statusCode").should("eq", 200);

    loginThroughForm();
    cy.inventoryWaitForLoad();
    cy.inventoryAssertInventoryCount(6);
  });

  it("adds cart items even when the service worker is stubbed", () => {
    cy.loginVisit();

    cy.wait("@sauceServiceWorker").its("response.statusCode").should("eq", 200);

    loginThroughForm();
    cy.inventoryWaitForLoad();

    cy.inventoryGetAllProducts().then((products) => {
      const productName = products[0].name;
      cy.inventoryAddProduct(productName);
      cy.inventoryVerifyItemIsInCart(productName);
      cy.inventoryAssertCartBadgeCount(1);
    });
  });

  it("suppresses analytics noise by stubbing Backtrace calls", () => {
    cy.loginVisit();

    cy.window().then((win) => {
      return win.fetch(
        "https://events.backtrace.io/api/unique-events/submit?universe=TEST&token=TEST",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ stubbed: true }),
        }
      );
    });

    cy.wait("@sauceBacktracePreflight")
      .its("response.statusCode")
      .should("eq", 204);
    cy.wait("@sauceBacktraceSubmit")
      .its("response.statusCode")
      .should("eq", 204);

    loginThroughForm();
    cy.inventoryWaitForLoad();
    cy.inventoryAssertInventoryCount(6);
  });

  it("keeps the inventory visible even if Google Fonts fails", () => {
    cy.sauceBlockFonts();
    cy.login(username, password);
    cy.inventoryWaitForLoad();

    triggerFontStylesheetRequest();
    cy.wait("@sauceFontsStylesheet")
      .its("response.statusCode")
      .should("eq", 204);
    cy.inventoryAssertInventoryCount(6);
  });

  it("shows products even when the first catalog image returns 404", () => {
    cy.sauceBreakFirstProductImage();
    cy.login(username, password);
    cy.inventoryWaitForLoad();

    triggerProductImageRequest();
    cy.wait("@sauceBrokenImage").its("response.statusCode").should("eq", 404);

    cy.inventoryGetAllProducts().then((products) => {
      expect(products.length).to.eq(6);
      products.forEach((product) => {
        cy.contains(".inventory_item_name", product.name).should("be.visible");
      });
    });
  });

  it("renders inventory when fonts and the first image fail simultaneously", () => {
    cy.sauceBlockFonts();
    cy.sauceBreakFirstProductImage();
    cy.login(username, password);
    cy.inventoryWaitForLoad();

    triggerFontStylesheetRequest();
    triggerProductImageRequest();
    cy.wait("@sauceFontsStylesheet")
      .its("response.statusCode")
      .should("eq", 204);
    cy.wait("@sauceBrokenImage").its("response.statusCode").should("eq", 404);

    cy.inventoryAssertInventoryCount(6);
  });
});
