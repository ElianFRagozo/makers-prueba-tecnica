const LoginPage = require('../support/pages/LoginPage');

describe('Smoke Test - Inicio de sesion SauceDemo', () => {
  it('Login exitoso con credenciales validas', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.location('pathname').should('eq', '/inventory.html');
    cy.get('.title').should('have.text', 'Products');
    cy.screenshot('login-exitoso');
  });

  it('Login fallido con contrasena incorrecta', () => {
    cy.login('standard_user', 'wrong_password');
    LoginPage.getErrorMessage()
      .should('be.visible')
      .and('contain.text', 'Username and password do not match any user in this service');
    cy.location('pathname').should('eq', '/');
    cy.screenshot('login-fallido-password-incorrecta');
  });

  it('Validacion de campo obligatorio: usuario y password vacios', () => {
    LoginPage.visit().submit();
    LoginPage.getErrorMessage().should('be.visible').and('contain.text', 'Username is required');
    cy.screenshot('validacion-campos-vacios');
  });

  it('Validacion de campo obligatorio: password vacio', () => {
    LoginPage.visit().typeUsername('standard_user').submit();
    LoginPage.getErrorMessage().should('be.visible').and('contain.text', 'Password is required');
    cy.screenshot('validacion-password-vacio');
  });

  it('Caso adicional: usuario bloqueado (locked_out_user)', () => {
    cy.login('locked_out_user', 'secret_sauce');
    LoginPage.getErrorMessage().should('be.visible').and('contain.text', 'Sorry, this user has been locked out');
    cy.screenshot('login-usuario-bloqueado');
  });
});
