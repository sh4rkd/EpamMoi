class ProductDetailsPage {
  private selectors = {
    productTitle: ".inventory_details_name",
    productDescription: ".inventory_details_desc",
    productPrice: ".inventory_details_price",
    backButton: "[data-test='back-to-products']"
  };

  assertProductDetails({
    name,
    descriptionSnippet,
    price
  }: {
    name: string;
    descriptionSnippet: string;
    price: string;
  }) {
    cy.get(this.selectors.productTitle).should("have.text", name);
    cy.get(this.selectors.productDescription).should(
      "contain.text",
      descriptionSnippet
    );
    cy.get(this.selectors.productPrice).should("have.text", price);
  }

  backToProducts() {
    cy.get(this.selectors.backButton).click();
  }
}

const productDetailsPage = new ProductDetailsPage();
export default productDetailsPage;


