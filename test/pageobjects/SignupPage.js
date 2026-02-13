const BasePage = require('./BasePage');
const logger = require('../helpers/logger');

class SignupPage extends BasePage {
    get inputEmail() { return $('#email'); }
    get inputPassword() { return $('#password'); }
    get inputPasswordConfirmation() { return $('#password-confirmation'); }
    get inputUsername() { return $('#username'); }
    get rankPremium() { return $('#rank-premium'); }
    get rankNormal() { return $('#rank-normal'); }
    get inputAddress() { return $('#address'); }
    get inputTel() { return $('#tel'); }
    get selectGender() { return $('#gender'); }
    get inputBirthday() { return $('#birthday'); }
    get checkboxNotification() { return $('#notification'); }
    get btnSignup() { return $('#signup-form button[type="submit"]'); }
    get emailInvalidFeedback() { return $('#email ~ .invalid-feedback'); }

    async open() {
        await super.open('signup.html');
    }

    async signup(data) {
        logger.info(`Signing up user: ${data.email}`);
        await this.inputEmail.waitForDisplayed({ timeout: 5000 });
        await this.inputEmail.setValue(data.email);
        await this.inputPassword.setValue(data.password);
        await this.inputPasswordConfirmation.setValue(data.passwordConfirmation);
        await this.inputUsername.setValue(data.username);

        if (data.rank === 'premium') {
            await this.rankPremium.click();
        } else if (data.rank === 'normal') {
            await this.rankNormal.click();
        }

        if (data.address) {
            await this.inputAddress.setValue(data.address);
        }
        if (data.tel) {
            await this.inputTel.setValue(data.tel);
        }
        if (data.gender) {
            await this.selectGender.selectByAttribute('value', data.gender);
        }
        if (data.birthday) {
            await this.inputBirthday.setValue(data.birthday);
        }
        if (data.notification) {
            await this.checkboxNotification.click();
        }

        await this.btnSignup.click();
    }

    async isEmailInvalid() {
        const emailInput = await this.inputEmail;
        const validationMessage = await browser.execute(
            (el) => el.validationMessage,
            await emailInput
        );
        return validationMessage !== '';
    }
}

module.exports = new SignupPage();
