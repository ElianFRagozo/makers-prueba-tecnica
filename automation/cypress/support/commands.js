const LoginPage = require('./pages/LoginPage');

Cypress.Commands.add('login', (username, password) => {
  LoginPage.visit().typeUsername(username).typePassword(password).submit();
});
