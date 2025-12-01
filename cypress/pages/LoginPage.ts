class LoginPage {
  private selectors = {
    username: '[data-test="username"]',
    password: '[data-test="password"]',
    submit: '[data-test="login-button"]',
    error: '[data-test="error"]',
    errorButton: '[data-test="error-button"]'
  };

  visit() {
    cy.visit("/");
    return this;
  }

  typeUsername(value: string) {
    cy.get(this.selectors.username).clear().type(value);
    return this;
  }

  typePassword(value: string) {
    cy.get(this.selectors.password).clear().type(value);
    return this;
  }

  submit() {
    cy.get(this.selectors.submit).click();
  }

  login(username: string, password: string) {
    this.visit().typeUsername(username).typePassword(password).submit();
  }

  assertErrorMessage(expected: string) {
    cy.get(this.selectors.error).should("contain.text", expected);
  }

  closeErrorMessage() {
    cy.get(this.selectors.errorButton).should("be.visible").click();
  }

  getErrorMessage() {
    return cy.get(this.selectors.error);
  }
}

const loginPage = new LoginPage();
export default loginPage;


