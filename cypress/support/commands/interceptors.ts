const BACKTRACE_API_PATTERN =
  /https:\/\/events\.backtrace\.io\/api\/.*\/submit.*$/;

Cypress.Commands.add("sauceInterceptServiceWorker", () => {
  cy.intercept("GET", "/service-worker.js", {
    statusCode: 200,
    body: "// Service worker intercepted by Cypress\n",
    headers: {
      "content-type": "application/javascript",
      "cache-control": "no-store",
    },
  }).as("sauceServiceWorker");
});

Cypress.Commands.add("sauceInterceptAssets", () => {
  cy.intercept("GET", "/static/js/main*.js").as("sauceBundle");
  cy.intercept("GET", "/static/css/main*.css").as("sauceStyles");
});

Cypress.Commands.add("sauceInterceptAnalytics", () => {
  const corsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "cache-control": "no-store",
  };

  cy.intercept(
    { method: "OPTIONS", url: BACKTRACE_API_PATTERN },
    { statusCode: 204, body: {}, headers: corsHeaders }
  ).as("sauceBacktracePreflight");

  cy.intercept(
    { method: "POST", url: BACKTRACE_API_PATTERN },
    { statusCode: 204, body: { stubbed: true }, headers: corsHeaders }
  ).as("sauceBacktraceSubmit");
});

Cypress.Commands.add("saucePrepareNetworkStubs", () => {
  cy.sauceInterceptServiceWorker();
  cy.sauceInterceptAssets();
  cy.sauceInterceptAnalytics();
});

Cypress.Commands.add("sauceBlockFonts", () => {
  cy.intercept("GET", "https://fonts.googleapis.com/**", {
    statusCode: 204,
    body: "",
    headers: {
      "access-control-allow-origin": "*",
      "cache-control": "no-store",
    },
  }).as("sauceFontsStylesheet");

  cy.intercept("GET", "https://fonts.gstatic.com/**", {
    statusCode: 204,
    body: "",
    headers: {
      "access-control-allow-origin": "*",
      "cache-control": "no-store",
    },
  }).as("sauceFontsBinary");
});

Cypress.Commands.add("sauceBreakFirstProductImage", () => {
  let hasBrokenImage = false;

  cy.intercept("GET", /\/static\/media\/.*\.jpg(?:\?.*)?$/, (req) => {
    if (!hasBrokenImage) {
      hasBrokenImage = true;
      req.reply({
        statusCode: 404,
        body: "",
        headers: {
          "cache-control": "no-store",
        },
      });
    } else {
      req.continue();
    }
  }).as("sauceBrokenImage");
});
