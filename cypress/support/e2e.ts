import "./commands";

Cypress.on("uncaught:exception", () => {
  // Evita que fallos ajenos a la prueba en la app bajo prueba rompan la ejecución.
  return false;
});


