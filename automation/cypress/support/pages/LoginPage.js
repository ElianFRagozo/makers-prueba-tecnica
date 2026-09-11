class LoginPage {
  visit() {
    cy.visit('/');
    return this;
  }

  typeUsername(username) {
    cy.get('[data-test="username"]').clear().type(username);
    return this;
  }

  typePassword(password) {
    cy.get('[data-test="password"]').clear().type(password);
    return this;
  }

  submit() {
    cy.get('[data-test="login-button"]').click();
    return this;
  }

  getErrorMessage() {
    return cy.get('[data-test="error"]');
  }
}

module.exports = new LoginPage();
