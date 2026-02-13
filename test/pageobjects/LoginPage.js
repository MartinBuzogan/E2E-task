const BasePage = require('./BasePage');
const logger = require('../helpers/logger');

class LoginPage extends BasePage {
    get inputEmail() { return $('#email'); }
    get inputPassword() { return $('#password'); }
    get btnLogin() { return $('#login-button'); }
    get emailMessage() { return $('#email-message'); }
    get passwordMessage() { return $('#password-message'); }

    async open() {
        await super.open('login.html');
    }

    async login(email, password) {
        logger.info(`Logging in with: ${email}`);
        await this.inputEmail.waitForDisplayed({ timeout: 5000 });
        await this.inputEmail.setValue(email);
        await this.inputPassword.setValue(password);
        await this.btnLogin.click();
    }

    async getErrorMessage() {
        const emailMsg = await this.emailMessage;
        const passwordMsg = await this.passwordMessage;

        if (await emailMsg.isDisplayed()) {
            return await emailMsg.getText();
        }
        if (await passwordMsg.isDisplayed()) {
            return await passwordMsg.getText();
        }
        return '';
    }
}

module.exports = new LoginPage();
